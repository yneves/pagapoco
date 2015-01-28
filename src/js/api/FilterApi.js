/*
 In this file should be everything that is product related iteration with the
 server, to get data and to sync data back.
 */

var db = require('./FireApi.js'),
    ApiFilterActionCreator = require('../actions/ApiFilterActionCreator'),
    Supplier = require('../data/Supplier'),
    Package = require('../data/Package'),
    Transmuter = require('transmuter'),
    debug = require('debug')('FilterApi.js'),
    FilterApi;

FilterApi = {

    getFilters: function () {

        function dispatchDataIfValid(firebaseData, modelData) {
            if (firebaseData instanceof Error) {
                // if there is an error let's dispatch an event and end here
                ApiFilterActionCreator.setFilters(firebaseData);
                debug('Error trying to get filters');
            } else {
                if (firebaseData instanceof Array) {
                    if (firebaseData.length) {
                        // we've got data, let's set it
                        modelData.create(firebaseData);
                        ApiFilterActionCreator.setFilters(modelData.collection);
                    } else {
                        debug('No filters received');
                        ApiFilterActionCreator.setFilters({});
                    }
                } else {
                    debug('Error: data is not an instance of Array');
                    ApiFilterActionCreator.setFilters(new Error('Invalid type: Filter data should be of type Array'));
                }
            }
        }

        // start fetching, fire event
        ApiFilterActionCreator.setFilters(null);
        db.suppliers.getAll(null, function (supplierData) {
            db.packages.getAll(null, function (packageData) {
                dispatchDataIfValid(supplierData, Supplier);
                dispatchDataIfValid(packageData, Package);
            });
        });
    },

    // get all needed data to calculate the price range filter
    getPriceRangeFilter: function () {

        // TODO

        // create a new database table called products_best_price
        // and save all current day best prices there
        // sugestion: http://stackoverflow.com/questions/26910242/querying-nested-data-in-firebase

        // get all the prices and extract the max and min

        // divide by the ammount of filter we want to set (like 6)

        // send the values to the filter store
    }
};

module.exports = FilterApi;
