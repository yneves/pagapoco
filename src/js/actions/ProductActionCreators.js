
var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Dispatcher = require('../dispatcher/AppDispatcher'),
    Validator = require('../utils/Validator'),
    FilterStore = require('../stores/FilterStore'),
    api = require('../api/AppApi'),
    debug = require('debug')('ProductActionCreators.js'),
    productAction = ActionTypes.Product,
    ProductActionCreator;

ProductActionCreator = {

    getProducts: function () {
        debug('getProducts started');
        Dispatcher.handleViewAction({
            type : productAction.GET_PRODUCTS,
            data : null
        });
        // let's require the products from the server
        if (Validator.isFunction(api.product.getProducts)) {
            api.product.getProducts();
        } else {
            debug('No getProducts valid method found');
        }
    },

    getCurrentProduct: function (slug) {
        debug('getCurrentProduct started');
        Dispatcher.handleViewAction({
            type : productAction.GET_CURRENT_PRODUCT,
            data : null
        });

        if (Validator.isFunction(api.product.getCurrentProduct)) {
            api.product.getCurrentProduct(slug);
        } else {
            debug('No getCurrentProduct valid method found');
        }
    },

    // called when the user type on search input field
    searchProducts: function (searchTerm) {

        Dispatcher.handleViewAction({
            type : productAction.SEARCH_PRODUCTS,
            data : { query : searchTerm }
        });

        if (Validator.isFunction(api.product.updateProducts)) {
            debug('searchProducts - call api.product.updateProducts');
            var filters;
            filters = FilterStore.getFiltersState();
            api.product.updateProducts(searchTerm, filters);
        } else {
            debug('No updateProducts valid method found');
        }
    },
    // filter products
    filterProducts: function (filter) {

        Dispatcher.handleViewAction({
            type : productAction.FILTER_PRODUCTS,
            data : { filter: filter }
        });
        if (Validator.isFunction(api.product.updateProducts)) {
            debug('filterProducts - call api.product.updateProducts');
            var filters,
                searchTerm;
            // The store might not have been updated yet with the new added filter
            // so we need to merge it here before sending to the API
            filters = FilterStore.getFiltersState(filter);
            searchTerm = FilterStore.getSearchState();
            api.product.updateProducts(serachTerm, filters);
        } else {
            debug('No updateProducts valid method found');
        }

    },
    // called when more products are needed from the database
    loadMoreProducts: function () {
        Dispatcher.handleViewAction({
            type: productAction.LOAD_MORE,
            data: null
        });
        if (Validator.isFunction(api.product.updateProducts)) {
            debug('loadMoreProducts - call api.product.updateProducts');
            var loadMore,
                searchTerm,
                filters;
            loadMore = FilterStore.getLoadMoreSum();
            searchTerm = FilterStore.getSearchState();
            filters = FilterStore.getFiltersState();
            api.product.updateProducts(searchTerm, filters, loadMore);
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
