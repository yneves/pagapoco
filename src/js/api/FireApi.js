var Firebase = require('firebase'),
    lodash = {
        objects: {
            assign: require('lodash-node/modern/objects/assign'),
            defaults: require('lodash-node/modern/objects/defaults'),
            values: require('lodash-node/modern/objects/values'),
            keys: require('lodash-node/modern/objects/keys')
        },
        collections: {
            forEach: require('lodash-node/modern/collections/forEach')
        },
        utilities: {
            inflection: require('underscore.inflections')
        }
    },
    baseUrl = 'http://glowing-torch-4538.firebaseio.com/',
    authKey = '',   // for server side only, on client side will cause bugs
    debug = require('debug')('FireApi.js'),
    refs,
    tables;

tables = [
    'Users',
    'players_lists',
    'products',
    'products_price_history',
    'suppliers'         // TODO add the remaining filters later
];

refs = {};

// extend the Firebase prototype adding some useful methods for pagapo.co project
lodash.objects.assign(Firebase.prototype, {
    /**
     * Get all data from a certain root child of firebase
     * return Array (empty or not) or Error Object
     */
    getAll: function (limit, callback) {

        var errorFunc,
            beforeCb;

        callback = typeof callback === 'function' ? callback : function (err) { debug(err); };
        limit = parseInt(limit) || null;
        errorFunc = function (err) {
            if (err) {
                debug('No permission to read data');
                callback(new Error(err)); // empty, no data got from the server
            } else {
                callback(new Error('An unknown error has ocurred'));
            }
        };
        beforeCb = function (snapshot) {
            var data,
                childData;

            data = [];
            // snapshot should contain a list of products
            if (snapshot.val() !== null) {
                // loop through the snapshot data object
                snapshot.forEach( function (childSnapshot) {

                    // childData will be the actual contents of the child
                    childData = childSnapshot.val() || {};
                    // set the key as the firebase key, needed because
                    // firebase has no support for arrays and our collection/model
                    // object need this for correct data manipulation
                    // also we run pareInt because integer type data arrive from DB
                    // as a string, so we need to perform this check
                    childData.id = parseInt(childSnapshot.key()) || childSnapshot.key();
                    // add the product to the list to be added to the collection
                    data.push(childData);
                });
            }
            callback(data);
        };

        // default implementation to get data from firebase
        if (limit) {
            this.limitToLast(30).once('value', beforeCb, errorFunc);
        } else {
            this.once('value', beforeCb, errorFunc);
        }

    },
    /**
     * Save some data by creating an empty key and then setting it's data
     * return firebase error or an Error object
     */
    createWithKey: function (key, model, callback) {

        var modelData,
            modelRef;

        callback = typeof callback === 'function' ? callback : function (err) { debug(err); };
        modelData = {};
        modelData[key] = false;

        try {
            // first let's create an empty key in the database
            this.update(modelData, function (err) {
                if (!err) {
                    // if no errors, let's find the modelRef and than update it with the wanted data
                    // for this matter we delegate to the create method already created bellow
                    modelRef = this.child(key);
                    modelRef.create(model, function (err) {
                        if (err) {
                            debug('createWithKey - create - error ocurred');
                            callback(new Error(err));
                        } else {
                            callback();
                        }
                    });
                } else {
                    debug('createWithkey - update - error ocurred');
                    callback(new Error(err));
                }
            }.bind(this));
        } catch (err) {
            debug('An error exception has ocurred while trying to update the data in the DB');
            callback(new Error(err)); // true because error
        }
    },
    create: function (model, callback) {

        var data;

        callback = typeof callback === 'function' ? callback : function (err) { debug(err); };

        // let's make sure we are working with a valid Model instance
        if (model && typeof model.toJSON === 'function') {
            data = model.toJSON();
        } else {
            // no model, fuck this shit
            throw new Error('Invalid model or no toJSON method found');
        }

        // we never save the id because in firebase the ID is the key of the data, not another attribute
        if (data && data[model.idAttribute]) {
            delete data[model.idAttribute];
        }

        // add some failguard, avoiding user ovewrite some root table entirely
        if (this.parent().toString() === this.root().toString()) {
            callback(new Error('This method cannot be called from an Root table, try using createWithKey method'));
        } else {
            try {
                // just set the data at the reference sended
                this.set(data, function (err) {
                    if (err) {
                        debug('Create error ocurred');
                        callback(new Error(err));
                    } else {
                        callback();
                    }
                });
            } catch (err) {
                debug('An error exception has ocurred while trying to update the data in the DB');
                callback(new Error(err)); // true because error
            }
        }
    },
    save: function (model, callback) {

        var data;

        callback = typeof callback === 'function' ? callback : function (err) { debug(err); };

        if (model && typeof model.toJSON === 'function') {
            data = model.toJSON();
        } else {
            callback(new Error('Invalid model or no toJSON method found'));
        }

        // we never save the id because in firebase the ID is the key of the data, not another attribute
        if (data && data[model.idAttribute]) {
            delete data[model.idAttribute];
        }

        try {
            this.update(data, function (err) {
                if (err) {
                    debug('Save error ocurred');
                    callback(new Error(err));
                } else {
                    callback();
                }
            });
        } catch (err) {
            debug('An error exception has ocurred while trying to update the data in the DB');
            callback(new Error(err)); // true because error
        }
    },
    remove: function (model, callback) {

        var modelKey;

        callback = typeof callback === 'function' ? callback : function (err) { debug(err); };

        if (model && typeof model.get === 'function') {
            modelKey = model.get('id');
        } else {
            throw new Error('Invalid model or no get method found');
        }

        if (modelKey) {  // modelId can either be modelId or undefined
            try {
                this.child(modelKey).remove( function (err) {
                    if (err) {
                        debug('Remove error ocurred');
                        callback(new Error(err));
                    } else {
                        callback();
                    }
                });
            } catch (err) {
                debug('An error exception has ocurred while trying to remove a model from the DB');
                callback(new Error(err)); // true because error
            }
        } else {
            callback(new Error('Model has no key to remove, that means that either there was an error or the model is not saved in the database yet'));
        }
    },
    /*
     * Method that search by proximity/similratiy using ElasticSearch algorithms
     *
     */
    searchFor: function (searchObj, options, callback) {

        var searchRef,
            searchKey,
            defaultOptions,
            type,
            data;

        // this method need's an obrigatory callback
        if (!callback || typeof callback !== 'function') return;
        data = [];

        // #ref http://www.elasticsearch.org/guide/en/elasticsearch/client/javascript-api/current/api-reference.html
        defaultOptions = {
            from: 0,    // offset of results
            size: 10    // total ammount of results to return, 10 is the elasticsearch default
        };
        // override default options of search
        lodash.objects.defaults(options, defaultOptions);

        // make sure we are searching for in a low level base (products, products_price_history, etc)
        if (this.parent().toString() !== this.root().toString()) {
            callback(new Error('We need a reference to the base table of what you are looking for'));
        } else {
            // the type is always singular and the firebase database is always plural
            // so we need to perform this change here
            type = lodash.utilities.inflection.singularize(this.key());
        }

        // stringify the query, so values like foo.bar are valid for firebase
        searchObj.query = JSON.stringify(searchObj.query);

        // create a new firebase instance
        // TODO using ref (declared bellow) would be better? Not sure...
        searchRef = new Firebase(baseUrl + '/search');

        // TODO the size was increased in order to avoid problems with limiting by the filters
        lodash.objects.defaults(searchObj, {index: 'firebase', type: type, options: options});

        if (!searchObj.query) {
            throw new Error('We need a query to perform a search');
        }

        // create a temporary entry on search/request
        // after that return the key to create a watch to get it once
        // the database finish doing it's thing
        searchKey = searchRef.child('request').push(searchObj).key();

        // watch the response, once it's ready, get the data. It will be
        // the ElasticSearch response
        searchRef.child('response/'+searchKey).on('value', function (snapshot) {
            // snapshot should contain a list of products
            if (snapshot.val() !== null) {
                var hits,
                    score,
                    totalItens;

                hits = snapshot.val().hits;
                score = snapshot.val().max_score;
                total = snapshot.val().total;
                if (parseInt(total)) {
                    // loop through the snapshot data object
                    lodash.collections.forEach(hits, function (childSnapshot) {

                        // childData will be the actual contents of the child
                        childData = childSnapshot._source || {};
                        // set the key as the firebase key, needed because
                        // firebase has no support for arrays and our collection/model
                        // object need this for correct data manipulation
                        // also we run pareInt because integer type data arrive from DB
                        // as a string, so we need to perform this check
                        childData.id = parseInt(childSnapshot._id) || childSnapshot._id;
                        // add the product to the list to be added to the collection

                        data.push(childData);
                    });
                } else {
                    debug('no data from search');
                    callback(data);
                }
            }
            callback(data);
        }, function (err) {
            if (err) {
                debug('No permission to read data');
                callback(new Error(err)); // empty, no data got from the server
            } else {
                callback(new Error('An unknown error has ocurred'));
            }
        });
    },
    // This do find's only on exact matches, for more complex search we
    // are going to use ElasticSearch
    // this method assumes calls of type .once, so data changes on server
    // won't trigger any reload
    findByChild: function (field, term, callback) {

        var modelRef;

        // this method need an obrigatory callback
        if (!callback || typeof callback !== 'function') return;

        try {
            modelRef = this.orderByChild(field).equalTo(term);
        } catch (err) {
            debug('findbyChild error ocurred');
            callback(new Error(err));
        }
        // just get the data and leave the server alone
        modelRef.once('value', function (snapshot) {
            var value,
                data;

            if (snapshot.val() !== null) {
                // TODO look for ways to improve this ugly thing
                value = snapshot.val();
                data = lodash.objects.values(value)[0];
                data.id = lodash.objects.keys(value)[0];
                data.id = parseInt(data.id) || data.id;
            } else {
                data = null;
            }
            callback(data);
        });
    },
    // Used to look for data in the database, this wrapper is better instead of
    // only going straight to .child because with this method we have a good
    // support for error handling (returnning an error object) that works better
    // with the current project, also there are some more helpfull messages.
    // this methods aalso assumes calls of type .once, so data changes on server
    // won't trigger any reload
    findByKey: function (key, callback, idAttribute) {

        var modelRef;

        idAttribute = idAttribute || 'id';

        // this method need an obrigatory callback
        if (!callback || typeof callback !== 'function') return;

        try {
            // firebase will throw an error if no valid identification is sent
            modelRef = this.child(key);
        } catch (err) {
            debug('findByKey error ocurred');
            callback(new Error(err));
        }
        // just get the data and  leave the server alone
        modelRef.once('value', function (snapshot) {
            var value,
                data;

            if (snapshot.val() !== null) {
                // childData will be the actual contents of the child
                data = snapshot.val() || {};
                // set the key as the firebase key, needed because
                // firebase has no support for arrays and our collection/model
                // object need this for correct data manipulation
                // also we run pareInt because integer type data arrive from DB
                // as a string, so we need to perform this check
                data[idAttribute] = parseInt(snapshot.key()) || snapshot.key();
            } else {
                data = null;
            }
            callback(data);
        });
    }
});

// set the base url
refs.base = new Firebase(baseUrl);

if (authKey) {
    refs.base.authWithCustomToken(authKey, function (error, result)  {
        if (error) {
            debug(error);
            throw new Error('Could not authenticate with firebase');
        }
    });
}

// set all the others
if (tables.length) {
    lodash.collections.forEach(tables, function (value) {
        refs[value] = refs.base.child(value);
    });
}

module.exports = refs;
