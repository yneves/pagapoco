var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Dispatcher = require('../dispatcher/AppDispatcher'),
    playerAction = ActionTypes.Player,
    PlayerServerActionCreator;

PlayerServerActionCreator = {

    logado: function(logged){
        Dispatcher.handleViewAction({
            type: playerAction.LOGADO,
            data: logged
        });
    }

};

module.exports = PlayerServerActionCreator;
