
var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Dispatcher = require('../dispatcher/AppDispatcher'),
    LoadActionCreator = require('./LoadActionCreators'),
    debug = require('debug')('ApiFilterActionCreator.js'),
    filterAction = ActionTypes.Filter,
    ApiFilterActionCreator;

ApiFilterActionCreator = {

    // set the filters
    setFilters: function (filters) {

        filters = filters || null;

        // if there is no product set yet (nothing returned from the server)
        if (!filters) {
            LoadActionCreator.load('FILTER_SET_START', true);
            Dispatcher.handleServerAction({
                type: filterAction.FILTER_SET_START,
                data: null
            });
        } else {
            // if there was an error while trying to retrive the products
            LoadActionCreator.loaded('FILTER_SET_START', false);
            if (filters instanceof Error) {
                Dispatcher.handleServerAction({
                    type: filterAction.FILTER_SET_ERROR,
                    data: filters
                });
            } else { // everything went fine, dispatch the event with the product data
                Dispatcher.handleServerAction({
                    type: filterAction.FILTER_SET_SUCCESS,
                    data: filters
                });
            }
        }
    }
};

module.exports = ApiFilterActionCreator;
