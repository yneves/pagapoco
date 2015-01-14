
var ActionTypes = require('../constants/AppConstants').ActionTypes,
    AppDispatcher = require('../dispatcher/AppDispatcher'),
    Store = require('../utils/Store'),
    playerAction = ActionTypes.Player,
    PlayerStore,
    _player,
    _currentLogin;

_player = {};
_currentLogin = false;

// Boolean
function _isLogged(data){
    _currentLogin = data.state;
}

PlayerStore = Store.extend({

    CHANGE_EVENT: 'change_player',

    getLogin: function () {
        return _currentLogin;
    }

});

PlayerInstance = new PlayerStore(
    playerAction.LOGADO,  _isLogged
);


module.exports = PlayerInstance;
