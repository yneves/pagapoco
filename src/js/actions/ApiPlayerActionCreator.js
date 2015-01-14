var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Dispatcher = require('../dispatcher/AppDispatcher'),
    debug = require('debug')('PlayerServerActionCreators.js'),
    playerAction = ActionTypes.Player,
    PlayerServerActionCreator;

PlayerServerActionCreator = {

    logado: function(logged){
        Dispatcher.handleViewAction({
            type: playerAction.LOGADO,
            data: { state: logged }
        });
    },

    newUser: function(isNew){
        Dispatcher.handleViewAction({
            type: playerAction.NEW_USER,
            data: { state: isNew }
        });
    }


};

module.exports = PlayerServerActionCreator;
