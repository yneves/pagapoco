
var React = require('react'),
    ProductStore = require('../../stores/ProductStore'),
    Masonry = require('../common/masonry.jsx'),
    SortBar = require('./sortBar.jsx'),
    ProductGrid = require('../product/gridView.jsx'),
    debug = require('debug')('products.jsx');


module.exports =
    React.createClass({

        propTypes: {
            products: React.PropTypes.object,
            sorting: React.PropTypes.object
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
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <SortBar price={this.props.sorting.price} discount={this.props.sorting.discount} />
                    <Masonry options={masonryOptions}>
                        {productGrid}
                    </Masonry>
                </div>
            );

        }

    });
