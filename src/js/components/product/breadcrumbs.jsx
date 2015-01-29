
var React = require('react'),    
    Texts = require('../texts.js'),
    Link = require('../common/link.jsx');

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
                        <Link name="home">
                            {Texts.home}
                        </Link>
                        <span>{' > '}</span>
                    </div>
                    {categories.map(function(category) {
                        return (
                            <div key={category}>
                                <Link name="category" data={{ category: category }}>
                                    {Texts.category[category]}
                                </Link>
                                <span>{' > '}</span>
                            </div>
                        );
                    })}
                    <div>
                        <Link name="product" data={{ slug : product.get('slug') }}>
                            {product.get('title')}
                        </Link>
                    </div>
                </div>
            );
        }
    });
