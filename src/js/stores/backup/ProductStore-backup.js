
var ActionTypes = require('../constants/AppConstants').ActionTypes,
    AppDispatcher = require('../dispatcher/AppDispatcher'),
    Product = require('../data/Product'),
    Store = require('../utils/Store'),
    assign = require('object-assign'),
    debug = require('debug')('ProductStore.js'),
    ProductAction,
    RouteAction;

ProductAction = ActionTypes.Product;
RouteAction = ActionTypes.Route;

var _currentPlayerId = 0,
    _currentProductId = 0,
    _current = null;

function _toggleWished(id) {
    var currentModel;
    if(_currentPlayerId) {
        currentModel = Product.collection.get(id);
        currentModel.toggleWished();
    }
}

function _setCurrentProductId(id) {
    id = parseInt(id) || 0;
    if (id) {
        _currentProductId = id;
    } else {
        _currentProductId = 0;
    }
}

function _setCurrentProduct() {
    if (_currentProductId) {
        _current = Product.collection.get(_currentProductId);
    } else {
        _current = null;
    }
}

/**
 * Set store and define its public API, the component will use it to get data from the store and also to listen to it
 */
var ProductStore =

    assign({}, Store, {

        CHANGE_EVENT: 'change_product',

        getCurrent: function () {
            return _current;
        },

        getAdded: function () {
            return Product.collection.where({added : 1}, false);
        },

        getCatalog: function () {
            debug('pegando catalogo de novo');
            debug(Product.collection);
            return Product.collection;
        }
    });

/**
 * Associate Store with its internal events
 *
 * Bellow it is a description on how the store are going to listen from the events the Dispatcher Send to it and what
 * it is suposed to do
 *
 */

ProductStore.dispatchToken = AppDispatcher.register(function (payload) {

    var action,
        shouldEmitChange,
        currentModel,
        id;

    // shortcut
    action = payload.action;
    shouldEmitChange = true;

    switch (action.type) {

        case ProductAction.ADD_ITEM:
            currentModel = Product.collection.get(payload.action.data.id);
            if (currentModel.get('added')) {
                currentModel.updateQuantity(1);
            } else {
                currentModel.set('added', true);
            }
            debug(currentModel.attributes);
            break;

        case ProductAction.REMOVE_ITEM:
            currentModel = Product.collection.get(payload.action.data.id);
            if (currentModel && currentModel.get('added')) {
                currentModel.set('added', false);
            }
            break;

        case ProductAction.INCREASE_ITEM:
            currentModel = Product.collection.get(payload.action.data.id);
            currentModel.updateQuantity(1);
            break;

        case ProductAction.DECREASE_ITEM:
            currentModel = Product.collection.get(payload.action.data.id);
            if (currentModel.get('quantity') > 1 ) {
                currentModel.updateQuantity(-1);
            }
            break;

        case ProductAction.TOGGLE_WISHLIST:
            _toggleWished(payload.action.data.id);
            break;

        case ProductAction.PRODUCT_UPDATE_START:
            // do nothing for now
            break;

        case ProductAction.PRODUCT_UPDATE_ERROR:
            // the model is, allegedly, already updated, so we do nothing
            // and just wait for the emitChange to happen
            break;

        case ProductAction.PRODUCT_UPDATE_SUCCESS:
            // the product was optimistically update, so we do nothing
            // and cancel the emitChange
            shouldEmitChange = false;
            break;

        case ProductAction.RECEIVE_RAW_PRODUCTS_START:
            // should have some loading screen bar shown to the user
            break;

        case ProductAction.RECEIVE_RAW_PRODUCTS_ERROR:
            // should have some data to display to the user as an error
            // like "oops, something went wrong.. try reloading your browser"
            debug(payload.action.data);
            break;

        case ProductAction.RECEIVE_RAW_PRODUCTS_SUCCESS:
            payload.action.data.forEach(function (product) {
                Product.create(product);
            });
            _setCurrentProduct();
            break;

        case RouteAction.CHANGE_ROUTE_SUCCESS:
            _setCurrentProductId(payload.action.data.id);
            break;

        default:
            shouldEmitChange = false;
            debug('ocorreu default para o payload action: ' + action.type);
    }

    if (shouldEmitChange) {
        ProductStore.emitChange();
    }

});

module.exports = ProductStore;
