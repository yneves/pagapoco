
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
            var categories = Object.keys(product.get('categories'));
            return (
                <div className="breadcrumbs">
                    <div>
                        <a>{Texts.home}</a>
                        <span>{' > '}</span>
                    </div>
                    {categories.map(function(category) {
                        return (
                            <div key={category}>
                                <a>{Texts.category[category]}</a>
                                <span>{' > '}</span>
                            </div>
                        );
                    })}
                    <div>
                        <a>{product.get('title')}</a>
                    </div>
                </div>
            );
        }
    });
