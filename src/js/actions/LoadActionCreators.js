var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Dispatcher = require('../dispatcher/AppDispatcher'),
    debug = require('debug')('PlayerActionCreators.js'),
    loadAction = ActionTypes.Loading,
    LoadActionCreator;

 LoadActionCreator = {

    load: function (action, state, message) {

        if (!arguments.length) {
            throw new Error('You need to specify for which Event this loading being fired for');
        }

        if (arguments[1] === 'boolean' && arguments.length == 2) {
            state = arguments[1] || true;
            message = null;
        }

        if (arguments[1] === 'string' && arguments.length == 2) {
            data = true;
            message = arguments[1];
        }

        Dispatcher.handleViewAction({
            type: loadAction.LOADING,
            data: {
                action: action,
                state: state,        // true for isLoading, false for isNotLoading
                message: message    // message initializing loading
            }
        });
    },

    loaded: function (action, state, message) {

        if (!arguments.length) {
            throw new Error('You need to specify wich event this loaded fire for');
        }

        Dispatcher.handleViewAction({
            type: loadAction.READY,
            data: {
                action: action,
                state: false,       // false for error, true for success
                message: null       // error message or success message
            }
        });
    }
};


module.exports = LoadActionCreator;
