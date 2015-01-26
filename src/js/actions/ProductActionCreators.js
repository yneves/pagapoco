
var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Dispatcher = require('../dispatcher/AppDispatcher'),
    api = require('../api/AppApi'),
    debug = require('debug')('ProductActionCreators.js'),
    productAction = ActionTypes.Product,
    ProductActionCreator;

ProductActionCreator = {
    // get products
    getProducts: function () {
        Dispatcher.handleViewAction({
            type : productAction.GET_PRODUCTS,
            data : null
        });
    },
    // get some product data based on it's slug
    getCurrentProduct: function (slug) {
        Dispatcher.handleViewAction({
            type : productAction.GET_CURRENT_PRODUCT,
            data : { slug: slug }
        });
    },
    // called when the user type on search input field
    searchProducts: function (searchTerm) {
        debug('searchProducts - dispatch SEARCH_PRODUCTS');
        Dispatcher.handleViewAction({
            type : productAction.SEARCH_PRODUCTS,
            data : { query : searchTerm }
        });
    },
    // filter products
    filterProducts: function (filter) {
        debug('filterProducts - dispatch FILTER_PRODUCTS');
        Dispatcher.handleViewAction({
            type : productAction.FILTER_PRODUCTS,
            data : { filter: filter }
        });
    },
    // called when more products are needed from the database
    loadMoreProducts: function () {
        debug('loadMoreProducts - dispatch LOAD_MORE');
        Dispatcher.handleViewAction({
            type: productAction.LOAD_MORE,
            data: null
        });
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
