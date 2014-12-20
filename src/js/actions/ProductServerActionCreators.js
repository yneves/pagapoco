
var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Dispatcher = require('../dispatcher/AppDispatcher'),
    debug = require('debug')('ProductActionCreators.js'),
    productAction = ActionTypes.Product,
    ProductServerActionCreator;

ProductServerActionCreator = {

    // represent one of many possible updates like:
    // quantity, added/removed and wished
    productUpdate: function (id) {

        id = id || null;

        if(!id) {
            Dispatcher.handleServerAction({
                type: productAction.PRODUCT_UPDATE_START,
                data: null
            });
        } else {
            if (id instanceof Error) {
                Dispatcher.handleServerAction({
                    type: productAction.PRODUCT_UPDATE_ERROR,
                    data: { id : id }
                });
            } else {
                Dispatcher.handleServerAction({
                    type: productAction.PRODUCT_UPDATE_SUCCESS,
                    data: { id : id }
                });
            }
        }
    },
    setAllProducts: function (products) {

        products = products || null;

        // TODO transformar em async com callback seguindo o exemplo do Fluxxor
        // e ver se isso dará problema caso eu faça uma outra chamada de outro
        // local em paralelo (erro de multiplos requests)
        if (!products) {
            Dispatcher.handleServerAction({
                type: productAction.RECEIVE_RAW_PRODUCTS_START,
                data: null
            });
        } else {
            if (products instanceof Error) {
                Dispatcher.handleServerAction({
                    type: productAction.RECEIVE_RAW_PRODUCTS_ERROR,
                    data: products
                });
            } else {
                Dispatcher.handleServerAction({
                    type: productAction.RECEIVE_RAW_PRODUCTS_SUCCESS,
                    data: products
                });
            }
        }

    }
};

module.exports = ProductServerActionCreator;
