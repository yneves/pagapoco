
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

<<<<<<< HEAD
    CHANGE_EVENT: 'change_player',
=======
    getLogin: function(){
        return _current_login;
    }
});
>>>>>>> 376e0355d8eb47cd1c34de3562eff4bdd6d3a1bd

    getLogin: function () {
        return _currentLogin;
    }

});

PlayerInstance = new PlayerStore(
<<<<<<< HEAD
    playerAction.LOGADO,  _isLogged
=======
    _playerAction.LOGADO,  _isLogged

>>>>>>> 376e0355d8eb47cd1c34de3562eff4bdd6d3a1bd
);


module.exports = PlayerInstance;
