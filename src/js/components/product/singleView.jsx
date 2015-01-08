
var React = require('react'),
    Texts = require('../texts.js'),
    AddProduct = require('./add.jsx'),
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
            var product = this.props.product,
                taxonomy = product.get('taxonomy');

            var breadcrumb = taxonomy.map(function(item,index) {
                var separator = (index > 0 && index < taxonomy.length - 1) ? '>' : '';
                return (
                    <div>
                        <a>{item.type}-{item.id}</a>
                        <span>{separator}</span>
                    </div>
                );
            });
console.log(product);
            return (
                <div className="product-single-view">

                    <div className="product-header">
                        <div className="product-title">
                            <h1>{product.get('title')}</h1>
                            <h2>{breadcrumb}</h2>
                        </div>
                        <div className="product-price">
                        </div>
                    </div>

                    <div className="product-body">

                        <div className="product-image">
                            <img src={product.get('image')} />
                            <button className="wish" type="button" onClick={this.clickWish}>
                                {Texts.wish}
                            </button>
                            <button className="share" type="button" onClick={this.clickShare}>
                                {Texts.share}
                            </button>
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

                        <div className="product-price-history">
                        </div>

                        <div className="product-alert">
                        </div>

                    </div>
                </div>
            );
        }
    });
