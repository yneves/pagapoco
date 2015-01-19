
var React = require('react'),
    ProductStore = require('../../stores/ProductStore'),
    Masonry = require('../common/masonry.jsx'),
    ProductGrid = require('../product/gridView.jsx'),
    debug = require('debug')('products.jsx');


module.exports =
    React.createClass({

        propTypes: {
            products: React.PropTypes.object
        },

        getDefaultProps: function () {
            return {
                products    : []
            };
        },

        render: function () {
            var productGrid,
                masonryOptions;

            masonryOptions = {
                transitionDuration: 0
            };

            if (this.props.products.length) {
                productGrid = this.props.products.map(function(product) {
                    return (
                        <ProductGrid key={product.get('id')} product={product} />
                    );
                });
            }

            return (
                <div className="products">
                    <Masonry options={masonryOptions}>
                        {productGrid}
                    </Masonry>
                </div>
            );

        }

    });
