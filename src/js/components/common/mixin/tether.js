
var React = require('react'),
    isBrowser = (typeof window !== 'undefined'),
    Tether = isBrowser ? window.Tether || require('../../../../../node_modules/tether/tether') : null,
    assign = require('object-assign'),
    debug = require('debug')('tether.js');

/**
 * Default options for TetherJS
 * For a list of available configuration visit # http://github.hubspot.com/tether/
 */
var options = {
    element: null,
    target : null,
    leaveOnBlur: true,
    attachment: 'middle middle',
    targetAttachment: 'middle middle',
    plain : false,
    template : null,
    templateUrl : null,
    offset: '0 0',
    targetOffset: '0 0',
    // classes: {
    //     element: '' // animations here i guess
    // },
    classPrefix: 'tether',
    optimizations: {
        moveElement: false
    },
    constraints: [{
        to: 'window',
        attachment: 'element',
        pin: true
    }]
};

var ReactTetherMixin = {

    nodes : [],

    /**
     *
     * @param data
     * @param callback function
     * @private
     */
    addTether : function (data, callback) {

        if (!isBrowser) return;

        callback = callback || false;

        if (!callback) {
            debug('No callback passed to tether, it will be rendered without a content');
        }

        assign(options, data);

        if (!options.element || !options.target) {
            debug('Tether need an element and a target');
        } else {
            var newTether = new Tether(options);
            this.nodes.push({
                'element' : options.element,
                'callback': callback,
                'tether'  : newTether
            });
            this._updateNodes();
        }
    },

    componentWillUnmount: function () {
        if (this.nodes.length) {
            this.nodes.forEach(function (node) {
                var element = node.element;
                var parent = node.element.parentNode;

                React.unmountComponentAtNode(element);
                node.tether.destroy();
                parent.removeChild(element);
            });
            this.nodes.length = 0;

            // @todo acho que precisará remover o html do dom ainda
        }

    },

    componentDidUpdate: function () {
        if (this.nodes.length) {
            this._updateNodes();
        }
    },

    _updateNodes : function() {
        this.nodes.forEach(function (node) {
            React.render(node.callback(), node.element, node.tether.position);
        }.bind(this));
    }
};

module.exports = ReactTetherMixin;
