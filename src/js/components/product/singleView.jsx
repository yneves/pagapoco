
var React = require('react'),
    AddProduct = require('./add.jsx'),
    debug = require('debug')('singleView.jsx');

module.exports =
    React.createClass({

        propTypes: {
            product: React.PropTypes.object.isRequired
        },

        getDefaultProps : function () {
            return {
                product : {}
            };
        },

        render : function () {

            var product = this.props.product;

            return (

                <div>
                    <h1 className="productName">{product.get('title')}</h1>
                    <div layout="horizontal" layout-padding >

                        <div flex="33" layout="vertical" >
                            <img className="productImg" src={product.get('image')} />
                            <span flex id="productInfo"><span id="productInfoIcon"></span><p id="productInfoText">Mais informações</p></span>
                            <span className="productTags">tags</span>
                        </div>

                        <div flex="67">
                            <div layout="horizontal" layout-align="start" >
                                <p flex className="productDesconto">{product.get('discount')}%</p>
                                <div flex className="productPrices">
                                    <p className="productOldPrice">de R$ {product.get('original_price')} por</p>
                                    <p className="productPrice">R$ {product.get('price')}</p>
                                </div>
                            </div>
                            <div layout="horizontal" layout-align="start" >
                                <div flex className="productQty">
                                    <span cart-item-quantity className="productQtyNumber">{product.get('quantity')}</span>
                                </div>
                                <AddProduct product={product} />
                            </div>
                        </div>

                    </div>
                </div>
            );
        }
    });
