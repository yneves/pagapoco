var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Dispatcher = require('../dispatcher/AppDispatcher'),
    fireApi = require('../api/fireApi'),
    playerAction = ActionTypes.Player,
    PlayerActionCreator;

 PlayerActionCreator = {

     initPlayer: function(){
         Dispatcher.handleViewAction({
             type: playerAction.INIT,
             data: true
         });
         fireApi.check();
     },

    logIn: function(user,pass){
        Dispatcher.handleViewAction({
            type: playerAction.LOGIN_IN,
            user: user,
            pass: pass
        });
        fireApi.login(user,pass);
    },

    logOut: function(){
        Dispatcher.handleViewAction({
            type: playerAction.LOGOUT,
            data: false
        });
        fireApi.logout();
    }

};

module.exports = PlayerActionCreator;
