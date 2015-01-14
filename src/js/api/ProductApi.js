/*
 In this file should be everything that is product related iteration with the
 server, to get data and to sync data back.
 */

var db = require('./FireApi.js'),
    request = require('../utils/Request'),
    ApiProductActionCreator = require('../actions/ApiProductActionCreator'),
    _ = require('lodash-node'), // TODO better naming needed here
    Product = require('../data/Product'),
    Transmuter = require('transmuter'),
    debug = require('debug')('ProductApi.js'),
    ProductApi;

ProductApi = {
    getProducts: function () {

        var productData;

        db.products.getAll(function (data) {
            // if there is an error let's dispatch an event and end here
            if (data instanceof Error) {
                ApiProductActionCreator.setAllProducts(data);
                debug('Error trying to get products');
            } else {
                // TODO set the variables on the else statement?
                // var products,
                //     productsRaw,
                //     taxonomiesRaw,
                //     prices,
                //     finalHistory,
                //     priceData;
                //
                // products = results[0];
                // productsPriceHistory = results[1];
                //
                //     data = products; // simple shortcut
                //     products = [];
                //     productsRaw = data;
                //     priceHistoryRaw = results[2];
                //     taxonomiesRaw = taxonomies.body;
                //     prices = prices || [];
                //     finalHistory = {
                //         series : [],
                //         data : []
                //     };
                //     priceData = {};
                //
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
                //
                //
                //     /**
                //      * This actions are wrappers to update the current store data once we go live the discounts will be already
                //      * calculated in the backend and will be sent ready in the $resource.$get().products.json
                //      */
                //     productsRaw.forEach(function (value, key) {
                //         value.taxonomy = [];
                //
                //         // associate category with the product
                //         taxonomiesRaw.category_product.forEach(function (categoryValue) {
                //             if (value.id === categoryValue.product_id) {
                //                 categoryValue.category_id.forEach(function (categoryId) {
                //                     value.taxonomy.push({id: categoryId, type: 'category'});
                //                 });
                //             }
                //         });
                //
                //         // associate the tags with the product (should be the product review)
                //         // by the users (which will be gathered from buscape api)
                //         taxonomiesRaw.tag_product.forEach(function (tagValue) {
                //             if (value.id === tagValue.product_id) {
                //                 tagValue.tag_id.forEach(function (tagId) {
                //                     value.taxonomy.push({id: tagId, type: 'tag'});
                //                 });
                //             }
                //         });
                //
                //         // calculate the initial_discount based on the price
                //         // TODO STAGE 3
                //         // value.initial_discount = (1 - value.price / value.original_price);
                //
                //         // kind hackish, we are assuming that they are in the correct index order...
                //         value.price_history = finalHistory.data[key];
                //         value.wished = Transmuter.toBoolean(value.wished);
                //         products.push(value);
                //     });
                if (data instanceof Array) {
                    Product.create(data);
                    ApiProductActionCreator.setAllProducts(Product.collection);
                } else {
                    debug('Invalid type: Product data should be of Array type');
                }
            }
        });
    },
    syncProduct: function (productId) {
        var model;
        model = Product.collection.get(productId);

        if (model) {
            ApiProductActionCreator.productUpdate();
            async.series([
                function syncProduct(callback) {
                    // TODO some firebase endpoint should go here
                    request.post('/api/some-end-point', model.toJSON(), callback);
                }
            ], function (err, results) {
                if (err instanceof Error) {
                    ApiProductActionCreator.productUpdate(err);
                } else {
                    ApiProductActionCreator.productUpdate(this.id);
                }
            });
        }
    }
};

module.exports = ProductApi;