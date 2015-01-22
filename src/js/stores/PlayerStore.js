var ActionTypes = require('../constants/AppConstants').ActionTypes,
    AppDispatcher = require('../dispatcher/AppDispatcher'),
    Store = require('../utils/Store'),
    playerAction = ActionTypes.Player,
    PlayerStore,
    _currentPlayer,
    _isNew;

_currentPlayer = false;
_isNew = false;

// Boolean
function _updatePlayerData(data){
    if (data) {
        _currentPlayer = data.state || false;
        _isNew = data.isNew || false;
    } else {
        _currentPlayer = false;
        _isNew = false;
    }
}

function _registerPlayerData(data) {
    debug('_registerPLayerData called');
    debug(data);
}


function addProductToList(list, productId) {
    var model;
    // if there is a player we set the product to a list, otherwise just ignore the request
    if(_currentPlayer && _currentPlayer.get('uid')) {
        debug('Adicionando a lista do jogador');
    } else {
        debug('No current player');
    }
}

function removeProductFromList(list, productId) {
    var model;
    if (_currentPlayer && _currentPlayer.get('uid')) {
        debug('Removendo da lista do jogador');
    } else {
        debug('No current player');
    }
}


PlayerStore = Store.extend({

    CHANGE_EVENT: 'change_player',

    getLogin: function () {
        return _currentPlayer;
    },

    getUserHistory: function (){
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
    playerAction.PLAYER_LOGIN_SUCCESS, _updatePlayerData,
    playerAction.PLAYER_LOGIN_ERROR, _updatePlayerData,
    playerAction.PLAYER_REGISTER_START, _registerPlayerData,
    playerAction.PLAYER_REGISTER_SUCCESS, _registerPlayerData,
    playerAction.PLAYER_REGISTER_ERROR, _registerPlayerData
);


module.exports = PlayerInstance;
