var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Dispatcher = require('../dispatcher/AppDispatcher'),
    debug = require('debug')('PlayerServerActionCreators.js'),
    playerAction = ActionTypes.Player,
    PlayerServerActionCreator;

PlayerServerActionCreator = {

    login: function (playerData) {

        playerData = playerData || null;

        // the server receive the product update event but hasn't returned anything yet
        if(!playerData) {
            debug('Started login player with server - no data yet');
            Dispatcher.handleServerAction({
                type: playerAction.PLAYER_LOGIN_START,
                data: null
            });
        } else {
            // if there was an error while trying to update the product in the server
            if (playerData instanceof Error) {
                debug('Server login responded - With error');
                debug(playerData);
                Dispatcher.handleServerAction({
                    type: playerAction.PLAYER_LOGIN_ERROR,
                    data: playerData
                });
            } else {
                debug(playerData);
                debug('Server login responded - no errors');
                // product was successfully updated in the serve
                Dispatcher.handleServerAction({
                    type: playerAction.PLAYER_LOGIN_SUCCESS,
                    data: playerData
                });
            }
        }
    },

    register: function (playerData) {

        playerData = playerData || null;

        // the server receive the product update event but hasn't returned anything yet
        if(!playerData) {
            debug('Started register player with server - no data yet');
            Dispatcher.handleServerAction({
                type: playerAction.PLAYER_REGISTER_START,
                data: null
            });
        } else {
            // if there was an error while trying to update the product in the server
            if (playerData instanceof Error) {
                debug('Server register responded - With error');
                debug(playerData);
                Dispatcher.handleServerAction({
                    type: playerAction.PLAYER_REGISTER_ERROR,
                    data: playerData
                });
            } else {
                debug(playerData);
                debug('Server register responded - no errors');
                // product was successfully updated in the serve
                Dispatcher.handleServerAction({
                    type: playerAction.PLAYER_REGISTER_SUCCESS,
                    data: playerData
                });
            }
        }
    }
};

module.exports = PlayerServerActionCreator;
