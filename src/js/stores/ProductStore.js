
var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Store = require('../utils/Store'),
    debug = require('debug')('ProductStore.js'),
    api = require('../api/AppApi'),
    ProductStore,
    ProductInstance,
    ProductAction,
    RouteAction,
    _currentCatalog,    // general products information
    _currentProduct,    // current product data
    _priceHistory,      // a list of all price histories
    _isLoading,
    _sorting;

ProductAction = ActionTypes.Product;
RouteAction = ActionTypes.Route;

_priceHistory = {};
_currentCatalog = {};
_currentProduct = {
    product: {},
    priceHistory: {}
};
_isLoading  = true;
_sorting = {
    price: false,
    discount: false
};

function resetCurrentProduct() {
    _currentProduct = {
        product: {},
        priceHistory: {}
    };
}

function handleProducts() {
    debug('handleProducts');
    if (Object.getOwnPropertyNames(_currentCatalog).length < 30) {
        // there are no products, request it through the api
        api.product.getProducts(30);
        _isLoading = true;
    }
}

function setProductsError(error) {
    debug(error);
    _isLoading = false;
}

function setProducts(data) {
    if (data) {
        if (Object.getOwnPropertyNames(data).length) {
            // new data arrived
            _currentCatalog = data.clone();
        } else {
            debug('Empty response of products from server');
        }
    } else {
        debug('No data received from server');
    }
    // nothing else to do, set isLoading as false
    _isLoading = false;
}

// TODO ver se tem um produto, se não tiver fazer uma requisição dele na API
// a api deve retornar
function handleSetCurrentProduct(data) {
    if (Object.getOwnPropertyNames(_currentCatalog).length) {
        _currentProduct.product = _currentCatalog.findWhere({'slug' : data.slug});
        // we have a catalog but the product data were not found, fetch it
        if (!_currentProduct.product) {
            debug('get product from api');
            api.product.getCurrentProduct(data.slug);
            _isLoading = true;
        } else {
            // we have product, check the price history now
            if (Object.getOwnPropertyNames(_priceHistory).length) {
                _currentProduct.priceHistory = _priceHistory.findWhere({ id: _currentProduct.product.get('id') });
                if (!_currentProduct.priceHistory) {
                    // no price history for this product, fetch it from the api
                    api.product.getProductPriceHistory(_currentProduct.product.get('id'));
                    _isLoading = true;
                }
            } else {
                _priceHistory = {};
                api.product.getProductPriceHistory(_currentProduct.product.get('id'));
                _isLoading = true;
            }
        }
    } else {
        // no catalog found, fetch at least the wanted product data
        resetCurrentProduct();
        api.product.getCurrentProduct(data.slug);
        _isLoading = true;
    }
}

function setCurrentProductError(data) {
    // some error while trying to fetch the product from server, show 404
    debug('setCurrentProductError - 404');
    debug(data);
}

function setCurrentProduct(data) {
    // handleViewProduct  didn't found the product so it sended an api request
    // that ended up here, now we must set the product (if found) or
    // show a 404 because the product couldn't be found
    if (data && Object.getOwnPropertyNames(data).length) {
        _currentProduct.product = data; // a model
        // we got a product, now we need it's price history
        api.product.getProductPriceHistory(_currentProduct.product.get('id'));
    } else {
        debug('setCurrentProduct - 404');
        resetCurrentProduct();
    }
    // nothing else to do, set _isLoading as false
    _isLoading = false;
}

function setSorting(sort) {

    function toggleOrder(currentOrder) {
        if (currentOrder === 'ASC') {
            _currentCatalog.setSortingOrder('DESC');
        } else {
            _currentCatalog.setSortingOrder('ASC');
        }
    }
    if (sort) {
        if (sort.sortBy === 'discount') {
            _currentCatalog.comparator = 'discount';
            if (_sorting.discount) {
                // ordem ASC ou DESC
                toggleOrder(_currentCatalog._sortOrder);
            } else {
                _sorting.sortBy = 'discount';
                _sorting.price = false;
                _sorting.discount = true;
            }
        } else if (sort.sortBy === 'price') {
            _currentCatalog.comparator = 'best_offer';
            if (_sorting.price) {
                // ordem ASC ou DESC
                toggleOrder(_currentCatalog._sortOrder);
            } else {
                _sorting.sortBy = 'price';
                _sorting.discount = false;
                _sorting.price = true;
            }
        }
        _currentCatalog.sort();
    }
}

function receiveProductPriceHistoryError(data) {
    debug('receiveProductPriceHistoryError');
    debug(data);
    _isLoading = false;
}

function receiveProductPriceHistory(data) {
    if (data) {
        _priceHistory = data;
        if (Object.getOwnPropertyNames(_currentProduct.product).length) {
            _currentProduct.priceHistory = _priceHistory.findWhere({ id: _currentProduct.product.get('id') });
        }
    } else {
        _priceHistory = {};
    }
    _isLoading = false;
}


ProductStore = Store.extend({

    getCurrentProduct: function () {
        return _currentProduct;
    },

    getWished: function () {
        return _currentCatalog.where({wished: 1}, false);
    },

    getCurrentCatalog: function () {
        return _currentCatalog;
    },

    getLoadingState: function (){
        return _isLoading;
    },

    getSorting: function () {
        return _sorting;
    }
});

ProductInstance = new ProductStore(
    ProductAction.GET_PRODUCTS, handleProducts,
    ProductAction.PRODUCT_SET_START, setProducts,
    ProductAction.PRODUCT_SET_ERROR, setProductsError,
    ProductAction.PRODUCT_SET_SUCCESS, setProducts,
    ProductAction.GET_CURRENT_PRODUCT, handleSetCurrentProduct,
    ProductAction.PRODUCT_SET_CURRENT_START, setCurrentProduct,
    ProductAction.PRODUCT_SET_CURRENT_ERROR, setCurrentProductError,
    ProductAction.PRODUCT_SET_CURRENT_SUCCESS, setCurrentProduct,
    ProductAction.PRODUCT_PRICE_HISTORY_START, receiveProductPriceHistory,
    ProductAction.PRODUCT_PRICE_HISTORY_ERROR, receiveProductPriceHistoryError,
    ProductAction.PRODUCT_PRICE_HISTORY_SUCCESS, receiveProductPriceHistory,
    ProductAction.SORT_PRODUCT, setSorting
);

module.exports = ProductInstance;
