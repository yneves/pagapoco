
var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Dispatcher = require('../dispatcher/AppDispatcher'),
    LoadActionCreator = require('./LoadActionCreators'),
    debug = require('debug')('ApiProductActionCreator.js'),
    productAction = ActionTypes.Product,
    ProductServerActionCreator;

ProductServerActionCreator = {

    // represent one of many possible updates like:
    // quantity, added/removed and wished
    saveProducts: function (id) {

        id = id || null;

        // the server receive the product update event but hasn't returned anything yet
        if(!id) {
            debug('Started syncing with server - no data yet');
            LoadActionCreator.load('PRODUCT_SAVE_START', true);
            Dispatcher.handleServerAction({
                type: productAction.PRODUCT_SAVE_START,
                data: null
            });
        } else {
            // if there was an error while trying to update the product in the server
            LoadActionCreator.loaded('PRODUCT_SAVE_START', false);
            if (id instanceof Error) {
                debug('Server responded - With error');
                Dispatcher.handleServerAction({
                    type: productAction.PRODUCT_SAVE_ERROR,
                    data: { id : id }
                });
            } else {
                debug('Server responded - no errors');
                // product was successfully updated in the serve
                Dispatcher.handleServerAction({
                    type: productAction.PRODUCT_SAVE_SUCCESS,
                    data: { id : id }
                });
            }
        }
    },
    // action that should be called by the API (server) when retrieving product data
    setProducts: function (products) {

        products = products || null;

        // if there is no product set yet (nothing returned from the server)
        if (!products) {
            debug('Started syncing with server - no data yet');
            LoadActionCreator.load('PRODUCT_SET_START', true);
            Dispatcher.handleServerAction({
                type: productAction.PRODUCT_SET_START,
                data: null
            });
        } else {
            // if there was an error while trying to retrive the products
            LoadActionCreator.loaded('PRODUCT_SET_START', false);
            if (products instanceof Error) {
                debug('Server responded - With error');
                Dispatcher.handleServerAction({
                    type: productAction.PRODUCT_SET_ERROR,
                    data: products
                });
            } else { // everything went fine, dispatch the event with the product data
                debug('Server responded - no errors');
                Dispatcher.handleServerAction({
                    type: productAction.PRODUCT_SET_SUCCESS,
                    data: products
                });
            }
        }
    }
};

module.exports = ProductServerActionCreator;
