
var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Dispatcher = require('../dispatcher/AppDispatcher'),
    api = require('../api/AppApi'),
    debug = require('debug')('ProductActionCreators.js'),
    productAction = ActionTypes.Product,
    filterAction = ActionTypes.Filter,
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
    // simple sort the products
    sortProducts: function (sort) {
        Dispatcher.handleViewAction({
            type: productAction.SORT_PRODUCT,
            data: {sortBy : sort}
        });
    }
};

module.exports = ProductActionCreator;
