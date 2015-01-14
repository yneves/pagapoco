/*

    In this file should be everything that is product related iteration with the
    server, to get data and to sync data back.

*/

var db = require('./FireApi.js').products_price_history,
    request = require('../utils/Request'),
    ApiProductPriceHistoryActionCreator = require('../actions/ApiProductPriceHistoryActionCreator'),
    ProductPriceHistory = require('../data/ProductPriceHistory'),
    debug = require('debug')('ProductPriceHistoryApi.js'),
    ProductPriceHistoryApi;

ProductPriceHistoryApi = {

    getProductPriceHistory: function () {

        db.getAll(function (data) {
            // if there is an error let's dispatch an event and end here
            if (data instanceof Error) {
                productServerActionCreator.setAllProducts(data);
                debug('Error trying to get products price history');
            } else {
                if (data instanceof Array) {
                    ProductPriceHistory.create(data);
                    ApiProductPriceHistoryActionCreator.setAllProductsPriceHistory(ProductPriceHistory.collection);
                } else {
                    debug('Invalid type: Product History data should be of Array type');
                }
            }
        });
    },

    syncProductPriceHistory: function (productPriceHistoryId) {
        debug('syncProductPriceHistory');
    }
};

module.exports = ProductPriceHistoryApi;
