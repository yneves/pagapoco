var ActionTypes = require('../constants/AppConstants').ActionTypes,
    AppDispatcher = require('../dispatcher/AppDispatcher'),
    Store = require('../utils/Store'),
    debug = require('debug')('PlayerStore.js'),
    playerAction = ActionTypes.Player,
    PlayerStore,
    _currentPlayer,
    _isNew;

_currentPlayer = null;
_isNew = false;

function _updatePlayerDataError(error) {
    debug('_updatePlayerDataError');
    debug(error);
}

function _updatePlayerData(data){
    debug(data);
    _currentPlayer = data || null;
    if (data) {
        if (data.player) {
            _currentPlayer = data.player;
            if (data.isNew) {
                _isNew = true;
            } else {
                _isNew = false;
            }
        } else {
            _currentPlayer = null;
            _isNew = false;
        }
    } else {
        _currentPlayer = null;
        _isNew = false;
    }
}

function _registerPlayerDataError(error) {
    debug('_registerPlayerDataError');
    debug(error);
}

function _registerPlayerData(data) {
    debug('_registerPLayerData called');
    debug(data);
}


function addProductToList(data) {
    var model;
    // if there is a player we set the product to a list, otherwise just ignore the request
    if(_currentPlayer && _currentPlayer.get('uid')) {
        debug('Adicionando a lista do jogador');
    } else {
        debug('No current player');
    }
}

function removeProductFromList(data) {
    var model;
    if (_currentPlayer && _currentPlayer.get('uid')) {
        debug('Removendo da lista do jogador');
    } else {
        debug('No current player');
    }
}

function _updatePlayerProductListError(error) {
    debug('_upadtePlayerProductListError');
    debug(error);
}

function _updatePlayerProductList(data) {
    debug('_updatePlayerProductList');
    debug(data);
}


PlayerStore = Store.extend({

    CHANGE_EVENT: 'change_player',

    getLogin: function () {
        return _currentPlayer;
    },

    getUserHistory: function () {
        return _isNew;
    },

    getPlayerCurrentProductList: function (){
        return _currentPlayer;
    }

});

PlayerInstance = new PlayerStore(
    playerAction.ADD_PRODUCT_TO_LIST, addProductToList,
    playerAction.REMOVE_PRODUCT_FROM_LIST, removeProductFromList,
    playerAction.PLAYER_LOGIN_START, _updatePlayerData,
    playerAction.PLAYER_LOGIN_ERROR, _updatePlayerDataError,
    playerAction.PLAYER_LOGIN_SUCCESS, _updatePlayerData,
    playerAction.PLAYER_REGISTER_START, _registerPlayerData,
    playerAction.PLAYER_REGISTER_ERROR, _registerPlayerDataError,
    playerAction.PLAYER_REGISTER_SUCCESS, _registerPlayerData,
    playerAction.PLAYER_PRODUCT_LIST_START, _updatePlayerProductList,
    playerAction.PLAYER_PRODUCT_LIST_ERROR, _updatePlayerProductListError,
    playerAction.PLAYER_PRODUCT_LIST_SUCCESS, _updatePlayerProductList
);


module.exports = PlayerInstance;
