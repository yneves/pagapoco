
var EventEmitter = require('events').EventEmitter,
    AppDispatcher = require('../dispatcher/AppDispatcher'),
    _isFunction = require('lodash-node/modern/objects/isFunction'), // TODO shitty name...
    _isObject = require('lodash-node/modern/objects/isObject'), // TODO shitty name...
    _forEach = require('lodash-node/modern/collections/forEach'), // TODO shitty name...
    _assign = require('lodash-node/modern/objects/assign'), // TODO shitty name...
    _invert = require('lodash-node/modern/objects/invert'), // TODO shitty name...
    extend = require('./Extend'),
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

    if (actions.length === 1 && _isObject(actions[0])) {
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
        _forEach(bindedActions, function (value, key) {
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
_assign(Store.prototype, EventEmitter.prototype);

_assign(Store.prototype, {

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

Store.extend = extend;

module.exports = Store;
