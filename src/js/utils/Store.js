
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

    // arguments are ACTIONS => FUNCTIONS, so they must always met each other (even numbers)
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

    this.dispatchToken = AppDispatcher.register(function (payload) {
        if (payload instanceof Object) {
            shouldEmitChange = false;
            lodash.collections.forEach(bindedActions, function (value, key) {
                if (key === payload.action.type) {
                    if (payload.action.data instanceof Object || payload.action.data === null) {
                        // value should be a function of the object that will receive the data
                        // object as it's parameters
                        if (value instanceof Function) {
                            value(payload.action.data);
                            shouldEmitChange = true;
                        } else {
                            debug(payload.action);
                            throw new TypeError('Need a valid function to pass payload data as argument');
                        }
                    } else {
                        debug(payload.action);
                        throw new TypeError('Payload data must be an instance of Object or null');
                    }
                }
            });
            if (shouldEmitChange) {
                this.emitChange();
            }
        } else {
            throw new TypeError('Payload must be an instance of Object');
        }
    }.bind(this));
};

lodash.objects.assign(
    Store.prototype,
    EventEmitter.prototype,
    {
        CHANGE_EVENT: 'change', // default change_event value

        emitChange: function () {
            this.emit(Store.CHANGE_EVENT);
        },

        addChangeListener: function (callback) {
            this.on(Store.CHANGE_EVENT, callback);
        },

        removeChangeListener: function (callback) {
            this.removeListener(Store.CHANGE_EVENT, callback);
        }
    }
);

// same extend function used by backbone
Store.extend = extend;

module.exports = Store;
