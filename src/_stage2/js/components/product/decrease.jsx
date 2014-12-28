
var React = require('react'),
    ProductAction = require('../../actions/ProductActionCreators'),
    debug = require('debug')('decrease.jsx');

var Decrease =
    React.createClass({

        propTypes : {
            id : React.PropTypes.number.isRequired
        },

        getDefaultProps : function () {
            return {
                id : 0
            };
        },

        render: function () {
            return (
                <button onClick={this._handleClick}>-</button>
            );
        },

        _handleClick: function () {
            ProductAction.decreaseItem(this.props.id);
        }

    });

module.exports = Decrease;
