
var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Dispatcher = require('../dispatcher/AppDispatcher'),
    Validator = require('../utils/Validator'),
    api = require('../api/AppApi'),
    debug = require('debug')('ProductPriceHistoryActionCreator.js'),
    productPriceHistoryAction = ActionTypes.ProductPriceHistory,
    ProductPriceHistoryActionCreator;

ProductPriceHistoryActionCreator = {

    // called when a player want's to add a product to a list
    addPriceAlert: function (productId) {
        Dispatcher.handleViewAction({
            type : productPriceHistoryAction.ADD_PRICE_ALERT,
            data : { id : productId }
        });

        if (Validator.isFunction(api.productPriceHistory.syncProductPriceHistory)) {
            api.productPriceHistory.syncProductPriceHistory(productId);
        } else {
            debug('No syncProductPriceHistory valid method found');
        }
    },

    // called when a player want's to remove a product from a list
    removePriceAlert: function (productId) {
        Dispatcher.handleViewAction({
            type : productPriceHistoryAction.REMOVE_PRICE_ALERT,
            data : { id : productId }
        });

        if (Validator.isFunction(api.productPriceHistory.syncProductPriceHistory)) {
            api.productPriceHistory.syncProductPriceHistory(productId);
        } else {
            debug('No syncProductPriceHistory valid method found');
        }
    }
};

module.exports = ProductActionCreator;
