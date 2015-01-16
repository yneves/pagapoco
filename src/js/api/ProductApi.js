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

        if (Product.collection.length) {
            debug('We already have products');
            ApiProductActionCreator.setAllProducts(Product.collection);
            return;
        }

        // start fetching, fire event
        ApiProductActionCreator.setAllProducts(null);

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
                //     priceData;
                //
                //     products = results[0];
                //
                //     data = products; // simple shortcut
                //     products = [];
                //     productsRaw = data;

                //     taxonomiesRaw = taxonomies.body;
                //     prices = prices || [];

                //     priceData = {};
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
                //         value.wished = Transmuter.toBoolean(value.wished);
                //         products.push(value);
                //     });
                if (data instanceof Array) {
                    if (data.length) {
                        // we got data, let's set it
                        Product.create(data);
                        ApiProductActionCreator.setAllProducts(Product.collection);
                    } else {
                        // No data received yet
                        ApiProductActionCreator.setAllProducts(null);
                    }
                } else {
                    debug('Error: data is not an instance of Array');
                    ApiProductActionCreator.setAllProducts(new Error('Invalid type: Product data should be of Array type'));
                }
            }
        });
    },
    // used for search, it should reset the initial state of the products
    searchProducts: function (search) {
        debug('initiating search');
        debug(search);
        // start fetching for search, fire event
        ApiProductActionCreator.setAllProducts(null);
        db.products.searchFor(search, false, function (data) {
            debug('returned from search');
            if (data instanceof Error) {
                ApiProductActionCreator.setAllProducts(data);
                debug('Error trying to search for products');
            } else {
                if (data.length) {
                    // clear products data with the search results
                    Product.collection.reset(data);
                    ApiProductActionCreator.setAllProducts(Product.collection);
                } else {

                }
            }

            debug(data);
        });
    },
    // used for loadMore
    updateProducts: function (term) {

        // TODO if there is a term we should loadMore based on a search

        // TODO if there is no term we should just loadMore

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
