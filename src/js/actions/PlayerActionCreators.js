var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Dispatcher = require('../dispatcher/AppDispatcher'),
    debug = require('debug')('PlayerActionCreators.js'),
    playerAction = ActionTypes.Player,
    PlayerActionCreator;

 PlayerActionCreator = {

    initPlayer: function () {
        Dispatcher.handleViewAction({
            type: playerAction.INIT,
            data: null
        });
    },

    logIn: function (user, pass) {
        Dispatcher.handleViewAction({
            type: playerAction.LOGIN_IN,
            data: {
                user: user,
                pass: pass
            }
        });
    },

    faceLogIn: function () {
        Dispatcher.handleViewAction({
            type: playerAction.FACEBOOK_LOGIN,
            data: null
        });
    },

    registerUser: function (user, pass, info) {
        Dispatcher.handleViewAction({
            type: playerAction.CREATE_USER,
                data: {
                    user: user,
                    pass: pass,
                    info: info
            }
        });
    },

    logOut: function () {
        Dispatcher.handleViewAction({
            type: playerAction.LOGOUT,
            data: null
        });
    },

    // called when a player want's to add a product to a list
    addProductToList: function (productId) {
        debug('addProductToList');
        Dispatcher.handleViewAction({
            type : playerAction.ADD_PRODUCT_TO_LIST,
            data : { productId : productId }
        });
    },

    // called when a player want's to remove a product from a list
    removeProductFromList: function (productId) {
        debug('removeProductFromList');
        Dispatcher.handleViewAction({
            type : playerAction.REMOVE_PRODUCT_FROM_LIST,
            data : { productId : productId }
        });
    }
};

module.exports = PlayerActionCreator;
