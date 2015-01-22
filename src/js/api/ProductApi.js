/*
 In this file should be everything that is product related iteration with the
 server, to get data and to sync data back.
 */

var db = require('./FireApi.js'),
    ElasticSearchDSL = require('../utils/ElasticSearchDSL'),
    ApiProductActionCreator = require('../actions/ApiProductActionCreator'),
    Product = require('../data/Product'),
    ProductPriceHistory = require('../data/ProductPriceHistory'),
    Transmuter = require('transmuter'),
    debug = require('debug')('ProductApi.js'),
    ProductApi;

ProductApi = {

    // get a single product from database
    // uses setProducts
    getCurrentProduct: function (slug) {
        var currentProduct;
        currentProduct = Product.collection.findWhere({slug:slug});

        if (currentProduct) {
            debug('We already have this product');
            ApiProductActionCreator.setProducts(Product.collection);
            ProductApi.getProductPriceHistory(currentProduct.get('id'));
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
                currentProduct = Product.create(data);
                ApiProductActionCreator.setProducts(Product.collection);
                ProductApi.getProductPriceHistory(currentProduct.get('id'));
            } else {
                // product not found, 404
                ApiProductActionCreator.setProducts(new Error('Product not found'));
                debug('Error 404, Product not found');
            }
        });
    },

    getProductPriceHistory: function (productId) {
        var currentProductPriceHistory;
        currentProductPriceHistory = ProductPriceHistory.collection.findWhere({id:productId});

        // if no price history data found for this product, we should fetch it from the server
        if (!currentProductPriceHistory) {
            // no data found
            debug(productId);
            db.products_price_history.findByKey(productId, function (data) {
                if (data instanceof Error) {
                    ApiProductActionCreator.setAllProductsPriceHistory(data);
                } else if (data.val() !== null) {
                    debug('data price history ok');
                    debug(data.val());
                    ProductPriceHistory.create(data.val());
                    ApiProductActionCreator.setAllProductsPriceHistory(ProductPriceHistory.collection);
                } else {
                    debug('no data price history for this product');
                    ApiProductActionCreator.setAllProductsPriceHistory(new Error('No price history found for this product'));
                }
            });
        }
    },

    syncProductPriceHistory: function (productPriceHistoryId) {
        debug('syncProductPriceHistory');
    },

    // get products from database
    // uses setProducts
    getProducts: function () {
        var minLength;

        minLength = 30;

        if (Product.collection.length >= minLength) {
            ApiProductActionCreator.setProducts(new Error('We already have some random products'));
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
        var searchObj;

        // TODO the search by name must count the supplier and title mainly
        searchObj = ElasticSearchDSL.getDefaultShittyQuery(search);

        // start fetching for search, fire event
        ApiProductActionCreator.setProducts(null);
        db.products.searchFor(searchObj, function (data) {
            if (data instanceof Error) {
                debug('Error trying to search for products');
                ApiProductActionCreator.setProducts(data);
            } else {
                if (data.length) {
                    debug('searchProducts - received, now set products');
                    // clear products data with the search results
                    Product.collection.reset(data);
                    ApiProductActionCreator.setProducts(Product.collection);
                } else {
                    debug('searchProducts - received but no products found');
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
