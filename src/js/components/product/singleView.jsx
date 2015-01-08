
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
                        </div>

                        <div className="product-description">
                        </div>

                        <div className="product-offers">
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
