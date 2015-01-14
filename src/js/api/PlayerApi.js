
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

    faceLogin: function(){
        db.authWithOAuthPopup("facebook", function(error, authData) {
                if (error) {
                    console.log("Login Failed!", error);
                    ApiPlayerActionCreator.logado(false);
                } else {
                    console.log("Authenticated successfully with payload:", authData);
                    ApiPlayerActionCreator.logado(true);
                }
         });
    },

    logout: function () {
        ApiPlayerActionCreator.logado(false);
        db.unauth();
    },

    check: function () {
        var authData = db.getAuth();
        if (authData && authData != null) {
            ApiPlayerActionCreator.logado(true);
        } else {
            ApiPlayerActionCreator.logado(false);
        }
    },

 userExistsCallback: function(userId, exists) {
    if (exists){
        ApiPlayerActionCreator.newUser(true);
    } else {
        ApiPlayerActionCreator.newUser(false);
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
