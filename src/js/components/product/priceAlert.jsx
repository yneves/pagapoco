
var React = require('react'),
    Texts = require('../texts.js'),
    ProductAction = require('../../actions/ProductActionCreators');

module.exports =
    React.createClass({

        propTypes: {
            product: React.PropTypes.object.isRequired
        },

        getDefaultProps: function () {
            return {
                product: {}
            };
        },

        getInitialState: function () {
            var price = this.props.product.get('best_offer');
            return {
                min: 0,
                max: price * 2,
                price: price,
            };
        },

        changePrice: function (event) {
            this.setState({
                price: Number(this.refs.input.getDOMNode().value),
            });
        },

        submitAlert: function () {
          var id = this.props.product.get('id');
          var price = this.state.price;
          ProductAction.createAlert(id,price);
        },

        render: function () {
            var price = this.state.price.toFixed(2).replace(/\./,',');
            return (
                <form className="product-alert-form" onSubmit={this.submitAlert}>
                    <h3>{Texts.priceAlert.title}</h3>
                    <p>{Texts.priceAlert.text}</p>
                    <strong>{Texts.cs} {price}</strong>
                    <input type="range"
                        min={this.state.min}
                        max={this.state.max}
                        step="0.10"
                        value={this.state.price}
                        onChange={this.changePrice}
                        ref="input" />
                    <button type="submit">{Texts.priceAlert.submit}</button>
                </form>
            );
        }
    });
