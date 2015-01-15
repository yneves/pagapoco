
var React = require('react'),
    Texts = require('../texts.js'),
    ProductAction = require('../../actions/ProductActionCreators'),
    RaisedButton = require('material-ui').RaisedButton,
    debug = require('debug')('share.jsx');

module.exports =
    React.createClass({

        propTypes : {
            product : React.PropTypes.object.isRequired
        },

        getDefaultProps: function () {
            return {
                product : {}
            };
        },

        clickShare: function () {
            ProductAction.shareProduct(this.props.product.id);
        },

        render: function () {
            return (
                <div className="share">
                    <RaisedButton className="productShareLink" type="FLAT" label={Texts.share} onClick={this.clickShare}>
                        <span className="productShare"></span>
                        <span className="productShareNumber">230</span>
                    </RaisedButton>
                </div>
            );
        },

    });
