/*
 In this file should be everything that is product related iteration with the
 server, to get data and to sync data back.
 */

var db = require('./FireApi.js'),
    request = require('../utils/Request'),
    ApiProductActionCreator = require('../actions/ApiProductActionCreator'),
    LoadActionCreator = require('../actions/LoadActionCreators'),
    _ = require('lodash-node'), // TODO better naming needed here
    Product = require('../data/Product'),
    Transmuter = require('transmuter'),
    debug = require('debug')('ProductApi.js'),
    ProductApi;

ProductApi = {

    // get a single product from database
    // uses setProducts
    getCurrentProduct: function (slug) {

        if (Product.collection.findWhere({slug:slug})) {
            debug('We already have this product');
            ApiProductActionCreator.setProducts(Product.collection);
            return;
        }

        // start fetching, fire event
        ApiProductActionCreator.setProducts(null);

        db.products.getByChild('slug', slug, function (data) {
            debug('Fetch new product from db');
            if(data instanceof Error) {
                ApiProductActionCreator.setProducts(data);
                debug('Error trying to get a product by its slug');
            } else if (data) {
                // product found
                Product.create(data);
                ApiProductActionCreator.setProducts(Product.collection);
            } else {
                // product not found, 404
                ApiProductActionCreator.setProducts(new Error('Product not found'));
                debug('Error 404, Product not found');
            }
        });
    },

    // get products from database
    // uses setProducts
    getProducts: function () {
        var minLength;

        minLength = 30;

        if (Product.collection.length >= minLength) {
            debug('We already have products');
            ApiProductActionCreator.setProducts(Product.collection);
            return;
        }

        // start fetching, fire event
        ApiProductActionCreator.setProducts(null);

        db.products.getAll(minLength, function (data) {
            // if there is an error let's dispatch an event and end here
            if (data instanceof Error) {
                ApiProductActionCreator.setProducts(data);
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
                        ApiProductActionCreator.setProducts(Product.collection);
                    } else {
                        // No data received yet
                        ApiProductActionCreator.setProducts(null);
                    }
                } else {
                    debug('Error: data is not an instance of Array');
                    ApiProductActionCreator.setAllProducts(new Error('Invalid type: Product data should be of Array type'));
                }
            }
        });
    },
    // used for search, it should reset the initial state of the products
    // uses setProducts
    searchProducts: function (search) {
        debug('initiating search');
        debug(search);
        // start fetching for search, fire event
        console.log('searchProducts start');
        LoadActionCreator.load();
        ApiProductActionCreator.setProducts(null);
        db.products.searchFor(search, false, function (data) {
            if (data instanceof Error) {
                debug('Error trying to search for products');
                ApiProductActionCreator.setProducts(data);
                //LoadActionCreator.loaded();

            } else {
                if (data.length) {
                    debug('searchProducts - received, now set products');
                    // clear products data with the search results
                    Product.collection.reset(data);
                    ApiProductActionCreator.setProducts(Product.collection);
                    //LoadActionCreator.loaded();

                } else {

                }
            }
        });
    },
    // used for loadMore
    updateProducts: function (search) {

        // TODO if there is a term we should loadMore based on a search
        // the search term should come with the action parameter

        // TODO if there is no term we should just loadMore
        // the ammount of which to load should come with the parameter

    },
    syncProduct: function (productId) {
        var model;
        model = Product.collection.get(productId);

        if (model) {
            ApiProductActionCreator.saveProducts();
            async.series([
                function syncProduct(callback) {
                    // TODO some firebase endpoint should go here
                    request.post('/api/some-end-point', model.toJSON(), callback);
                }
            ], function (err, results) {
                if (err instanceof Error) {
                    ApiProductActionCreator.saveProducts(err);
                } else {
                    ApiProductActionCreator.saveProducts(this.id);
                }
            });
        }
    }
};

module.exports = ProductApi;
