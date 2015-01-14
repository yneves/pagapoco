var Firebase = require('firebase'),
    lodash = {
        objects: {
            assign: require('lodash-node/modern/objects/assign')
        },
        collections: {
            forEach: require('lodash-node/modern/collections/forEach')
        }
    },
    baseUrl = 'http://glowing-torch-4538.firebaseio.com/',
    authKey = 'PCEpiBg4lVOJjSeCZqCIgUitMDmuemq2tjtJ1i6v',
    debug = require('debug')('FireApi.js'),
    refs,
    tables;

tables = [
    'products',
    'products_price_history'
];

refs = {};

// extend the Firebase prototype adding some useful methods for pagapo.co project
lodash.objects.assign(Firebase.prototype, {
    getAll: function (callback) {

        var data;

        callback = typeof callback === 'function' ? callback : function (err) { debug(err); };
        data = [];

        // default implementation to get data from firebase
        this.once('value', function (snapshot) {
            // snapshot should contain a list of products
            if (snapshot.val() !== null) {

                var childData;

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
        }, function (err) {
            if (err) {
                debug('No permission to read data');
                callback(new Error('No permission to read data')); // empty, no data got from the server
            }
        });
    },
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
                    this.create(modelRef, model, callback);
                } else {
                    callback(err);
                }
            }.bind(this));
        } catch (err) {
            debug('An error has ocurred while trying to update the data in the DB');
            debug(err);
            callback(true); // true because error
        }
    },
    create: function (reference, model, callback) {

        var data;

        callback = typeof callback === 'function' ? callback : function (err) { debug(err); };

        // let's make sure we are working with a valid Model instance
        if (model && lodash.objects.isFunction(model.toJSON)) {
            data = model.toJSON();
        } else {
            // no model, fuck this shit
            throw new Error('Invalid model or no toJSON method found');
        }

        // we never save the id because in firebase the ID is the key of the data, not another attribute
        if (data && data.id) {
            delete data.id;
        }

        try {
            // just set the data at the reference sended
            reference.set(data, callback);
        } catch (err) {
            debug('An error has ocurred while trying to update the data in the DB');
            debug(err);
            callback(true); // true because error
        }
    },
    save: function (reference, model, callback) {

        var data;

        callback = typeof callback === 'function' ? callback : function (err) { debug(err); };

        if (model && typeof model.toJSON === 'function') {
            data = model.toJSON();
        } else {
            throw new Error('Invalid model or no toJSON method found');
        }

        // we never save the id because in firebase the ID is the key of the data, not another attribute
        if (data && data.id) {
            delete data.id;
        }

        try {
            reference.update(data, callback);
        } catch (err) {
            debug('An error has ocurred while trying to update the data in the DB');
            debug(err);
            callback(true); // true because error
        }
    },
    remove: function (reference, model, callback) {

        var modelKey;

        callback = typeof callback === 'function' ? callback : function (err) { debug(err); };

        if (model && typeof model.get === 'function') {
            modelKey = model.get('id');
        } else {
            throw new Error('Invalid model or no get method found', 'DB.js', 141);
        }

        if (modelKey) {  // modelId can either be modelId or undefined
            try {
                reference.child(modelKey).remove(callback);
            } catch (err) {
                debug('An error has ocurred while trying to remove a model from the DB');
                debug(err);
                callback(true); // true because error
            }
        }
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
