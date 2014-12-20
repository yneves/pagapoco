
var ActionTypes = require('../constants/AppConstants').ActionTypes,
    AppDispatcher = require('../dispatcher/AppDispatcher'),
    Store = require('../utils/Store'),
    assign = require('object-assign'),
    debug = require('debug')('PlayerStore.js'),
    _playerAction,
    _productAction,
    _player,
    _showLogin,
    PlayerStore;

_playerAction = ActionTypes.Player;
_productAction = ActionTypes.Product;
_player = {};
_showLoginRegister = false;

function _setPlayer(player) {
    // @todo check if player is a valid object
    _player = player;
}

function _setShowLoginRegister(show) {
    if (show) {
        _showLoginRegister = true;
    } else {
        _showLoginRegister = false;
    }
}

/**
 * Set store and define its public API, the component will use it to get data from the store and also to listen to it
 */
PlayerStore =

    assign({}, Store, {

        CHANGE_EVENT: 'change_player',

        getPlayer: function () {
            return _player;
        },

        getShowLoginRegister: function () {
            return _showLoginRegister;
        }

    });

/**
 * Associate Store with its internal events
 *
 * Bellow it is a description on how the store are going to listen from the events the Dispatcher Send to it and what
 * it is suposed to do
 *
 */
PlayerStore.dispatchToken = AppDispatcher.register(function (payload){

    var action,
        shouldEmitChange;

    // shortcut
    action = payload.action;
    shouldEmitChange = true;

    switch (action.type) {

        case _playerAction.SET_PLAYER:
            //
            break;

        case _playerAction.RECEIVE_RAW_PLAYER_START:
            //
            break;

        case _playerAction.RECEIVE_RAW_PLAYER_ERROR:
            //
            break;

        case _playerAction.RECEIVE_RAW_PLAYER_SUCCESS:
            //
            break;

        case _productAction.ADD_WISHLIST:
            if (!_player.id) {
                _setShowLoginRegister(true);
            }
            break;

        default:
            shouldEmitChange = false;
            debug('ocorreu default para o payload action: ' + action.type);
    }

    if (shouldEmitChange) {
        ProductStore.emitChange();
    }

});

module.exports = PlayerStore;
