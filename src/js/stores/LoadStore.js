var ActionTypes = require('../constants/AppConstants').ActionTypes,
    AppDispatcher = require('../dispatcher/AppDispatcher'),
    Store = require('../utils/Store'),
    Texts = require('../components/texts'),
    loadAction = ActionTypes.Loading,
    LoadStore,
    LoadInstance,
    _actionType,
    _isLoading,
    _LoadingMessage;

_actionType = null;
_isLoading  = true;
_LoadingMessage = Texts.loading.normal;

// Boolean

// TODO precisa verificar o state do loading para os action types
// TODO já que ele precisa preservar o loading caso tenha qualquer action type
// TODO ainda carregando
function _theLoading(data){
    _isLoading = data.state;
    _actionType = data.action;
    _LoadingMessage = data.message;

    if (data.message === null){
        _LoadingMessage = Texts.loading.normal;
    }
    console.log(_actionType + ' loading status: ' + _isLoading);
}

LoadStore = Store.extend({

    CHANGE_EVENT: 'change_player',

    getLoadingState: function () {
        return _isLoading;
    },

    getLoadingMessage: function (){
        return _LoadingMessage;
    }

});

LoadInstance = new LoadStore(
    loadAction.LOADING, _theLoading,
    loadAction.READY, _theLoading
);


module.exports = LoadInstance;
