
var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Dispatcher = require('../dispatcher/AppDispatcher'),
    api = require('../api/AppApi').product,
    debug = require('debug')('ProductActionCreators.js'),
    productAction = ActionTypes.Product,
    ProductActionCreator;

ProductActionCreator = {
  
    // called when the user type on search input field
    applyFilter: function (query) {
        Dispatcher.handleViewAction({
            type : productAction.APPLY_FILTER,
            data : { query: query }
        });
    },

    // called when the player wishes to know the product reached a certain price
    toggleWishProduct: function (id) {
        Dispatcher.handleViewAction({
            type : productAction.TOGGLE_WISHLIST,
            data : { id : id }
        });
    },
    
    // called when the player clicks on a product that he wants to buy
    addItem: function (id) {
        Dispatcher.handleViewAction({
            type : productAction.ADD_ITEM,
            data : { id : id }
        });
        api.syncProduct(id);
    },
    
    // for future use only - when we develop our own selling system
    removeItem: function (id) {
        Dispatcher.handleViewAction({
            type : productAction.REMOVE_ITEM,
            data : { id : id }
        });
    },
    
    // for future use only - when we develop our own selling system
    decreaseItem: function (id) {
        Dispatcher.handleViewAction({
            type : productAction.DECREASE_ITEM,
            data : { id : id }
        });
    },
    
    // for future use only - when we develop our own selling system
    increaseItem: function (id) {
        Dispatcher.handleViewAction({
            type : productAction.INCREASE_ITEM,
            data : { id : id }
        });
    }
};

module.exports = ProductActionCreator;
