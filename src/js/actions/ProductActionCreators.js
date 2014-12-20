
var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Dispatcher = require('../dispatcher/AppDispatcher'),
    api = require('../api/AppApi'),
    debug = require('debug')('ProductActionCreators.js'),
    productAction = ActionTypes.Product,
    ProductActionCreator;

ProductActionCreator = {

    /**
     * FROM VIEW
     *
     * @param data
     */
    toggleWishProduct: function (id) {
        Dispatcher.handleViewAction({
            type : productAction.TOGGLE_WISHLIST,
            data : { id : id }
        });
    },
    addItem: function (id) {
        Dispatcher.handleViewAction({
            type : productAction.ADD_ITEM,
            data : { id : id }
        });
        api.product.syncProduct(id);
    },
    removeItem: function (id) {
        Dispatcher.handleViewAction({
            type : productAction.REMOVE_ITEM,
            data : { id : id }
        });
    },
    decreaseItem: function (id) {
        Dispatcher.handleViewAction({
            type : productAction.DECREASE_ITEM,
            data : { id : id }
        });
    },
    increaseItem: function (id) {
        Dispatcher.handleViewAction({
            type : productAction.INCREASE_ITEM,
            data : { id : id }
        });
    }
};

module.exports = ProductActionCreator;
