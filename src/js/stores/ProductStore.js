
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
    _currentProductSlug;

ProductAction = ActionTypes.Product;
RouteAction = ActionTypes.Route;

_products = null;
_currentCatalog = [];
_currentPlayer = null;
_currentProductSlug = '';
_current = null;
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

function receivePlayer(data) {
    // TODO should be a model
    _currentPlayer = data;
}

function receiveProducts(data) {
    debug('Products Received');
    debug(data);
    _products = data;
    _currentCatalog = data.clone();
    setCurrentProduct();
    receiveSuccess();
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

function applyFilter(data) {
    if (_products && _products.models) {
        var models = _products.models;
        if (data.query) {
            var regExp = new RegExp(data.query,'i');
            models = models.filter(function(model) {
              return regExp.test(model.attributes.title);
            });
        }
        _currentCatalog.reset(models);
    }
}

// function addItem(data) {
//     currentModel = Product.collection.get(data.id);
//     if (currentModel.get('added')) {
//         currentModel.updateQuantity(1);
//     } else {
//         currentModel.set('added', true);
//     }
//     debug(currentModel.attributes);
// }
// function removeItem(data) {
//     currentModel = Product.collection.get(data.id);
//     if (currentModel && currentModel.get('added')) {
//         currentModel.set('added', false);
//     }
// }

// function increaseItem(data) {
//     currentModel = Product.collection.get(data.id);
//     currentModel.updateQuantity(1);
// }
//
// function decreaseItem(data) {
//     currentModel = Product.collection.get(data.id);
//     if (currentModel.get('quantity') > 1 ) {
//         currentModel.updateQuantity(-1);
//     }
// }

ProductStore = Store.extend({

    getCurrent: function () {
        return _current;
    },

    getAdded: function () {
        return _products.where({added : 1}, false);
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
    // ProductAction.ADD_ITEM, addItem,
    // ProductAction.REMOVE_ITEM, removeItem,
    // ProductAction.INCREASE_ITEM, increaseItem,
    // ProductAction.DECREASE_ITEM, decreaseItem,
    ProductAction.RECEIVE_RAW_PRODUCTS_START, receiveStart,
    ProductAction.RECEIVE_RAW_PRODUCTS_ERROR, receiveError,
    ProductAction.RECEIVE_RAW_PRODUCTS_SUCCESS, receiveProducts,
    ProductAction.TOGGLE_WISHLIST, toggleWishlist,
    ProductAction.APPLY_FILTER, applyFilter,
    ProductAction.PRODUCT_UPDATE_START, updateStart,
    ProductAction.PRODUCT_UPDATE_ERROR, updateError,
    ProductAction.PRODUCT_UPDATE_SUCCESS, updateSuccess,
    RouteAction.CHANGE_ROUTE_SUCCESS, changedRouteSuccess
);

module.exports = ProductInstance;
