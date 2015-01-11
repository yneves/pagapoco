var Firebase = require('firebase'),
LoginServerActions = require('../actions/PlayerServerActionCreators'),
fireApi = {};

  // _DB It's  the Main DB, use it for General Login.
  fireApi._DB = new Firebase('http://glowing-torch-4538.firebaseio.com');


  fireApi.login = function (user, pass){
    this._DB.authWithPassword({
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
  };

fireApi.logout = function(){
  LoginServerActions.logado(false);
  this._DB.unauth();
};

fireApi.authDataCallback  = function (authData) {
  if (authData) {
    LoginServerActions.logado(true);
  } else {
    LoginServerActions.logado(false);
  }
};


fireApi.check = function (){
  this._DB.onAuth(this.authDataCallback);
};


module.exports = fireApi;
