var db = require('./FireApi.js').base,
    LoginServerActions = require('../actions/PlayerServerActionCreators'),
    debug = require('debug')('PlayerApi.js');

Player = {
    login: function (user, pass) {
        db.authWithPassword({
            "email": user,
            "password": pass
        }, function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
                LoginServerActions.logado(false);
            } else {
                console.log("Authenticated successfully with payload:", authData.password.email);
                LoginServerActions.logado(true);
            }
        });
    },
    logout: function () {
        LoginServerActions.logado(false);
        db.unauth();
    },
    //authDataCallback: function (authData) {
    //    if (authData) {
    //      LoginServerActions.logado(true);
    //    } else {
    //      LoginServerActions.logado(false);
    //    }
    //},
    check: function () {
        var authData = db.getAuth();
        if (authData) {
            LoginServerActions.logado(true);
        } else {
            LoginServerActions.logado(false);
        }
    }
};

module.exports = Player;
