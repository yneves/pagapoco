var ActionTypes = require('../constants/AppConstants').ActionTypes,
    AppDispatcher = require('../dispatcher/AppDispatcher'),
    api = require('../api/AppApi'),
    Store = require('../utils/Store'),
    debug = require('debug')('FilterStore.js'),
    productAction = ActionTypes.Product,
    filterAction = ActionTypes.Filter,
    FilterStore,
    FilterInstance,
    _isActive,
    _filters,
    _searchState,
    _filtersState,
    _loadMoreSum,
    _isLoading;

_isActive = false;
_filters = {    // should hold the list of filters information (collections and models)
    supplier: {},
    package: {},
    priceRange: {}
};
_filtersState = { // should hold the current state of filters, selected or not, etc
    term: {
        supplier: [],       // 'val1', 'val2'
        package: []
    },
    range: {
        price: {
        // 'gte' : 'foo',
        // 'lte' : 'bar'
        }
    }
};
_searchState = '';  // should hold the current query the user are trying to perform
_loadMoreSum = 0;   // a counter of how many times the loadMore was executed
_isLoading = false;

// handle the site getting the list of views
function viewHandleFilters() {
    debug('handle filters');

    if (!Object.getOwnPropertyNames(_filters.supplier).length || !Object.getOwnPropertyNames(_filters.package).length) {
        api.filter.getFilters();
        _isLoading = true;
    }

    if (!Object.getOwnPropertyNames(_filters.priceRange).length) {

        api.filter.getPriceRangeFilter();
        _isLoading = true;

        // pegar o preço da oferta máxima de produto
        // pegar o preço da oferta mínima do produto
        // fazer uma divisão em 6 partes iguais e colocar como range
        // p1 - p2
        // p2 - p3
        // p3 - p4
        // p4 - p5
        // p5 - p6
    }

}


function viewHandleSearch(data) {
    debug('handling search');
    if (data && data.query) {
        _searchState = data.query;
        // update the products from the server based on the new data
        api.product.filterProducts(_searchState, _filtersState);
        _isActive = true;
    } else {
        _searchState = '';
        _isActive = false;
    }
}

// handle the filter that was selected
function viewHandleFilter(data) {
    debug('handleFilter');
    if (data && data.type && data.filter) {
        // data.filter should be the filter slug/id
        // bellow we are mimetizing a toggle effect on the filterState
        if (!_filtersState.term[data.type] && !_filtersState.range[data.type]) {
            debug('Invalid _filtersState type - not found term or range');
        } else {
            var index;
            if(_filtersState.term[data.type]) {
                index = _filtersState.term[data.type].indexOf(data.filter);
                if (index === -1) {
                    _filtersState.term[data.type].push(data.filter);
                } else {
                    _filtersState.term[data.type].splice(index, 1);
                }
            } else {

                // TODO if range, do some other logic

            }

            // update the products from the server based on the new data
            api.product.filterProducts(_searchState, _filtersState);
            _isActive = true;
        }
    } else {
        debug('No data/data.type/data.filter');
        _isActive = false;
    }
}

function viewHandleLoadMore(data) {
    debug('handle load more products');
    _loadMoreSum += 1;
    api.product.filterProducts(_searchState, _filtersState, _loadMoreSum);
    _isActive = true;
}

// handle server action
function apiHandleFiltersError(data) {
    debug('apiHandleFiltersError');
    debug(data);
}

function apiHandleFilters(data) {
    // for now we just clone the received data on _filters property
    // TODO make field agnostic
    if (data && data.length) {
        debug(data);
        switch(data.model.prototype.className) {
            case 'Supplier':
                _filters.supplier = data.clone();
                break;
            case 'Package':
                _filters.package = data.clone();
                break;
        }
    } else {
        // nothing receiveid, what to do?
    }
    _isLoading = false;

}

FilterStore = Store.extend({

    CHANGE_EVENT: 'change_filter',

    // should be true when any filter is active
    isActive: function () {
        return _isActive;
    },

    // return the current list of filters available
    getFilters: function () {
        debug('get filters');
        debug(_filters);
        return _filters;
    },

    // return the current active filters
    getFiltersState: function (filter) {
        filter = filter || null;
        if (filter) {
            handleFilter(filter);
        }
        return _filtersState;
    },

    // return the current search query
    getSearchState: function () {
        return _searchState;
    },

    // return the current number of times loadMoreSum were triggered
    getLoadMoreSum: function () {
        return _loadMoreSum;
    }

});

FilterInstance = new FilterStore(
    // view actions
    filterAction.SET_SEARCH, viewHandleSearch,
    filterAction.SET_FILTER, viewHandleFilter,
    filterAction.LOAD_MORE, viewHandleLoadMore,
    filterAction.GET_FILTERS, viewHandleFilters,
    // server actions
    filterAction.FILTER_SET_START, apiHandleFilters,
    filterAction.FILTER_SET_ERROR, apiHandleFiltersError,
    filterAction.FILTER_SET_SUCCESS, apiHandleFilters
);


module.exports = FilterInstance;
