
var db = require('./FireApi.js').base,
    ApiPlayerActionCreator = require('../actions/ApiPlayerActionCreator'),
    _ = require('lodash-node'),
    Player,
    _authData,
    _info;


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
                _authData = authData;
                Player.checkIfUserExists(authData.uid);
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
                    console.log("Authenticated successfully with payload:", authData.uid + ' ' + authData.provider);
                    _authData = authData;
                    Player.checkIfUserExists(authData.uid);
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
        if(_authData.provider === 'facebook'){
            db.child('Users').child(userId).set(_authData);
        } else{
            console.log('Not-Facebook');
            _authData.password = _.merge(_authData.password,_info );
            console.log(_authData);
            db.child('Users').child(userId).set(_authData);
        }
    }
},

checkIfUserExists: function(userId) {
    db.child('Users').child(userId).once('value', function(snapshot) {
        var exists = (snapshot.val() !== null);
        Player.userExistsCallback(userId, exists);
    });
},

    createUser: function(user,pass,info){
        _info = info;
        db.createUser({
            email: user,
            password: pass
        }, function(error) {
            if (error) {
                switch (error.code) {
                    case "EMAIL_TAKEN":
                        console.log("The new user account cannot be created because the email is already in use.");
                        break;
                    case "INVALID_EMAIL":
                        console.log("The specified email is not a valid email.");
                        break;
                    default:
                        console.log("Error creating user:", error);
                }
            } else {
                console.log("User account created successfully!");
                    Player.login(user,pass);

            }
        });
    }


};

module.exports = Player;
