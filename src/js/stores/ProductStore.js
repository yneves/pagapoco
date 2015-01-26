
var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Store = require('../utils/Store'),
    debug = require('debug')('ProductStore.js'),
    api = require('../api/AppApi'),
    ProductStore,
    ProductInstance,
    ProductAction,
    RouteAction,
    _currentCatalog,    // general products information
    _currentProduct,
    _isLoading,
    _sorting;

ProductAction = ActionTypes.Product;
RouteAction = ActionTypes.Route;

_currentCatalog = {};
_currentProduct = {};
_isLoading  = true;
_sorting = {
    price: false,
    discount: false
};


function handleProducts() {
    debug('handleProducts');
    if (Object.getOwnPropertyNames(_currentCatalog).length < 30) {
        // there are no products, request it through the api
        api.product.getProducts();
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
        _currentProduct = _currentCatalog.findWhere({'slug' : data.slug});
        // we have a catalog but the product data were not found, fetch it
        if (!_currentProduct) {
            debug('get product from api');
            api.product.getCurrentProduct(data.slug);
            _isLoading = true;
        } else {
            // we have product, get it's price history now
            api.product.getProductPriceHistory(_currentProduct.get('id'));
        }
    } else {
        // no catalog found, fetch at least the wanted product data
        _currentProduct = {};
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
        _currentProduct = data;
        api.product.getProductPriceHistory(_currentProduct.get('id'));
    } else {
        debug('setCurrentProduct - 404');
        _currentProduct = {};
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

ProductStore = Store.extend({

    getCurrent: function () {
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
    ProductAction.SORT_PRODUCT, setSorting
);

module.exports = ProductInstance;
