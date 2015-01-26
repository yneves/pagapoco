
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
            var best = product.get('best_offer').toFixed(2).replace(/\./,',');
            var worst = product.get('worst_offer').toFixed(2).replace(/\./,',');
            var total = this.props.product.get('offers_sellers').length;
            return (
                <div className="price-tag">
                    <h3>{Texts.priceTag.title}</h3>
                    <p>
                        <strong>{Texts.cs} {best}</strong>
                        <span>{Texts.priceTag.to} {Texts.cs} {worst} {Texts.priceTag.in} {total} {Texts.priceTag.stores}</span>
                    </p>
                    <a href="#">
                        {Texts.priceTag.history}
                    </a>
                </div>
            );
        }
    });
