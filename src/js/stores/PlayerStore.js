var ActionTypes = require('../constants/AppConstants').ActionTypes,
    AppDispatcher = require('../dispatcher/AppDispatcher'),
    Store = require('../utils/Store'),
    playerAction = ActionTypes.Player,
    PlayerStore,
    _currentLogin,
    _isNew,
    _updatePlayerData;

_currentLogin = false;
_isNew = false;

// Boolean
function _updatePlayerData(data){
    if (data) {
        _currentLogin = data.state || false;
        _isNew = data.isNew || false;
    } else {
        _currentLogin = false;
        _isNew = false;
    }
}

function _registerPlayerData(data) {
    debug('_registerPLayerData called');
    debug(data);
}

PlayerStore = Store.extend({

    CHANGE_EVENT: 'change_player',

    getLogin: function () {
        return _currentLogin;
    },

    getUserHistory: function (){
        return _isNew;
    }

});

PlayerInstance = new PlayerStore(
    playerAction.PLAYER_LOGIN_START, _updatePlayerData,
    playerAction.PLAYER_LOGIN_SUCCESS, _updatePlayerData,
    playerAction.PLAYER_LOGIN_ERROR, _updatePlayerData,
    playerAction.PLAYER_REGISTER_START, _registerPlayerData,
    playerAction.PLAYER_REGISTER_SUCCESS, _registerPlayerData,
    playerAction.PLAYER_REGISTER_ERROR, _registerPlayerData
);


module.exports = PlayerInstance;
