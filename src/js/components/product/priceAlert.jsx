
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
            var price = 0;
            return {
                min: 0,
                max: price * 2,
                price: price,
            };
        },

        changePrice: function (event) {
            this.setState({
                price: this.refs.input.getDOMNode().value,
            });
        },

        submitAlert: function () {
          var id = this.props.product.get('id');
          var price = this.state.price;
          ProductAction.createAlert(id,price);
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
                        onChange={this.changePrice} 
                        ref="input" />
                    <button type="submit">{Texts.priceAlert.submit}</button>
                </form>
            );
        }
    });
