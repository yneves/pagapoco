
var EventEmitter = require('events').EventEmitter,
    AppDispatcher = require('../dispatcher/AppDispatcher'),
    lodash= {
        objects: {
            has: require('lodash-node/modern/objects/has'),
            isObject: require('lodash-node/modern/objects/isObject'),
            assign: require('lodash-node/modern/objects/assign'),
            invert: require('lodash-node/modern/objects/invert')
        },
        collections: {
            forEach: require('lodash-node/modern/collections/forEach')
        }

    },
    extend = require('backbone-extend-standalone'),
    debug = require('debug')('Store.js'),
    Store;

Store = function () {
    var actions = [],
        bindedActions = {},
        shouldEmitChange = false;

    actions = Array.prototype.slice.call(arguments);

    if (actions.length > 1 && actions.length % 2 !== 0) {
        throw new Error("bindActions must take an even number of arguments.");
    }

    if (actions.length === 1 && lodash.objects.isObject(actions[0])) {
        actions = actions[0];
        for (var key in actions) {
            if (actions.hasOwnProperty(key)) {
                bindedActions[key] = actions[key];
            }
        }
    } else {
        for (var i = 0; i < actions.length; i += 2) {
            var type = actions[i],
                handler = actions[i+1];

            if (!type) {
                throw new Error("Argument " + (i+1) + " to bindActions is a falsy value");
            }
            bindedActions[type] = handler;
        }
    }

    // TODO precisa conferir se esta funcionando como deve
    this.dispatchToken = AppDispatcher.register(function (payload) {

        // shortcut
        action = payload.action;
        shouldEmitChange = false;
        lodash.collections.forEach(bindedActions, function (value, key) {
            if (key === action.type) {
                value(payload.action.data);
                shouldEmitChange = true;
            }
        });

        if (shouldEmitChange) {
            this.emitChange();
        }
    }.bind(this));
};

 // TODO crap programming calling _assign twice...
lodash.objects.assign(Store.prototype, EventEmitter.prototype);

lodash.objects.assign(Store.prototype, {

    CHANGE_EVENT: 'change',

    emitChange: function () {
        this.emit(Store.CHANGE_EVENT);
    },

    addChangeListener: function (callback) {
        this.on(Store.CHANGE_EVENT, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(Store.CHANGE_EVENT, callback);
    }

});

// same extend function used by backbone
Store.extend = extend;

module.exports = Store;
