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
            db.products_price_history.findByKey(productId, function (data) {
                if (data !== null) {
                    ProductPriceHistory.create(data);
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

        // TODO the filter must check if there is any query set before creating the
        // object
        var searchObj;
        searchObj = ElasticSearchDSL.getBySingleFilter(filter);
        // ProductApi.updateProducts(searchObj);
    },
    // used for search, it should reset the initial state of the products
    // uses setProducts
    searchProducts: function (search) {

        // TODO the search must look up to see if there are any filter set
        // to know which method to call (query with or without filters)

        // TODO the search by name must count the supplier and title mainly
        var searchObj;
        searchObj = ElasticSearchDSL.getDefaultShittyQuery(search);
        // ProductApi.updateProducts(searchObj);
    },
    // used for loadMore
    updateProducts: function (search, filters, loadMore) {

        loadMore = loadMore || false;

        var options;

        if (loadMore) {
            // TODO define how the loadMore know the current from - to
            options = {
                from: 20,
                size: 20
            };
        } else {
            options = {
                from: 0,
                size: 20
            };
        }

        debug('updateProducts return');
        return;

        // start fetching for search, fire event
        ApiProductActionCreator.setProducts(null);
        db.products.searchFor(searchObj, options, function (data) {
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
