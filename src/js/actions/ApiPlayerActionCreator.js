var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Dispatcher = require('../dispatcher/AppDispatcher'),
    LoadActionCreator = require('./LoadActionCreators'),
    debug = require('debug')('PlayerServerActionCreators.js'),
    playerAction = ActionTypes.Player,
    PlayerServerActionCreator;

PlayerServerActionCreator = {

    login: function (playerData) {

        playerData = playerData || null;

        // the server receive the product update event but hasn't returned anything yet
        if(!playerData) {
            debug('Started login player with server - no data yet');
            LoadActionCreator.load('PLAYER_LOGIN_START', true);
            Dispatcher.handleServerAction({
                type: playerAction.PLAYER_LOGIN_START,
                data: null
            });
        } else {
            // if there was an error while trying to update the product in the server
            LoadActionCreator.loaded('PLAYER_LOGIN_START', false);
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
            LoadActionCreator.load('PLAYER_REGISTER_START', true);
            Dispatcher.handleServerAction({
                type: playerAction.PLAYER_REGISTER_START,
                data: null
            });
        } else {
            // if there was an error while trying to update the product in the server
            LoadActionCreator.loaded('PLAYER_REGISTER_START', false);
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
