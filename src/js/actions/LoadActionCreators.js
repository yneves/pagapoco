var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Dispatcher = require('../dispatcher/AppDispatcher'),
    Validator = require('../utils/validator'),
    debug = require('debug')('PlayerActionCreators.js'),
    loadAction = ActionTypes.Loading,
    LoadActionCreator;

 LoadActionCreator = {

     load: function(data,message){
         if(!arguments.length){
             data = true;
             message = null;
         }

         if (arguments[0] === 'string' && arguments.length == 1 ){
             data = true;
             message = arguments[0];
         }

         if(arguments[1] === 'boolean' && arguments.length == 1){
             message = null;
         }

         Dispatcher.handleViewAction({
            type: loadAction.LOADING,
            data: {
                state: data,
                message: message
            }
        });
     },

     loaded: function(){
         Dispatcher.handleViewAction({
             type: loadAction.READY,
             data: {
                 state: false,
                 message: null
             }
         });
     }
};


module.exports = LoadActionCreator;
