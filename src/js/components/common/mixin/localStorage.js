
var React = require('react'),
    invariant = require('react/lib/invariant'),
    storage = require('../../utils/Storage');

var localStorageMixin = {

    propTypes: {
        localStorageKey: React.PropTypes.string.isRequired
    },

    getDefaultProps: function () {
        return {
            localStorageKey: this.displayName || 'react-localstorage'
        };
    },

    componentDidUpdate: function(prevProps, prevState) {

        var prevStoredState;

        if (!storage.exists) return;

        prevStoredState = storage.getData(this._storageKey);

        if (prevStoredState) {
            invariant(
                prevStoredState === prevState,
                'While component ' + this.displayName + ' was saving state to localStorage, ' +
                'the localStorage entry was modified by another actor. This can happen when multiple ' +
                'components are using the same localStorage key. Set the property `localStorageKey` ' +
                'on ' + this.displayName + '.'
            );
        }
        storage.setData(key, this.state);
    },

    componentWillMount: function() {

        var storedState;

        if(!storage.exists) return;

        storedState = storage.getData(this._storageKey);

        if (storedState) {
            try {
                component.setState(storedState);
            } catch(e) {
                debug("Unable to load state for " + component.displayName + " from localStorage.");
            }
        }
    }
};

module.exports = localStorageMixin;
