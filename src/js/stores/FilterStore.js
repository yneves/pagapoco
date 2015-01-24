var ActionTypes = require('../constants/AppConstants').ActionTypes,
    AppDispatcher = require('../dispatcher/AppDispatcher'),
    Store = require('../utils/Store'),
    debug = require('debug')('FilterStore.js'),
    productAction = ActionTypes.Product,
    FilterStore,
    FilterInstance,
    _search,
    _filters;

_filters = {}; // should hold the list of filters information (collections and models)
_searchState = '';  // should hold the current query the user are trying to perform
_filtersState = {}; // should hold the current state of filters, selected or not, etc

function handleSearch(data) {
    debug('handling search');
}

function handleFilter(data) {
    debug('handling filter');
}

FilterStore = Store.extend({

    CHANGE_EVENT: 'change_filter',

    getFilters: function () {
        return _filters;
    }

});

FilterInstance = new FilterStore(
    productAction.SEARCH_PRODUCTS, handleSearch,
    productAction.FILTER_PRODUCTS, handleFilter
);


module.exports = FilterInstance;
