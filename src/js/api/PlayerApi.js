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

    faceLogin: function(){
        db.authWithOAuthPopup("facebook", function(error, authData) {
                if (error) {
                    console.log("Login Failed!", error);
                    LoginServerActions.logado(false);
                } else {
                    console.log("Authenticated successfully with payload:", authData);
                    LoginServerActions.logado(true);
                }
         });
    },

    logout: function () {
        LoginServerActions.logado(false);
        db.unauth();
    },

    check: function () {
        var authData = db.getAuth();

        if (authData && authData != null) {
            LoginServerActions.logado(true);
        } else {
            LoginServerActions.logado(false);
        }
    },

 userExistsCallback: function(userId, exists) {
    if (exists){
        LoginServerActions.newUser(true);
    } else {
        LoginServerActions.newUser(false);
    }
},

checkIfUserExists: function(userId) {
    db.child('Users').child(userId).once('value', function(snapshot) {
        var exists = (snapshot.val() !== null);
        Player.userExistsCallback(userId, exists);
    });
}


};

module.exports = Player;