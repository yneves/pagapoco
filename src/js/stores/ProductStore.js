
var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Store = require('../utils/Store'),
    debug = require('debug')('ProductStore.js'),
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

function setProductsError(error) {
    debug(error);
    _isLoading = false;
}

function setProducts(data) {
    if (data) {
        if (Object.getOwnPropertyNames(data).length) {
            debug('me');
            // new data arrived
            _currentCatalog = data.clone();
        }
        _isLoading = false;
    } else {
        _isLoading = true;
    }
}

function viewProductError(data) {
    debug('404');
    debug(data);
}

function viewProduct(data) {
    if (Object.getOwnPropertyNames(_currentCatalog).length) {
        _currentProduct = _currentCatalog.findWhere({'slug' : data.slug});
    } else {
        _currentProduct = {};
    }
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
    ProductAction.PRODUCT_SET_START, setProducts,
    ProductAction.PRODUCT_SET_ERROR, setProductsError,
    ProductAction.PRODUCT_SET_SUCCESS, setProducts,
    ProductAction.PRODUCT_VIEW_START, viewProduct,
    ProductAction.PRODUCT_VIEW_ERROR, viewProductError,
    ProductAction.PRODUCT_VIEW_SUCCESS, viewProduct,
    ProductAction.SORT_PRODUCT, setSorting
    // ProductAction.PRODUCT_SAVE_START, saveStart,
    // ProductAction.PRODUT_SAVE_ERROR, saveError,
    // ProductAction.PRODUCT_SAVE_SUCCESS, saveSuccess
);

module.exports = ProductInstance;
