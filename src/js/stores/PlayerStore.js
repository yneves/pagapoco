var ActionTypes = require('../constants/AppConstants').ActionTypes,
    AppDispatcher = require('../dispatcher/AppDispatcher'),
    Store = require('../utils/Store'),
    playerAction = ActionTypes.Player,
    PlayerStore,
    _player,
    _currentLogin,
    _isNew;

_player = {};
_currentLogin = false;

// Boolean
function _isLogged(data){
    _currentLogin = data.state;
}

function _newPlayer(data){
    _isNew = data.state;
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
    playerAction.LOGADO,  _isLogged,
    playerAction.NEW_USER,  _newPlayer
);


module.exports = PlayerInstance;