/*

    In this file should be everything that is product related iteration with the
    server, to get data and to sync data back.

*/

var db = require('./FireApi.js'),
    request = require('../utils/Request'),
    ApiProductPriceHistoryActionCreator = require('../actions/ApiProductPriceHistoryActionCreator'),
    ProductPriceHistory = require('../data/ProductPriceHistory'),
    debug = require('debug')('ProductPriceHistoryApi.js'),
    ProductPriceHistoryApi;

ProductPriceHistoryApi = {

    getProductPriceHistory: function () {

        db.products_price_history.getAll(30, function (data) {
            // if there is an error let's dispatch an event and end here
            if (data instanceof Error) {
                productServerActionCreator.setAllProducts(data);
                debug('Error trying to get products price history');
            } else {
                if (data instanceof Array) {
                    // var products,
                    //     productsRaw,
                    //     taxonomiesRaw,
                    //     prices,
                    //     finalHistory,
                    //     priceData;
                    //     finalHistory = {
                    //         series : [],
                    //         data : []
                    //     };
                    //     priceHistoryRaw = results[2];
                    //     // Create price history
                    //     priceHistoryRaw.forEach(function (historyValue) {
                    //
                    //         finalHistory.series = _.without(_.keys(historyValue), 'month');
                    //         priceData = {
                    //             'x': finalHistory.series,
                    //             'y': []
                    //         };
                    //
                    //         finalHistory.series.forEach(function (finalHistoryValue) {
                    //             priceData.y.push(historyValue[finalHistoryValue]);
                    //         });
                    //
                    //         finalHistory.data.push(priceData);
                    //     });
                    //     kind hackish, we are assuming that they are in the correct index order...
                    //     value.price_history = finalHistory.data[key];
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
