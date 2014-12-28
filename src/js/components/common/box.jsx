
var React = require('react'),
    Tether = require('./mixin/tether'),
    Paper = require('material-ui').Paper,
    debug = require('debug')('modal.jsx'),
    Box;

Box =
    React.createClass({

        // yeah, we are using tether in those boxes
        mixins: [Tether],

        propTypes: {
            onDismiss: React.PropTypes.func
        },

        getDefaultProps: function () {
            return {
                onDismiss: function () {
                    debug('onDismiss is empty');
                }
            };
        },

        componentDidMount: function () {

            this.addTether({
                element : this.refs.box.getDOMNode(),
                target  : document.body
            }, this.tetheredContent);

        },

        componentWillUnmount: function () {
            // do something unmount
        },

        // we don't need anything fancy here, just a reference to pass to tether
        // so it tells react which place it should start a new tree
        render: function() {
            return (
                <div ref="box"></div>
            );
        },

        // the callback that tether will use to tell the new react tree
        // what it should use as it's render() method
        tetheredContent: function () {
            return  (
                <div>
                    <Paper innerClassName="box">
                        {this.props.children}
                    </Paper>
                </div>
            );
        },

        // close the box en esc is pressed!
        _checkEscapeKeyUp: function (e) {
            if (e.keyCode == KeyCode.ESC) {
                this.props.onDismiss();
            }
        }

    });

module.exports = Box;
