
var ActionTypes = require('../constants/AppConstants').ActionTypes,
    AppDispatcher = require('../dispatcher/AppDispatcher'),
    Store = require('../utils/Store'),
    assign = require('object-assign'),
    _playerAction,
    _player,
    PlayerStore,
    _current_login;

_current_login = false;
_playerAction = ActionTypes.Player;
_player = {};
_showLoginRegister = false;


// Boolean
function _isLogged(data){
    _current_login = data.state;
}


PlayerStore = Store.extend({
    CHANGE_EVENT: 'change_player',

    getLogin: function(){
        return _current_login;
    }
});



PlayerInstance = new PlayerStore(
    _playerAction.LOGADO,  _isLogged

);


module.exports = PlayerInstance;