
var db = require('./FireApi.js').base,
    ApiPlayerActionCreator = require('../actions/ApiPlayerActionCreator'),
    Player;

Player = {
    login: function (user, pass) {
        db.authWithPassword({
            "email": user,
            "password": pass
        }, function(error, authData) {
            if (error) {
                console.log("Login Failed! Cause: " + error);
                ApiPlayerActionCreator.logado(false);
            } else {
                console.log("Authenticated successfully with payload: " + authData.password.email);
                ApiPlayerActionCreator.logado(true);
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
            ApiPlayerActionCreator.logado(true);
        } else {
            ApiPlayerActionCreator.logado(false);
        }
    }
};

module.exports = Player;
