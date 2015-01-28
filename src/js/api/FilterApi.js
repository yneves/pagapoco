/*
 In this file should be everything that is product related iteration with the
 server, to get data and to sync data back.
 */

var db = require('./FireApi.js'),
    ApiFilterActionCreator = require('../actions/ApiFilterActionCreator'),
    Supplier = require('../data/Supplier'),
    Transmuter = require('transmuter'),
    debug = require('debug')('FilterApi.js'),
    FilterApi;

FilterApi = {

    getFilters: function () {

        // start fetching, fire event
        ApiFilterActionCreator.setFilters(null);
        db.suppliers.getAll(null, function (data) {
            // if there is an error let's dispatch an event and end here
            if (data instanceof Error) {
                ApiFilterActionCreator.setFilters(data);
                debug('Error trying to get filters');
            } else {
                if (data instanceof Array) {
                    if (data.length) {
                        // we've got data, let's set it
                        Supplier.create(data);
                        ApiFilterActionCreator.setFilters(Supplier.collection);
                    } else {
                        debug('No filters received');
                        ApiFilterActionCreator.setFilters({});
                    }
                } else {
                    debug('Error: data is not an instance of Array');
                    ApiFilterActionCreator.setFilters(new Error('Invalid type: Filter data should be of type Array'));
                }
            }
        });
    },

    // get all needed data to calculate the price range filter
    getPriceRangeFilter: function () {

        // get the max and min price

        // divide by the ammount of filter we want to set (like 6)

        // send the values to the filter store
    }
};

module.exports = FilterApi;
