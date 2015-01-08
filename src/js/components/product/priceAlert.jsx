
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
            return {
                price: this.props.product.get('price'),
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
                    <div className="price-slider">
                        <strong>{Texts.cs} {this.state.price}</strong>
                        <input type="range" min="0" max={this.state.price * 2} value={this.state.price} onChange={this.changePrice} />
                    </div>
                    <button type="submit">{Texts.priceAlert.submit}</button>
                </form>
            );
        }
    });
