
var db = require('./FireApi.js'),
    ApiPlayerActionCreator = require('../actions/ApiPlayerActionCreator'),
    lodash = {
        objects: {
            merge: require('lodash-node/modern/objects/merge')
        }
    },
    PlayerApi,
    Player = require('../data/Player'),
    _info;


PlayerApi = {

    login: function (user, pass) {

        // init server sync, fire event
        ApiPlayerActionCreator.login(null);

        // start syncing with server
        db.base.authWithPassword({
            "email": user,
            "password": pass
        }, function(error, authData) {
            if (error) {
                console.log("Login Failed! Cause: " + error);
                ApiPlayerActionCreator.login({
                    state: false
                });
            } else {
                console.log(authData);
                Player.checkIfUserExists(authData);
            }
        });
    },

    faceLogIn: function (){

        // init server sync, fire event
        ApiPlayerActionCreator.login(null);

        // start syncing with server
        db.base.authWithOAuthPopup("facebook", function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
                ApiPlayerActionCreator.login({
                    state: false
                });
            } else {
                console.log("Authenticated successfully with payload:", authData.uid + ' ' + authData.provider);
                console.log(authData);
                PlayerApi.checkIfUserExists(authData);
            }
         },{scope: "email"});
    },

    logout: function () {
        // TODO check if there is some way to validate this callback
        ApiPlayerActionCreator.login({
            state: false
        });
        db.base.unauth();
    },

    check: function () {
        var authData;
        authData = db.base.getAuth();
        console.log(authData);
        if (authData && authData !== null) {
            ApiPlayerActionCreator.login({
                state: true
            });
        } else {
            ApiPlayerActionCreator.login({
                state: false
            });
        }
    },

    checkIfUserExists: function(authData) {

        var newUser;

        db.Users.findByKey(authData.uid, function (snapshot) {

            if (snapshot instanceof Error) { // error ocurred
                console.log(snapshot);
            } else if (snapshot.val() !== null){ // user exists
                ApiPlayerActionCreator.login({
                    state: true
                });
                // get the most recent user data from facebook
                if (authData.provider === 'facebook') {
                    newUser = Player.create('facebook', authData);
                    db.Users.child(authData.uid).save(newUser, function (err) {
                        if (err) {
                            console.log('Erro ao atualizar usuário');
                        } else {
                            console.log('Usuário atualizado com sucesso');
                        }
                    });
                }
            } else {    // new user
                ApiPlayerActionCreator.login({
                    state: true,
                    isNew: true
                });
                if(authData.provider === 'facebook'){
                    newUser = Player.create('facebook', authData);
                    db.Users.createWithKey(newUser.get('uid'), newUser, function (err) {
                        if (err) {
                            console.log('Creating new Facebook user - error');
                        } else {
                            console.log('Creating new facebook user - success');
                        }
                    });
                } else{
                    authData.password = lodash.objects.merge(authData.password, _info);
                    console.log('Not-Facebook');
                    console.log(authData);
                    newUser = Player.create('simple', authData);
                    db.Users.createwithKey(newUser.get('uid'), newUser, function (err) {
                        if (err) {
                            console.log('Creating new Simple user - error');
                        } else {
                            console.log('Creating new Simple user - success');
                        }
                    });
                }
            }
        });
    },

    createUser: function(user,pass,info){

        _info = info;

        // start registering player, fire api
        ApiPlayerActionCreator.register(null);

        db.base.createUser({
            email: user,
            password: pass
        }, function(error) {
            if (error) {
                ApiPlayerActionCreator.register(new Error(error));
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
                ApiPlayerActionCreator.register({
                    user: user
                });
                PlayerApi.login(user, pass);
            }
        });
    }


};

module.exports = PlayerApi;
