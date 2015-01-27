
var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Dispatcher = require('../dispatcher/AppDispatcher'),
    api = require('../api/AppApi'),
    debug = require('debug')('FilterActionCreator.js'),
    filterAction = ActionTypes.Filter,
    FilterActionCreator;

FilterActionCreator = {
    // get filters list
    getFilters: function () {
        Dispatcher.handleViewAction({
            type : filterAction.GET_FILTERS,
            data : null
        });
    },
    // called when the user type on search input field
    setSearch: function (searchTerm) {
        debug('setSearch - dispatch SEARCH_PRODUCTS');
        Dispatcher.handleViewAction({
            type : filterAction.SET_SEARCH,
            data : { query : searchTerm }
        });
    },
    // filter products
    setFilters: function (filter) {
        debug('setFilters - dispatch FILTER_PRODUCTS');
        Dispatcher.handleViewAction({
            type : filterAction.SET_FILTER,
            data : { filter: filter }
        });
    },
    // called when more products are needed from the database
    setLoadMore: function () {
        debug('setLoadMore - dispatch LOAD_MORE');
        Dispatcher.handleViewAction({
            type: filterAction.LOAD_MORE,
            data: null
        });
    }
};

module.exports = FilterActionCreator;
