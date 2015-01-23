var ActionTypes = require('../constants/AppConstants').ActionTypes,
    AppDispatcher = require('../dispatcher/AppDispatcher'),
    Store = require('../utils/Store'),
    debug = require('debug')('FilterStore.js'),
    productAction = ActionTypes.Product,
    FilterStore,
    FilterInstance,
    _filters;

_filters = {};

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

FilterInstance = new PlayerStore(
    productAction.SEARCH_PRODUCTS, handleSearch,
    productAction.FILTER_PRODUCTS, handleFilter
);


module.exports = FilterInstance;
