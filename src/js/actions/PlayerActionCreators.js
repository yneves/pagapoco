var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Dispatcher = require('../dispatcher/AppDispatcher'),
    api = require('../api/AppApi').player,
    playerAction = ActionTypes.Player,
    PlayerActionCreator;

 PlayerActionCreator = {

     initPlayer: function(){
         Dispatcher.handleViewAction({
             type: playerAction.INIT,
             data: true
         });
         api.check();
     },

    logIn: function(user,pass){
        Dispatcher.handleViewAction({
            type: playerAction.LOGIN_IN,
            user: user,
            pass: pass
        });
        api.login(user,pass);
    },

    logOut: function(){
        Dispatcher.handleViewAction({
            type: playerAction.LOGOUT,
            data: false
        });
        api.logout();
    }

};

module.exports = PlayerActionCreator;
