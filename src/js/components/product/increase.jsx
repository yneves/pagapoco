
var React = require('react'),
    ProductAction = require('../../actions/ProductActionCreators'),
    debug = require('debug')('increase.jsx');

var Increase =
    React.createClass({

        propTypes: {
            id : React.PropTypes.number.isRequired
        },

        getDefaultProps: function () {
            return {
                id : 0
            };
        },

        render: function () {
            return (
                <button onClick={this._handleClick}>+</button>
            );
        },

        _handleClick: function(){
            ProductAction.increaseItem(this.props.id);
        }

    });

module.exports = Increase;