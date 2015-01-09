
var React = require('react'),
    Texts = require('../texts.js');

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
            var price = this.props.product.get('price');
            return {
                min: 0,
                max: price * 2,
                price: price,
            };
        },

        changePrice: function (event) {
            this.setState({
                price: event.target.value,
            });
        },

        submitAlert: function () {
        },

        render: function () {
            return (
                <form className="product-alert-form" onSubmit={this.submitAlert}>
                    <h3>{Texts.priceAlert.title}</h3>
                    <strong>{Texts.cs} {this.state.price}</strong>
                    <input type="range"
                        min={this.state.min}
                        max={this.state.max}
                        value={this.state.price}
                        onChange={this.changePrice} />
                    <button type="submit">{Texts.priceAlert.submit}</button>
                </form>
            );
        }
    });
