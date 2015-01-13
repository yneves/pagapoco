var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Dispatcher = require('../dispatcher/AppDispatcher'),
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
         api.check();
     },

    logIn: function(user,pass){
        Dispatcher.handleViewAction({
            type: playerAction.LOGIN_IN,
            data: {
                user: user,
                pass: pass
            }
        });
        api.login(user,pass);
    },

    logOut: function(){
        Dispatcher.handleViewAction({
            type: playerAction.LOGOUT,
            data: { state: false }
        });
        api.logout();
    }

};

module.exports = PlayerActionCreator;
