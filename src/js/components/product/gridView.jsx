
var React = require('react'),
    ProductAction = require('../../actions/ProductActionCreators'),
    Link = require('../common/link.jsx'),
    AddProduct = require('./add.jsx'),
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
                        <Link name="product" data={{ id : product.get('id') }}>
                            <img src={product.getLargeImage()} />
                        </Link>
                    </div>

                    <div className="grid-content grid-content-detail">
                        <h3 className="productTitle">{product.get('title')}</h3>
                        <div className="prices">
                            <span>A partir de  R$</span> <span className="price">{product.getCheapestOffer()}</span>
                        </div>
                    </div>

                    <div className="butboxes">
                        <WishProduct product={product} />
                        <AddProduct product={product} />
                    </div>
                </div>
            );
        }
    });

module.exports = ProductGrid;
