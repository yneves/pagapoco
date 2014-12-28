
var AppConstants = require('../constants/AppConstants'),
    Dispatcher = require('flux').Dispatcher,
    async = require('async'),
    assign = require('object-assign'),
    PayloadSources = AppConstants.PayloadSources,
    dispatcher,
    queue,
    AppDispatcher;

dispatcher = new Dispatcher();

/*

    The best way so far to solve the problem of concurrency on the dispatcher.

    The thing is, since we have two possible sources of actions (Server and user),
    inevitably we can (and will) end up with problems of more than one action
    trying to be dispatched at the same time...

    More information about the issue can be found here
    https://github.com/facebook/flux/issues/106

*/
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
