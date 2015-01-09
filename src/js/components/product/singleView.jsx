
var React = require('react'),
    Texts = require('../texts.js'),
    Breadcrumbs = require('./breadcrumbs.jsx'),
    PriceAlert = require('./priceAlert.jsx'),
    WishButton = require('./wish.jsx'),
    ShareButton = require('./share.jsx'),
    debug = require('debug')('singleView.jsx');

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

        clickWish: function () {

        },

        clickShare: function () {

        },

        render: function () {
            var product = this.props.product;
            return (
                <div className="product-single-view">

                    <div className="product-header">
                        <div className="product-title">
                            <h1>{product.get('title')}</h1>
                            <h2>
                                <Breadcrumbs product={product} />
                            </h2>
                        </div>
                        <div className="product-price">
                        </div>
                    </div>

                    <div className="product-body">

                        <div className="product-image">
                            <img src={product.get('image')} />
                            <WishButton product={product} />
                            <ShareButton product={product} />
                        </div>

                        <div className="product-description">
                            <p>{product.get('description')}</p>
                            <dl>
                                <dt>{Texts.supplier}</dt>
                                <dd>{product.get('supplier')}</dd>
                                <dt>{Texts.size}</dt>
                                <dd>{'n/a'}</dd>
                            </dl>
                        </div>

                        <div className="product-stores">
                            <h3>{Texts.stores}</h3>
                            <ul>
                                {[].map(function(item) {
                                    return (
                                        <li>
                                            <img src={item.logo}/>
                                            <strong>{item.price}</strong>
                                            <small>{item.payment}</small>
                                            <a href={item.url}>{Texts.view}</a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        <div className="product-history">
                        </div>

                        <div className="product-alert">
                            <PriceAlert product={product} />
                        </div>

                    </div>
                </div>
            );
        }
    });
