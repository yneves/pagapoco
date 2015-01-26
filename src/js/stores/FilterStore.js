var ActionTypes = require('../constants/AppConstants').ActionTypes,
    AppDispatcher = require('../dispatcher/AppDispatcher'),
    api = require('../api/AppApi'),
    Store = require('../utils/Store'),
    debug = require('debug')('FilterStore.js'),
    productAction = ActionTypes.Product,
    FilterStore,
    FilterInstance,
    _filters,
    _searchState,
    _filtersState,
    _loadMoreSum;

_filters = {}; // should hold the list of filters information (collections and models)
_searchState = '';  // should hold the current query the user are trying to perform
_filtersState = {}; // should hold the current state of filters, selected or not, etc
_loadMoreSum = 0;   // a counter of how many times the loadMore was executed

function updateFilters(data) {
    debug('should receive a collection of filters of some type');
}

function handleSearch(data) {
    debug('handling search');
    if (data && data.query) {
        _searchState = data.query;
        // update the products from the server based on the new data
        api.product.updateProducts(_searchState, _filtersState);
    } else {
        _searchState = '';
    }
}

function handleFilter(data) {
    debug('handleFilter');
    if (data && data.filter) {
        // data.filter should be the filter slug/id
        // bellow we are mimetizing a toggle effect on the filterState
        if (!_filtersState[data.filter]) {
            _filtersState[data.filter] = true;
        } else {
            delete _filterState[data.filter];
        }
        // update the products from the server based on the new data
        api.product.updateProducts(_searchState, _filtersState);
    }

    if (Object.getOwnPropertyNames(_filtersState).length) {
        _filterState = {};
    }
}

function handleLoadMore(data) {
    debug('handle load more products');
    _loadMoreSum += 1;
    api.product.updateProducts(_searchState, _filtersState, _loadMoreSum);
}

FilterStore = Store.extend({

    CHANGE_EVENT: 'change_filter',

    // return the current list of filters available
    getFilters: function () {
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
    productAction.SEARCH_PRODUCTS, handleSearch,
    productAction.FILTER_PRODUCTS, handleFilter,
    productAction.LOAD_MORE, handleLoadMore
);


module.exports = FilterInstance;
