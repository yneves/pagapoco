/*
 In this file should be everything that is product related iteration with the
 server, to get data and to sync data back.
 */

var db = require('./FireApi.js'),
    ElasticSearchDSL = require('../utils/ElasticSearchDSL'),
    ApiProductActionCreator = require('../actions/ApiProductActionCreator'),
    Product = require('../data/Product'),
    Supplier = require('../data/Supplier'),
    ProductPriceHistory = require('../data/ProductPriceHistory'),
    Transmuter = require('transmuter'),
    debug = require('debug')('ProductApi.js'),
    ProductApi;

ProductApi = {

    // get products from database
    // uses setProducts
    getProducts: function (total) {
        total = total || 30;
        // start fetching, fire event
        ApiProductActionCreator.setProducts(null);
        db.products.getAll(total, function (data) {
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

    // get a single product from database
    getCurrentProduct: function (slug) {
        var currentProduct;
        // start fetching, fire event
        ApiProductActionCreator.setProducts(null);
        db.products.findByChild('slug', slug, function (data) {
            debug('Fetch new product from db');
            if(data instanceof Error) {
                debug('Error trying to get a product by its slug');
                ApiProductActionCreator.setProducts(data);
                ApiProductActionCreator.setCurrentProduct(data);
            } else if (data) {
                // product found
                currentProduct = Product.create(data);
                ApiProductActionCreator.setProducts(Product.collection);
                ApiProductActionCreator.setCurrentProduct(currentProduct);
            } else {
                // product not found, 404 send empty object
                debug('Error 404, Product not found');
                ApiProductActionCreator.setCurrentProduct({});
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
    // used for loadMore
    updateProducts: function (search, filters, loadMore) {

        var options,
            filtersLength,
            searchobj;

        loadMore = loadMore || false;

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

        filtersLength = Object.getOwnPropertyNames(filters);

        if (!search) {
            if (filtersLength.length) {
                // only filter
                if (filtersLength <= 1) {
                    debug('getBySingleFilter');
                    searchObj = ElasticSearchDSL.getBySingleFilter(filters);
                } else {
                    debug('getByMultipleFilter');
                    searchObj = ElasticSearchDSL.getByMultipleFilter(filters);
                }
            } else {
                // no search and no filter, just load more
                debug('empty search obj - loadMore only');
                searchObj = {};
            }
        } else if (search) {
            if (filtersLength.length) {
                // search and filter
                if (filtersLength <= 1) {
                    debug('getQueryWithSingleFilter');
                    searchObj = ElasticSearchDSL.getQueryWithSingleFilter(search, filters);
                } else {
                    debug('getQueryWithMultipleFilter');
                    searchObj = ElasticSearchDSL.getQueryWithMultipleFilters(search, filters);
                }
            } else {
                // only search
                debug('getDefaultShittyQuery');
                searchObj = ElasticSearchDSL.getDefaultShittyQuery(search);
            }
        }

        debug(searchObj);
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
    },
    getFilters: function () {

        // start fetching, fire event
        ApiProductActionCreator.setFilters(null);
        db.suppliers.getAll(null, function (data) {
            // if there is an error let's dispatch an event and end here
            if (data instanceof Error) {
                ApiProductActionCreator.setFilters(data);
                debug('Error trying to get filters');
            } else {
                if (data instanceof Array) {
                    if (data.length) {
                        // we've got data, let's set it
                        Supplier.create(data);
                        ApiProductActionCreator.setFilters(Supplier.collection);
                    } else {
                        debug('No filters received');
                        ApiProductActionCreator.setFilters({});
                    }
                } else {
                    debug('Error: data is not an instance of Array');
                    ApiProductActionCreator.setFilters(new Error('Invalid type: Filter data should be of type Array'));
                }
            }
        });
    }
};

module.exports = ProductApi;
