
var AppConstants = require('../constants/AppConstants'),
    Dispatcher = require('flux').Dispatcher,
    async = require('async'),
    assign = require('object-assign'),
    PayloadSources = AppConstants.PayloadSources,
    dispatcher,
    queue,
    AppDispatcher;

dispatcher = new Dispatcher();

queue = async.queue( function (task, callback) {
    var payload = {
        source: PayloadSources[task.source], // origin from the SERVER
        action: task.action
    };
    AppDispatcher.dispatch(payload);
    callback();
}, 1);

AppDispatcher = assign(dispatcher, {

    /**
     * @param {object} action The details of the action, including the action's
     * type and additional data coming from the server.
     */
    handleServerAction: function (action) {
        queue.push({source : 'SERVER_ACTION', action : action});
    },

    /**
     * @param {object} action The details of the action, including the action's
     * type and additional data coming from the view.
     */
    handleViewAction: function (action) {
        queue.push({source: 'VIEW_ACTION', action : action});
    }
});

module.exports = AppDispatcher;
