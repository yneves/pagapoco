
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

                    <div className="grid-content">
                        <Link name="product" data={{ id : product.get('id') }}>
                            <img src={product.get('image')} />
                        </Link>
                    </div>

                    <div className="grid-content">
                        <h3 className="productTitle">{product.get('title')}</h3>
                        <p className="percentualDesconto">{product.get('discount')} %</p>
                        <div className="prices">
                            <p className="oldPrice">de R$ {product.get('original_price')}</p>
                            <p className="price">por R$ {product.get('price')}</p>
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
