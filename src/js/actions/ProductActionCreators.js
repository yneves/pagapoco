
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

    // simple sort the products
    sortProducts: function (sort) {
        Dispatcher.handleViewAction({
            type: productAction.SORT_PRODUCT,
            data: {sortBy : sort}
        });
    }
};

module.exports = ProductActionCreator;
