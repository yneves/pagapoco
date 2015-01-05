
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
                                <div flex className="productPrices">
                                    <p className="productPrice">por R$ {product.get('price')}</p>
                                </div>
                            </div>
                            <div layout="horizontal" layout-align="start" >
                                <AddProduct product={product} />
                            </div>
                        </div>

                    </div>
                </div>
            );
        }
    });
