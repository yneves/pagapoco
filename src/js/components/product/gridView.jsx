
var React = require('react'),
    Texts = require('../texts.js'),
    ProductAction = require('../../actions/ProductActionCreators'),    
    Link = require('../common/link.jsx'),
    WishProduct = require('./wish.jsx'),
    debug = require('debug')('gridView.jsx');

var ProductGrid =
    React.createClass({

        propTypes: {
            product : React.PropTypes.object.isRequired
        },

        getDefaultProps: function () {
            return {
                product : {}
            };
        },

        render: function () {

            var product = this.props.product;
            return (
                <div className="grid-item product-item">

                    <div className="grid-content grid-content-image">
                        <Link name="product" data={{ slug : product.get('slug') }}>
                            <img src={product.get('thumb_large')} />
                        </Link>
                    </div>

                    <div className="grid-content grid-content-detail">
                        <h3 className="productTitle">{product.get('title')}</h3>
                        <div className="prices">
                            <span>{Texts.gridView.from} {Texts.cs}</span>
                            <span className="price">{product.get('best_offer')}</span>
                            <span className="seller">{Texts.gridView.at} {product.get('best_offer_supplier')}</span>
                        </div>
                    </div>

                    <div className="butboxes">
                        <WishProduct product={product} />
                    </div>
                </div>
            );
        }
    });

module.exports = ProductGrid;
