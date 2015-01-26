
var React = require('react'),
    Texts = require('../texts.js'),
    ProductAction = require('../../actions/ProductActionCreators'),
    RaisedButton = require('material-ui').RaisedButton,
    debug = require('debug')('sortBar.jsx');

module.exports =
    React.createClass({

        propTypes: {
            price: React.PropTypes.bool,
            discount: React.PropTypes.bool
        },

        getDefaultProps: function () {
            return {
                price: false,
                discount: false
            };
        },

        render: function () {
            var priceClass,
                discountClass;

            var classSet = React.addons.classSet;

            priceClass = classSet({
                'productSortPrice': true,
                'active': this.props.price
            });

            discountClass = classSet({
                'productSortDiscount': true,
                'active': this.props.discount
            });

            return (
                <div className="sort">
                    <RaisedButton className={priceClass} type="FLAT" label={Texts.sort.price} onClick={this._handleClickSortPrice} />
                    <RaisedButton className={discountClass} type="FLAT" label={Texts.sort.discount} onClick={this._handleClickSortDiscount} />
                </div>
            );
        },

        _handleClickSortPrice: function (event) {
            event.preventDefault();
            ProductAction.sortProducts('price');
        },

        _handleClickSortDiscount: function (event) {
            event.preventDefault();
            ProductAction.sortProducts('discount');
        }
    });
