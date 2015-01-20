
var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Dispatcher = require('../dispatcher/AppDispatcher'),
    LoadActionCreator = require('./LoadActionCreators'),
    debug = require('debug')('ApiProductPriceHistoryActionCreator.js'),
    productPriceHistoryAction = ActionTypes.ProductPriceHistory,
    ProductServerActionCreator;

ProductServerActionCreator = {

    // normally will be called when the player wants to update something realted to the price history
    // like being alerted of certain prices, etc
    productPriceHistoryUpdate: function (id) {

        id = id || null;

        // the server receive the product update event but hasn't returned anything yet
        if(!id) {
            debug('productPriceHistoryUpdate - Started syncing with server - no data yet');
            LoadActionCreator.load('PRODUCT_PRICE_HISTORY_UPDATE_START', true);
            Dispatcher.handleServerAction({
                type: productPriceHistoryAction.PRODUCT_PRICE_HISTORY_UPDATE_START,
                data: null
            });
        } else {
            // if there was an error while trying to update the product in the server
            LoadActionCreator.loaded('PRODUCT_PRICE_HISTORY_UPDATE_START', false);
            if (id instanceof Error) {
                Dispatcher.handleServerAction({
                    type: productPriceHistoryAction.PRODUCT_PRICE_HISTORY_UPDATE_ERROR,
                    data: { id : id }
                });
            } else {
                // product was successfully updated in the serve
                Dispatcher.handleServerAction({
                    type: productPriceHistoryAction.PRODUCT_PRICE_HISTORY_UPDATE_SUCCESS,
                    data: { id : id }
                });
            }
        }
    },
    // action that should be called by the API (server) after the retrieval of
    // product price history data
    setAllProductsPriceHistory: function (products) {

        products = products || null;

        // if there is no product set yet (nothing returned from the server)
        if (!products) {
            debug('setAllProductsPriceHistory - Started syncing with server - no data yet');
            LoadActionCreator.load('RECEIVE_PRODUCT_PRICE_HISTORY_START', true);
            Dispatcher.handleServerAction({
                type: productPriceHistoryAction.RECEIVE_PRODUCT_PRICE_HISTORY_START,
                data: null
            });
        } else {
            // if there was an error while trying to retrive the products
            LoadActionCreator.loaded('RECEIVE_PRODUCT_PRICE_HISTORY_START', false);
            if (products instanceof Error) {
                Dispatcher.handleServerAction({
                    type: productPriceHistoryAction.RECEIVE_PRODUCT_PRICE_HISTORY_ERROR,
                    data: products
                });
            } else { // everything went fine, dispatch the event with the product data
                Dispatcher.handleServerAction({
                    type: productPriceHistoryAction.RECEIVE_PRODUCT_PRICE_HISTORY_SUCCESS,
                    data: products
                });
            }
        }
    }
};

module.exports = ProductServerActionCreator;
