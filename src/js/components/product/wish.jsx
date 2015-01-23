
var React = require('react'),
    Texts = require('../texts.js'),
    PlayerAction = require('../../actions/PlayerActionCreators'),
    mui = require('material-ui'),
    RaisedButton = mui.RaisedButton,
    debug = require('debug')('wish.jsx');

module.exports =
    React.createClass({

        propTypes : {
            product : React.PropTypes.object.isRequired
        },

        getDefaultProps: function () {
            return {
                product: {}
            };
        },

        render: function () {
            return (
                <div className="wish">
                    <RaisedButton className="productWishLink" type="FLAT" label={Texts.wish} onClick={this._handleClick}>
                        <span className="productWish"></span>
                        <span className="productWishNumber">230</span>
                    </RaisedButton>
                </div>
            );
        },

        _handleClick: function (event) {
            event.preventDefault();
            PlayerAction.addProductToList(this.props.product.get('id'));
        }

    });
