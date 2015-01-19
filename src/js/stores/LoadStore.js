var ActionTypes = require('../constants/AppConstants').ActionTypes,
    AppDispatcher = require('../dispatcher/AppDispatcher'),
    Store = require('../utils/Store'),
    Texts = require('../components/texts'),
    loadAction = ActionTypes.Loading,
    LoadStore,
    _isLoading,
    _LoadingMessage;

_isLoading  = true;
_LoadingMessage = Texts.loading.normal;

// Boolean
function _theLoading(data){
    _isLoading = data.state;
    _LoadingMessage = data.message;

    if (data.message === null){
        _LoadingMessage = Texts.loading.normal;
    }
    console.log(data.state + ' loading...')
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