
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
    _currentQuery;

ProductAction = ActionTypes.Product;
RouteAction = ActionTypes.Route;

_products = null;
_currentCatalog = [];
_currentPlayer = null;
_currentProductSlug = '';
_currentQuery = '';
_currentProduct = null;
_isLoading  = true;

function receivePlayer(data) {
    // TODO should be a model
    _currentPlayer = data;
}

function setProductsError() {
    _isLoading = false;
}

function setProducts(data) {
    if (data) {
        _products = data.clone();
        _isLoading = false;
        _currentCatalog = data.clone();
        setCurrentProduct();
    } else {
        _isLoading = true;
    }
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

function setCurrentError (error) {
    _isLoading = false;
}

function setCurrentProduct() {
    if (_currentProductSlug && _products) {
        _currentProduct = _products.findWhere({'slug' : _currentProductSlug});
    } else {
        _currentProduct = null;
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
        return _currentProduct;
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
    ProductAction.PRODUCT_SET_START, setProducts,
    ProductAction.PRODUCT_SET_ERROR, setProductsError,
    ProductAction.PRODUCT_SET_SUCCESS, setProducts
    // ProductAction.PRODUCT_SAVE_START, saveStart,
    // ProductAction.PRODUT_SAVE_ERROR, saveError,
    // ProductAction.PRODUCT_SAVE_SUCCESS, saveSuccess
);

module.exports = ProductInstance;
