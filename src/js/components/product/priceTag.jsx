
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

        render: function () {
            var product = this.props.product;
            return (
                <div className="price-tag">
                    <h3>{Texts.priceTag.title}</h3>
                    <p>
                        <strong>{Texts.cs} {product.get('best_offer')}</strong>
                        <span>{Texts.priceTag.to} {Texts.cs} {product.get('worst_offer')}</span>
                    </p>
                    <a href="#">
                        {Texts.priceTag.history}
                    </a>
                </div>
            );
        }
    });
