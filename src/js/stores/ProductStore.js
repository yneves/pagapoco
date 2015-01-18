
var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Store = require('../utils/Store'),
    debug = require('debug')('ProductStore.js'),
    ProductStore,
    ProductInstance,
    ProductAction,
    RouteAction,
    _products,
    _currentCatalog,
    _currentPlayerId,
    _currentProductSlug,
    _currentQuery;

ProductAction = ActionTypes.Product;
RouteAction = ActionTypes.Route;

_products = null;
_currentCatalog = [];
_currentPlayer = null;
_currentProductSlug = '';
_currentQuery = '';
_current = null;
_isLoading  = true;

function receivePlayer(data) {
    // TODO should be a model
    _currentPlayer = data;
}

function setStart() {
    _isLoading = true;
}

function setError() {
    _isLoading = false;
}

function setSuccess(data) {
    _products = data;
    _isLoading = false;
    _currentCatalog = data.clone();
    setCurrentProduct();
}

function changedRouteSuccess(routeData) {

    var slug;
    if (routeData.link) {
        slug = routeData.link.slug || '';
    }
    if (slug) {
        _currentProductSlug = slug;
    } else {
        _currentProductSlug = 0;
    }
    setCurrentProduct();
}

function setCurrentProduct() {
    if (_currentProductSlug && _products) {
        _current = _products.findWhere({'slug' : _currentProductSlug});
    } else {
        _current = null;
    }
}

function toggleWishlist(productId) {
    var currentModel;
    // if there is a player we set the wishlist, otherwise just ignore the request
    if(_currentPlayer.get('id')) {
        currentModel = _products.get(productId);
        currentModel.toggleWished();
    }
}

function searchProducts(data) {
    _currentQuery = data.query;
}

ProductStore = Store.extend({

    getCurrent: function () {
        return _current;
    },

    getWished: function () {
        return _currentCatalog.where({wished: 1}, false);
    },

    getCatalog: function () {
        return _products;
    },

    getCurrentCatalog: function () {
        return _currentCatalog;
    },

    getLoadingState: function(){
        return _isLoading;
    }

});

ProductInstance = new ProductStore(
    ProductAction.TOGGLE_WISHLIST, toggleWishlist,
    ProductAction.SEARCH_PRODUCTS, searchProducts,
    RouteAction.CHANGE_ROUTE_SUCCESS, changedRouteSuccess,
    ProductAction.PRODUCT_SET_START, setStart,
    ProductAction.PRODUCT_SET_ERROR, setError,
    ProductAction.PRODUCT_SET_SUCCESS, setSuccess
    // ProductAction.PRODUCT_SAVE_START, saveStart,
    // ProductAction.PRODUT_SAVE_ERROR, saveError,
    // ProductAction.PRODUCT_SAVE_SUCCESS, saveSuccess
);

module.exports = ProductInstance;
