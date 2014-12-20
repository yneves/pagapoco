var lodash = {
        object: require('lodash-node/modern/objects'),
        collections: {
            forEach: require('lodash-node/modern/collections/forEach')
        }
    },
    debug = require('debug')('Validate.js'),
    Validator;

Validator = {

    isBoolean: function isBoolean(boolean) {
        if (boolean === 1) {
            boolean = true;
        } else if (boolean === 0) {
            boolean = false;
        }
        return lodash.object.isBoolean(boolean);
    },

    isNumber: function isNumber(number) {
        return (lodash.object.isNumber(number) && lodash.object.isFinite(number));
    },

    // set the original value  and also return it if needed
    isPositiveDecimal: function isPositiveDecimal(decimal) {
        if (Validator.isNumber(decimal) && decimal >= 0) {
            return true;
        }
        return false;
    },

    // set the original value and also return it if needed
    isPositiveInteger: function isPositiveInteger(integer) {
        if (Validator.isNumber(integer) && integer >= 0) {
            return true;
        }
        return false;
    },

    isError: function isError(value) {
        // if (value instanceof Error || lodash.isError(value)) { works on lodash 3.0
        if (value instanceof Error) {
            return true;
        }
    }
};

// Lodash validation (data types) (lang methods);
// Helper class methods (working as a wrapper to lodash)
// https://github.com/lodash/lodash-node/blob/master/modern/lang.js
lodash.collections.forEach(['isString', 'isDate', 'isEmpty', 'isEqual', 'isNan', 'isNull', 'isRegExp',
    'isUndefined', 'isFunction', 'isObject', 'isPlainObject', 'isArray'], function (method) {
    Validator[method] = function() {
        var args = [].slice.call(arguments);
        return lodash.object[method].apply(lodash.object, args);
    };
});

module.exports = Validator;
