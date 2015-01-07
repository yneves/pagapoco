
var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Product = require('../data/Product'),
    Store = require('../utils/Store'),
    assign = require('object-assign'),
    debug = require('debug')('ProductStore.js'),
    ProductStore,
    ProductInstance,
    ProductAction,
    RouteAction;

ProductAction = ActionTypes.Product;
RouteAction = ActionTypes.Route;

var _currentPlayerId = 0;

var _currentProductId = 0;

var _current = null;

function updateStart() {
    // show some "loading" icon or something
}

function updateError() {
    // rollback
}

function updateSuccess() {
    // the model is, allegedly, already updated, so we do nothing
    // and just wait for the emitChange to happen
}

function receiveProducts(data) {
    data.forEach(function (product) {
        Product.create(product);
    });
    debug(Product.collection);
    setCurrentProduct();
}

function changedRouteSuccess(data) {
    var id;
    id = parseInt(data.id) || 0;
    if (id) {
        _currentProductId = id;
    } else {
        _currentProductId = 0;
    }
    setCurrentProduct();
}

function setCurrentProduct() {
    if (_currentProductId) {
        _current = Product.collection.get(_currentProductId);
    } else {
        _current = null;
    }
}

function addItem(data) {
    currentModel = Product.collection.get(data.id);
    if (currentModel.get('added')) {
        currentModel.updateQuantity(1);
    } else {
        currentModel.set('added', true);
    }
    debug(currentModel.attributes);
}

function removeItem(data) {
    currentModel = Product.collection.get(data.id);
    if (currentModel && currentModel.get('added')) {
        currentModel.set('added', false);
    }
}

function increaseItem(data) {
    currentModel = Product.collection.get(data.id);
    currentModel.updateQuantity(1);
}

function decreaseItem(data) {
    currentModel = Product.collection.get(data.id);
    if (currentModel.get('quantity') > 1 ) {
        currentModel.updateQuantity(-1);
    }
}

function toggleWishlist(id) {
    var currentModel;
    // TODO must get this info from another store
    if(_currentPlayerId) {
        currentModel = Product.collection.get(id);
        currentModel.toggleWished();
    }
}

ProductStore = Store.extend({

    init: function () {
      this.currentCatalog = Product.collection.clone();
    },

    getCurrent: function () {
        return _current;
    },

    getAdded: function () {
        return Product.collection.where({added : 1}, false);
    },

    getCatalog: function () {
        return this.currentCatalog;
    },

    applyFilter: function(query) {
        if (query) {
            this.currentCatalog.reset();
            var regExp = new RegExp(query,"i");
            var models = Product.collection.models;
            var length = models.length;
            for (var i = 0; i < length; i++) {
                var model = models[i];
                if (regExp.test(model.attributes.title)) {
                    this.currentCatalog.add(model);
                }
            }
        } else {
            this.currentCatalog.reset(Product.collection.models);
        }
        this.emitChange();
    },

});

ProductInstance = new ProductStore(
    ProductAction.ADD_ITEM, addItem,
    ProductAction.REMOVE_ITEM, removeItem,
    ProductAction.INCREASE_ITEM, increaseItem,
    ProductAction.DECREASE_ITEM, decreaseItem,
    ProductAction.RECEIVE_RAW_PRODUCTS_SUCCESS, receiveProducts,
    ProductAction.TOGGLE_WISHLIST, toggleWishlist,
    ProductAction.PRODUCT_UPDATE_START, updateStart,
    ProductAction.PRODUCT_UPDATE_ERROR, updateError,
    ProductAction.PRODUCT_UPDATE_SUCCESS, updateSuccess,
    RouteAction.CHANGE_ROUTE_SUCCESS, changedRouteSuccess
);

module.exports = ProductInstance;
