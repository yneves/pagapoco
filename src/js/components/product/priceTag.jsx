
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
                <div class="price-tag">                    
                    <strong>
                        {Texts.cs}
                        {product.get('price')}
                    </strong>
                    <a href="#">
                        {Texts.priceTag.history}
                    </a>
                </div>
            );
        }
    });
