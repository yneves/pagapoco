
var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Dispatcher = require('../dispatcher/AppDispatcher'),
    Validator = require('../utils/Validator'),
    api = require('../api/AppApi'),
    debug = require('debug')('ProductActionCreators.js'),
    productAction = ActionTypes.Product,
    ProductActionCreator;

ProductActionCreator = {

    // called when the user type on search input field
    searchProducts: function (searchTerm) {
        debug('searchProducts');
        Dispatcher.handleViewAction({
            type : productAction.SEARCH_PRODUCTS,
            data : { query : searchTerm }
        });

        if (Validator.isFunction(api.product.searchProducts)) {
            api.product.searchProducts(searchTerm);
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

        if (Validator.isFunction(api.product.syncProduct)) {
            api.product.syncProduct(id);
        } else {
            debug('No syncProduct valid method found');
        }
    }
};

module.exports = ProductActionCreator;
