
var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Store = require('../utils/Store'),
    debug = require('debug')('ProductStore.js'),
    ProductStore,
    ProductInstance,
    ProductAction,
    RouteAction,
    _currentCatalog,    // general products information
    _currentPlayerId,
    _currentProduct,
    _isLoading,
    _sorting;

ProductAction = ActionTypes.Product;
RouteAction = ActionTypes.Route;

_currentCatalog = [];
_currentPlayer = null;
_currentProductSlug = '';
_currentProduct = null;
_isLoading  = true;
_sorting = {
    price: false,
    discount: false
};

function receivePlayer(data) {
    // TODO data should be a model
    _currentPlayer = data;
}

function setProductsError() {
    _isLoading = false;
}

function setProducts(data) {
    if (data) {
        _currentCatalog = data.clone();
        _isLoading = false;
        setCurrentProduct();
    } else {
        _isLoading = true;
    }
}

function changedRouteSuccess(routeData) {

    var slug;
    if (routeData.link) {
        slug = routeData.link.slug || '';
    }
    if (slug) {
        _currentProductSlug = slug;
    } else {
        _currentProductSlug = 0;
    }
}

function setCurrentProduct() {
    if (_currentProductSlug && _currentCatalog) {
        _currentProduct = _currentCatalog.findWhere({'slug' : _currentProductSlug});
    } else {
        _currentProduct = null;
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
            if (_sorting.discount) {
                // ordem ASC ou DESC
                toggleOrder(_currentCatalog._sortOrder);
            } else {
                _sorting.price = false;
                _sorting.discount = true;
                _currentCatalog.comparator = 'discount';
            }
        } else if (sort.sortBy === 'price') {
            if (_sorting.price) {
                // ordem ASC ou DESC
                toggleOrder(_currentCatalog._sortOrder);
            } else {
                _sorting.discount = false;
                _sorting.price = true;
                _currentCatalog.comparator = 'best_offer';
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
    RouteAction.CHANGE_ROUTE_SUCCESS, changedRouteSuccess,
    ProductAction.PRODUCT_SET_START, setProducts,
    ProductAction.PRODUCT_SET_ERROR, setProductsError,
    ProductAction.PRODUCT_SET_SUCCESS, setProducts,
    ProductAction.SORT_PRODUCT, setSorting
    // ProductAction.PRODUCT_SAVE_START, saveStart,
    // ProductAction.PRODUT_SAVE_ERROR, saveError,
    // ProductAction.PRODUCT_SAVE_SUCCESS, saveSuccess
);

module.exports = ProductInstance;
