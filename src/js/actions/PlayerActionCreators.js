var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Dispatcher = require('../dispatcher/AppDispatcher'),
    Validator = require('../utils/validator'),
    api = require('../api/AppApi').player,
    debug = require('debug')('PlayerActionCreators.js'),
    playerAction = ActionTypes.Player,
    PlayerActionCreator;

 PlayerActionCreator = {

     initPlayer: function(){
        Dispatcher.handleViewAction({
            type: playerAction.INIT,
            data: { state: false }
        });
        if (Validator.isFunction(api.check)) {
            api.check();
        } else {
            debug('No check valid method found');
        }
     },

    logIn: function(user,pass){
        Dispatcher.handleViewAction({
            type: playerAction.LOGIN_IN,
            data: {
                user: user,
                pass: pass
            }
        });
        if (Validator.isFunction(api.login)) {
            api.login(user,pass);
        } else {
            debug('No login valid method found');
        }
    },

    logOut: function(){
        Dispatcher.handleViewAction({
            type: playerAction.LOGOUT,
            data: { state: false }
        });
        if (Validator.isFunction(api.logout)) {
            api.logout();
        } else {
            debug('No logou valid method found');
        }
    }
};

module.exports = PlayerActionCreator;
