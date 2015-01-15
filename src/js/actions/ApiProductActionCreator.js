
var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Dispatcher = require('../dispatcher/AppDispatcher'),
    debug = require('debug')('ApiProductActionCreator.js'),
    productAction = ActionTypes.Product,
    ProductServerActionCreator;

ProductServerActionCreator = {

    // represent one of many possible updates like:
    // quantity, added/removed and wished
    productUpdate: function (id) {

        id = id || null;

        // the server receive the product update event but hasn't returned anything yet
        if(!id) {
            Dispatcher.handleServerAction({
                type: productAction.PRODUCT_UPDATE_START,
                data: null
            });
        } else {
            // if there was an error while trying to update the product in the server
            if (id instanceof Error) {
                Dispatcher.handleServerAction({
                    type: productAction.PRODUCT_UPDATE_ERROR,
                    data: { id : id }
                });
            } else {
                // product was successfully updated in the serve
                Dispatcher.handleServerAction({
                    type: productAction.PRODUCT_UPDATE_SUCCESS,
                    data: { id : id }
                });
            }
        }
    },
    // action that should be called by the API (server) when retrieving product data
    setAllProducts: function (products) {

        products = products || null;

        // if there is no product set yet (nothing returned from the server)
        if (!products) {
            console.log('no products yet');
            Dispatcher.handleServerAction({
                type: productAction.RECEIVE_RAW_PRODUCTS_START,
                data: null
            });
        } else {
            // if there was an error while trying to retrive the products
            if (products instanceof Error) {
                Dispatcher.handleServerAction({
                    type: productAction.RECEIVE_RAW_PRODUCTS_ERROR,
                    data: products
                });
            } else { // everything went fine, dispatch the event with the product data
                Dispatcher.handleServerAction({
                    type: productAction.RECEIVE_RAW_PRODUCTS_SUCCESS,
                    data: products
                });
            }
        }
    }
};

module.exports = ProductServerActionCreator;
