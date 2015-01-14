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
    }

};

module.exports = PlayerServerActionCreator;
