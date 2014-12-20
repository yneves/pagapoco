
var request = require('../utils/Request'),
    async = require('async'),
    productServerActionCreator = require('../actions/ProductServerActionCreators'),
    _ = require('lodash-node'),
    Product = require('../data/Product'),
    Transmuter = require('transmuter'),
    debug = require('debug')('ProductApi.js'),
    productCollection;

function getAllProducts(callback) {

    productServerActionCreator.setAllProducts();

    async.parallel([

        function getProducts(callback) {
            request.get('/resources/products.json', {}, callback);
        },

        function getTaxonomies(callback) {
            request.get('/resources/products_relationships.json', {}, callback);
        }

    ], function (err, results) {

        var products,
            productsRaw,
            taxonomiesRaw,
            prices,
            finalHistory,
            priceData;

        if (err instanceof Error) {
            productServerActionCreator.setAllProducts(err);
        } else {
            products = results[0];
            taxonomies = results[1];

            data = products.body; // simple shortcut
            products = [];
            productsRaw = data.products;
            priceHistoryRaw = data.price_history;
            taxonomiesRaw = taxonomies.body;
            prices = prices || [];
            finalHistory = {
                series : [],
                data : []
            };
            priceData = {};

            // Create price history
            priceHistoryRaw.forEach(function (historyValue) {

                finalHistory.series = _.without(_.keys(historyValue), 'month');
                priceData = {
                    'x': finalHistory.series,
                    'y': []
                };

                finalHistory.series.forEach(function (finalHistoryValue) {
                    priceData.y.push(historyValue[finalHistoryValue]);
                });

                finalHistory.data.push(priceData);
            });

            /**
             * This actions are wrappers to update the current store data once we go live the discounts will be already
             * calculated in the backend and will be sent ready in the $resource.$get().products.json
             */
            productsRaw.forEach(function (value, key) {
                value.taxonomy = [];

                // associate category
                taxonomiesRaw.category_product.forEach(function (categoryValue) {
                    if (value.id === categoryValue.product_id) {
                        categoryValue.category_id.forEach(function (categoryId) {
                            value.taxonomy.push({id: categoryId, type: 'category'});
                        });
                    }
                });

                taxonomiesRaw.tag_product.forEach(function (tagValue) {
                    if (value.id === tagValue.product_id) {
                        tagValue.tag_id.forEach(function (tagId) {
                            value.taxonomy.push({id: tagId, type: 'tag'});
                        });
                    }
                });

                // calculate the initial_discount based on the price
                value.initial_discount = (1 - value.price / value.original_price);
                // kind hackish, we are assuming that they are in the correct index order...
                value.price_history = finalHistory.data[key];
                value.added = Transmuter.toBoolean(value.added);
                value.wished = Transmuter.toBoolean(value.wished);
                products.push(value);
            });
            productServerActionCreator.setAllProducts(products);
        }
    });
}

function syncProduct(productId) {
    var model;
    model = Product.collection.get(productId);

    if (model) {
        productServerActionCreator.productUpdate();
        async.series([
            function syncProduct(callback) {
                request.post('/api/some-end-point', model.toJSON(), callback);
            }
        ], function (err, results) {
            if (err instanceof Error) {
                productServerActionCreator.productUpdate(err);
            } else {
                productServerActionCreator.productUpdate(this.id);
            }
        });
    }
}

module.exports = {
    getAllProducts: getAllProducts,
    syncProduct : syncProduct
};
