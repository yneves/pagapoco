
var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Dispatcher = require('../dispatcher/AppDispatcher'),
    debug = require('debug')('ProductActionCreators.js'),
    playerAction = ActionTypes.Player;

var PlayerActionCreator = {

    setPlayer: function (player) {

        player = player || null;

        if (!player) {
            Dispatcher.handleServerAction({
                type: ProductAction.RECEIVE_RAW_PLAYER_START,
                data: products
            });
        } else {
            if (products instanceof Error) {
                Dispatcher.handleServerAction({
                    type: ProductAction.RECEIVE_RAW_PLAYER_ERROR,
                    data: products
                });
            } else {
                Dispatcher.handleServerAction({
                    type: ProductAction.RECEIVE_RAW_PLAYER_SUCCESS,
                    data: products
                });
            }
        }
    }
};

module.exports = PlayerActionCreator;
