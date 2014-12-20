
var React = require('react'),
    ProductActions = require('../../actions/ProductActionCreators'),
    debug = require('debug')('remove.jsx');

var Remove =
    React.createClass({

        propTypes: {
            id : React.PropTypes.number.isRequired
        },

        getDefaultProps: function () {
            return {
                id : 0
            };
        },

        render: function (){
            return (
                <button onClick={this._handleClick}> x </button>
            );
        },

        _handleClick: function () {
            ProductActions.removeItem(this.props.id);
        }

    });

module.exports = Remove;