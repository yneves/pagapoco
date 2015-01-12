var db = require('./FireApi.js').base,
    LoginServerActions = require('../actions/PlayerServerActionCreators'),
    debug = require('debug')('PlayerApi.js'),
    playerData; // TODO get from data folder

Player = {
    login: function (user, pass) {
        db.authWithPassword({
            "email": user,
            "password": pass
        }, function(error, authData) {
            if (error) {
                debug("Login Failed!", error);
                LoginServerActions.logado(false);
            } else {
                debug("Authenticated successfully with payload:", authData.password.email);
                LoginServerActions.logado(true);
            }
        });
    },
    logout: function () {
        LoginServerActions.logado(false);
        db.unauth();
    },
    authDataCallback: function (authData) {
        if (authData) {
          LoginServerActions.logado(true);
        } else {
          LoginServerActions.logado(false);
        }
    },
    check: function () {
        db.onAuth(this.authDataCallback);
    }
};

module.exports = Player;