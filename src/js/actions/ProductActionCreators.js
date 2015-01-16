
var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Dispatcher = require('../dispatcher/AppDispatcher'),
    Validator = require('../utils/Validator'),
    api = require('../api/AppApi'),
    debug = require('debug')('ProductActionCreators.js'),
    productAction = ActionTypes.Product,
    ProductActionCreator;

ProductActionCreator = {

    // called when the user type on search input field
    applyFilter: function (query) {
        debug('applyFilter');
        Dispatcher.handleViewAction({
            type : productAction.APPLY_FILTER,
            data : { query : query }
        });

        if (Validator.isFunction(api.product.searchProducts)) {
            api.product.searchProducts(query);
        } else {
            debug('No searchProducts valid method found');
        }
    },

    // called when more products are needed from the database
    loadMoreProducts: function () {
        Dispatcher.handleViewAction({
            type: productAction.LOAD_MORE,
            data: null
        });
        if (Validator.isFunction(api.product.updateProducts)) {
            debug('calling api product updateProducts');
            // api.product.updateProducts();
        } else {
            debug('No updateProducts valid method found');
        }
    },

    // called when the player wishes to know the product reached a certain price
    toggleWishProduct: function (id) {
        Dispatcher.handleViewAction({
            type : productAction.TOGGLE_WISHLIST,
            data : { id : id }
        });
    },

    // called when the player clicks on a product that he wants to buy
    addItem: function (id) {
        Dispatcher.handleViewAction({
            type : productAction.ADD_ITEM,
            data : { id : id }
        });

        if (Validator.isFunction(api.product.syncProduct)) {
            api.product.syncProduct(id);
        } else {
            debug('No getProducts valid method found');
        }
    },

    // for future use only - when we develop our own selling system
    removeItem: function (id) {
        Dispatcher.handleViewAction({
            type : productAction.REMOVE_ITEM,
            data : { id : id }
        });
    },

    // for future use only - when we develop our own selling system
    decreaseItem: function (id) {
        Dispatcher.handleViewAction({
            type : productAction.DECREASE_ITEM,
            data : { id : id }
        });
    },

    // for future use only - when we develop our own selling system
    increaseItem: function (id) {
        Dispatcher.handleViewAction({
            type : productAction.INCREASE_ITEM,
            data : { id : id }
        });
    }
};

module.exports = ProductActionCreator;
