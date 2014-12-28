
var React = require('react'),
    ProductAction = require('../../actions/ProductActionCreators'),
    RaisedButton = require('material-ui').RaisedButton,
    debug = require('debug')('wish.jsx'),
    wishButton;

wishButton =

    React.createClass({

        propTypes : { // TODO a validation by instanceOf 'product' would be better, but.. buggy
            product : React.PropTypes.object.isRequired
        },

        getDefaultProps : function() {
            return {
                product : {}
            };
        },

        render : function () {
            return (
                <div>
                    <RaisedButton className="productWishLink" type="FLAT" label="Desejado" onClick={this._handleClick}>
                        <span className="productWish"></span><span className="productWishNumber">230</span>
                    </RaisedButton>
                </div>
            );
        },

        _handleClick : function () {
            ProductAction.toggleWishProduct(this.props.product.id);
        }

    });

module.exports = wishButton;
