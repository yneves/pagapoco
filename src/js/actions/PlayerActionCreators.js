var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Dispatcher = require('../dispatcher/AppDispatcher'),
    Validator = require('../utils/validator'),
    api = require('../api/AppApi').player,
    debug = require('debug')('PlayerActionCreators.js'),
    playerAction = ActionTypes.Player,
    PlayerActionCreator;

 PlayerActionCreator = {

     initPlayer: function () {
        Dispatcher.handleViewAction({
            type: playerAction.INIT,
            data: null
        });
        if (Validator.isFunction(api.check)) {
            api.check();
        } else {
            debug('No check valid method found');
        }
     },

    logIn: function (user, pass) {
        Dispatcher.handleViewAction({
            type: playerAction.LOGIN_IN,
            data: null
        });
        if (Validator.isFunction(api.login)) {
            api.login(user, pass);
        } else {
            debug('No login valid method found');
        }
    },

     faceLogIn: function(){
         Dispatcher.handleViewAction({
             type: playerAction.FACEBOOK_LOGIN,
             data: null
         });
        if (Validator.isFunction(api.faceLogIn)) {
            api.faceLogIn();
        } else {
            debug('No faceLogIn valid method found');
        }

     },

     registerUser: function(user,pass,info){
         Dispatcher.handleViewAction({
             type: playerAction.CREATE_USER,
             data: null
         });
        if (Validator.isFunction(api.createUser)) {
            api.createUser(user, pass, info);
        } else {
            debug('No createUser valid method found');
        }
     },

     logOut: function(){
        Dispatcher.handleViewAction({
            type: playerAction.LOGOUT,
            data: null
        });
        if (Validator.isFunction(api.logout)) {
            debug('Api logout');
            api.logout();
        } else {
            debug('No logOut valid method found');
        }
    },

    // called when a player want's to add a product to a list
    addProductToList: function (productId) {
        debug('ActionCreator - addProductToList');
        Dispatcher.handleViewAction({
            type : playerAction.ADD_PRODUCT_TO_LIST,
            data : { productId : productId }
        });

        if (Validator.isFunction(api.syncPlayerProductList)) {
            api.syncPlayerProductList(productId);
        } else {
            debug('No syncProduct valid method found');
        }
    },

    // called when a player want's to remove a product from a list
    removeProductFromList: function (productId) {
        debug('ActionCreator = removeProductFromList');
        Dispatcher.handleViewAction({
            type : playerAction.REMOVE_PRODUCT_FROM_LIST,
            data : { productId : productId }
        });

        if (Validator.isFunction(api.syncPlayerProductList)) {
            api.syncPlayerProductList(productId);
        } else {
            debug('No syncProduct valid method found');
        }
    }
};

module.exports = PlayerActionCreator;
