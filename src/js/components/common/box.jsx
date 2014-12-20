
var React = require('react'),
    Tether = require('./mixin/tether'),
    Paper = require('material-ui').Paper,
    debug = require('debug')('modal.jsx'),
    Box;

Box =

    React.createClass({

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

        render: function() {
            return (
                <div ref="box"></div>
            );
        },

        tetheredContent: function () {
            return  (
                <div>
                    <Paper innerClassName="box">
                        {this.props.children}
                    </Paper>
                </div>
            );
        },

        _checkEscapeKeyUp: function (e) {
            if (e.keyCode == KeyCode.ESC) {
                this.props.onDismiss();
            }
        }

    });

module.exports = Box;
