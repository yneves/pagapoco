
var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Store = require('../utils/Store'),
    debug = require('debug')('ProductPriceHistoryStore.js'),
    ProductPriceHistoryStore,
    ProductPriceHistoryInstance,
    ProductPriceHistoryAction,
    RouteAction,
    _history,
    _currentCatalog;

ProductAction = ActionTypes.Product;
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
    if (data instanceof Error) {
        debug('Error receiving product price history');
    } else {
        debug('received product price history success');
        _history = data;
        receiveSuccess();
    }

}

ProductPriceHistoryStore = Store.extend({

    getCatalog: function () {
        return _history;
    },

    getProduct: function () {
        if (_history && _history.models[0]) {
            return _history.models[0];
        }
    },

    getLoadingState: function() {
        return _isLoading;
    }

});

ProductPriceHistoryInstance = new ProductPriceHistoryStore(
    ProductAction.RECEIVE_PRODUCT_PRICE_HISTORY_START, receiveStart,
    ProductAction.RECEIVE_PRODUCT_PRICE_HISTORY_ERROR, receiveError,
    ProductAction.RECEIVE_PRODUCT_PRICE_HISTORY_SUCCESS, receiveProductPriceHistory,
    ProductAction.PRODUCT_PRICE_HISTORY_UPDATE_START, updateStart,
    ProductAction.PRODUCT_PRICE_HISTORY_UPDATE_ERROR, updateError,
    ProductAction.PRODUCT_PRICE_HISTORY_UPDATE_SUCCESS, updateSuccess
);

module.exports = ProductPriceHistoryInstance;
