/*

    This file is a intengration between react and tether.js. This mixin should
    be used by any component that want's to deal with absolute positioning of
    elements in the current window. It can be used in simple cases like absolute
    positioning to a static placed element or to advanced case of many elements
    relative positioned between then. Some use cases would be:

    - Popup
    - Modal (case dependent)
    - Show/hide boxes

*/

var React = require('react'),
    isBrowser = (typeof window !== 'undefined'),    // tether should run only on client-side
    Tether = isBrowser ? window.Tether || require('../../../../../node_modules/tether/tether') : null,  // TODO fucked up npm reference...
    assign = require('object-assign'), // TODO maybe lodash assign?
    debug = require('debug')('tether.js'),
    options,
    ReactTetherMixin;

/**
 * Default options for TetherJS
 * For a list of available configuration visit # http://github.hubspot.com/tether/
 */
options = {
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

ReactTetherMixin = {
    // nodes are references of tethered objects and their elements and callbacks
    // it was created to keep track of all the added/removed tether elements
    // and should not be used outside of the mixin scope
    nodes : [], // TODO add an underline to show that this attribute should not be messed with

    addTether : function (data, callback) {

        if (!isBrowser) return;

        // the callback work like the render() react method but for the contnet
        // that should go inside the tethered element
        callback = callback || false;

        if (!callback) {
            debug('No callback passed to tether, it will be rendered without a content');
        }

        // assign the default options of tether with the passed ones from the data above
        assign(options, data);

        if (!options.element || !options.target) {
            debug('Tether need an element and a target');
        } else {
            // create a tether and add it's reference to the nodes attribute
            var newTether = new Tether(options);
            this.nodes.push({
                'element' : options.element,
                'callback': callback,
                'tether'  : newTether
            });
            this._updateNodes();
        }
    },

    // when the component will unmount we have to remove all tether references
    // and leftovers from the page
    componentWillUnmount: function () {
        if (this.nodes.length) {
            this.nodes.forEach(function (node) {
                var element = node.element;
                var parent = node.element.parentNode;

                // to keep react working inside the nodes created by tether
                // we have to create a new react tree inside each new node
                // so now we have to unmount those react trees manually
                React.unmountComponentAtNode(element);
                node.tether.destroy();
                parent.removeChild(element);
            });
            this.nodes.length = 0;

            // TODO acho que precisará remover o html do dom ainda
        }

    },

    componentDidUpdate: function () {
        // always rerun the updateNodes if there are nodes and the component was updated
        if (this.nodes.length) {
            this._updateNodes();
        }
    },

    _updateNodes : function() {
        this.nodes.forEach(function (node) {
            /*
                in order to keep react working inside the tethered elements
                we have to manually call it inside those elements.
                This happens because tether.js removes the data from the current
                place at the DOM tree which makes React lose the reference to those elements
                inside the Shadow DOM it uses, so the next time any update occurs react will
                look at the shadow DOM and it will mismatch with the current DOM causing
                an error (react.reference) and static no more auto-updated element.

                When calling react render we are passing the data to be rendered
                (which will be get through the callback), the place it should render
                (the element) and then call the tether.position method as the callback
                once everything is up and running, which will then update the
                position of the newly created react dom tree.

            */
            React.render(node.callback(), node.element, node.tether.position);
        }.bind(this));
    }
};

module.exports = ReactTetherMixin;
