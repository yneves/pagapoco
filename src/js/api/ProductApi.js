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
            ProductApi.getProductPriceHistory(currentProduct.get('id'));
            ApiProductActionCreator.viewProduct({slug: slug});
            return;
        }

        // start fetching, fire event
        ApiProductActionCreator.setProducts(null);
        db.products.findByChild('slug', slug, function (data) {
            debug('Fetch new product from db');
            if(data instanceof Error) {
                debug('Error trying to get a product by its slug');
                ApiProductActionCreator.setProducts(data);
                ApiProductActionCreator.viewProduct(data);
            } else if (data) {
                // product found
                currentProduct = Product.create(data);
                ApiProductActionCreator.setProducts(Product.collection);
                ProductApi.getProductPriceHistory(currentProduct.get('id'));
                ApiProductActionCreator.viewProduct({slug:currentProduct.get('slug')});
            } else {
                // product not found, 404 send empty object
                debug('Error 404, Product not found');
                ApiProductActionCreator.viewProduct({});
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
                    debug('No price history found for this product');
                    ApiProductActionCreator.setAllProductsPriceHistory({});
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
            debug('We already have some random products');
            ApiProductActionCreator.setProducts({});
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
                if (data instanceof Array) {
                    if (data.length) {
                        // we've got data, let's set it
                        Product.create(data);
                        ApiProductActionCreator.setProducts(Product.collection);
                    } else {
                        debug('No products received');
                        ApiProductActionCreator.setProducts({});
                    }
                } else {
                    debug('Error: data is not an instance of Array');
                    ApiProductActionCreator.setProducts(new Error('Invalid type: Product data should be of type Array'));
                }
            }
        });
    },
    // used for search with exact matches
    filterProducts: function (filter) {

        var searchObj;

        debug(filter);
        searchObj = ElasticSearchDSL.getBySingleFilter(filter);

        debug(searchObj);
        // start fetching for search, fire event
        ApiProductActionCreator.setProducts(null);
        db.products.searchFor(searchObj, function (data) {
            if (data instanceof Error) {
                debug('Error trying to search for products');
                ApiProductActionCreator.setProducts(data);
            } else {
                if (data instanceof Array) {
                    if (data.length) {
                        debug('searchProducts - received, now set products');
                        // clear products data with the search results
                        Product.collection.reset(data);
                        ApiProductActionCreator.setProducts(Product.collection);
                        debug(Product.collection);
                    } else {
                        debug('searchProducts - received but no products found');
                        ApiProductActionCreator.setProducts({});
                    }
                } else {
                    debug('Error: data is not an instance of Array');
                    ApiProductActionCreator.setProducts(new Error('Invalid type: Product data should be of type Array'));
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
                if (data instanceof Array) {
                    if (data.length) {
                        debug('searchProducts - received, now set products');
                        // clear products data with the search results
                        Product.collection.reset(data);
                        ApiProductActionCreator.setProducts(Product.collection);
                    } else {
                        debug('searchProducts - received but no products found');
                        ApiProductActionCreator.setProducts({});
                    }
                } else {
                    debug('Error: data is not an instance of Array');
                    ApiProductActionCreator.setProducts(new Error('Invalid type: Product data should be of type Array'));
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
