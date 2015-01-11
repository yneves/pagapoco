
var React = require('react'),
    Texts = require('../texts.js'),
    ProductAction = require('../../actions/ProductActionCreators'),
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
                product: {},
            };
        },

        clickWish: function () {
            ProductAction.toggleWishProduct(this.props.product.id);
        },

        render: function () {
            return (
                <div className="wish">
                    <RaisedButton className="productWishLink" type="FLAT" label={Texts.wish} onClick={this.clickWish}>
                        <span className="productWish"></span>
                        <span className="productWishNumber">230</span>
                    </RaisedButton>
                </div>
            );
        },

    });
