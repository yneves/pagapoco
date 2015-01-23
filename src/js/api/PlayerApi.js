var db = require('./FireApi.js'),
    ApiPlayerActionCreator = require('../actions/ApiPlayerActionCreator'),
    lodash = {
        objects: {
            merge: require('lodash-node/modern/objects/merge')
        }
    },
    PlayerApi,
    Player = require('../data/Player'),
    PlayerList = require('../data/PlayerList'),
    debug = require('debug')('PlayerApi.js'),
    _info;


function _checkOrUpdatePlayerData(authData) {

    var newPlayer;

    db.Users.findByKey(authData.uid, function (data) {

        if (data !== null){ // user exists
            // get the most recent user data from facebook
            newPlayer = Player.create(authData);
            if (authData.provider === 'facebook') {
                db.Users.child(authData.uid).save(newPlayer, function (err) {
                    if (err) {
                        console.log('Erro ao atualizar usuário');
                    } else {
                        console.log('Usuário atualizado com sucesso');
                    }
                });
            }

            // send the player data throught the system, since the player
            // already exists we can do that before the update above occurs
            ApiPlayerActionCreator.login({
                player: newPlayer
            });
            PlayerApi.loadPlayerProductList(newPlayer.get('uid'));

        } else {

            // new user
            if (authData.provider !== 'facebook') {
                authData.password = lodash.objects.merge(authData.password, _info);
            }

            newPlayer = Player.create(authData);
            db.Users.createWithKey(newPlayer.get('uid'), newPlayer, function (err) {
                if (err) {
                    console.log('Creating new user data - error');
                } else {
                    console.log('Creating new user data- success');
                    // send the player data through the system, we do that only
                    // after we are sure the player data was created and updated
                    // in the system
                    ApiPlayerActionCreator.login({
                        player: newPlayer,
                        isNew: true
                    });
                    PlayerApi.loadPlayerProductList(newPlayer.get('uid'));
                }
            });
        }
    }, 'uid');
}

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
                console.log('Login Failed! Cause: ' + error);
                ApiPlayerActionCreator.login(new Error(error));
            } else {
                console.log('Login success!');
                _checkOrUpdatePlayerData(authData);
            }
        });
    },

    faceLogIn: function () {

        // init server sync, fire event
        ApiPlayerActionCreator.login(null);

        // start syncing with server
        db.base.authWithOAuthPopup("facebook", function(error, authData) {
                if (error) {
                    console.log("Login Failed!", error);
                    ApiPlayerActionCreator.login(new Error(error));
                } else {
                    console.log("Authenticated successfully with payload:", authData.uid + ' ' + authData.provider);
                    _checkOrUpdatePlayerData(authData);
                }
            },
            { scope: "email" }
        );
    },

    logout: function () {
        // TODO check if there is some way to validate this callback
        db.base.unauth();
        Player.instance = null;
        ApiPlayerActionCreator.login({});
    },

    // check current user state
    check: function () {
        var authData,
            player;
        authData = db.base.getAuth();
        if (authData && authData !== null) {
            player = Player.create(authData);
            ApiPlayerActionCreator.login({
                player: player
            });
            // we have a player now get it's data
            PlayerApi.loadPlayerProductList(player.get('uid'));
        } else {
            ApiPlayerActionCreator.login(null);
        }
    },

    createUser: function (user, pass, info) {

        // global variable, called in another method with user extra info
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
                    player: user
                });
                // auto login player after it registered itself
                PlayerApi.login(user, pass);
            }
        });
    },

    loadPlayerProductList: function (uid) {

        // start fetching player list from server
        ApiPlayerActionCreator.setPlayerProductList(null);

        db.players_lists.findByKey(uid, function (data) {
            if (data !== null) {
                PlayerList.create(data);
                ApiPlayerActionCreator.setPlayerProductList(PlayerList.collection);
            } else {
                debug('No player list data found');
                ApiPlayerActionCreator.setPlayerProductList({});
            }
        }, 'uid');

    },

    syncPlayer: function () {
        debug('sync player data');
    },

    // sync current player product list with
    // if there is no list, create the first one, otherwise update it
    syncPlayerProductList: function () {
        debug('syncPlayerProductList');
        var currentPlayerUid,
            listToSave;

        if (Player.instance) {
            currentPlayerUid = Player.instance.get('uid');
        }

        if (currentPlayerUid) {
            db.players_lists.findByKey(currentPlayerUid, function (data) {
                if (data.val() !== null) {
                    debug('Player list data found, we should update it');
                    listToSave = PlayerList.collection.get(currentPlayerUid);
                    if (listToSave) {
                        var playerListRef = db.players_lists.child(currentPlayerUid);
                        playerListRef.save(listToSave, function (err) {
                            if (err) {
                                debug(err);
                                ApiPlayerActionCreator.update(new Error(err));
                            } else {
                                debug('Player list data updated with great success');
                            }
                        });
                    } else {
                        debug('No valid list found to update in the player list at the server');
                    }
                } else {
                    debug('Player list data NOT found, we should create it');
                    listToSave = PlayerList.collection.get(currentPlayerUid);
                    db.players_lists.createWithKey(currentPlayerUid, listToSave, function (err) {
                        if (err) {
                            ApiPlayerActionCreator.update(new Error(err));
                        } else {
                            debug('Player list data created with great success');
                        }
                    });
                }
            }, 'uid');
        } else {
            debug('syncPlayerProductList - no player uid found');
        }
    }

};

module.exports = PlayerApi;
