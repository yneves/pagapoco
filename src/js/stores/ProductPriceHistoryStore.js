
var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Store = require('../utils/Store'),
    debug = require('debug')('ProductPriceHistoryStore.js'),
    ProductPriceHistoryStore,
    ProductPriceHistoryInstance,
    ProductPriceHistoryAction,
    RouteAction,
    _history,
    _currentCatalog;

ProductPriceHistoryAction = ActionTypes.ProductPriceHistory;
RouteAction = ActionTypes.Route;

_history = null;
_isLoading  = true;

function updateStart() {
}

function updateError() {
}

function updateSuccess() {
}

function receiveStart() {
    _isLoading = true;
}

function receiveError() {
    _isLoading = false;
}

function receiveSuccess() {
    _isLoading = false;
}

function receiveProductPriceHistory(data) {
    debug('ProductPriceHistory Received');
    debug(data);
    _history = data;
    receiveSuccess();
}

ProductPriceHistoryStore = Store.extend({

    getCatalog: function () {
        return _history;
    },

    getProduct: function (productId) {
        if (_history) {
            return _history.findWhere({ id: productId });
        }
    },

    getLoadingState: function() {
        return _isLoading;
    }

});

ProductPriceHistoryInstance = new ProductPriceHistoryStore(
    ProductPriceHistoryAction.RECEIVE_PRODUCT_PRICE_HISTORY_START, receiveStart,
    ProductPriceHistoryAction.RECEIVE_PRODUCT_PRICE_HISTORY_ERROR, receiveError,
    ProductPriceHistoryAction.RECEIVE_PRODUCT_PRICE_HISTORY_SUCCESS, receiveProductPriceHistory,
    ProductPriceHistoryAction.PRODUCT_PRICE_HISTORY_UPDATE_START, updateStart,
    ProductPriceHistoryAction.PRODUCT_PRICE_HISTORY_UPDATE_ERROR, updateError,
    ProductPriceHistoryAction.PRODUCT_PRICE_HISTORY_UPDATE_SUCCESS, updateSuccess
);

module.exports = ProductPriceHistoryInstance;
