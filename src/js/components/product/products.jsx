
var React = require('react'),
    ProductStore = require('../../stores/ProductStore'),
    Masonry = require('../common/masonry.jsx'),
    SortBar = require('./sortBar.jsx'),
    ProductGrid = require('../product/gridView.jsx'),
    debug = require('debug')('products.jsx');


module.exports =
    React.createClass({

        propTypes: {
            products: React.PropTypes.object.isRequired,
            sorting: React.PropTypes.object
        },

        getDefaultProps: function () {
            return {
                products    : {},
                sorting     : {}
            };
        },

        componentWillUnmount: function () {
            debug('unmounting products.jsx');
        },

        render: function () {
            var productGrid,
                sortBar,
                masonryOptions;

            masonryOptions = {
                transitionDuration: 0
            };
            
            if (this.props.products.map) {
                productGrid = this.props.products.map(function(product) {
                    return (
                        <ProductGrid key={product.get('id')} product={product} />
                    );
                });
            }
            if (this.props.sorting && this.props.sorting.hasOwnProperty('price') && this.props.sorting.hasOwnProperty('discount')) {
                sortBar = (<SortBar price={this.props.sorting.price} discount={this.props.sorting.discount} />);
            } else {
                sortBar = null;
            }

            return (
                <div className="products">
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    {sortBar}
                    <Masonry options={masonryOptions}>
                        {productGrid}
                    </Masonry>
                </div>
            );

        }

    });
