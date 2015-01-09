
var React = require('react'),
    Texts = require('../texts.js');

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

        render: function () {
            var product = this.props.product;
            return (
                <div className="breadcrumbs">
                    <div>
                        <a>{Texts.home}</a>
                        <span>{'>'}</span>
                    </div>
                    {product.get("taxonomy").map(function(item,index) {
                        var key = item.type + '-' + item.id;
                        return (
                            <div key={key}>
                                <a>{key}</a>
                                <span>{'>'}</span>
                            </div>
                        );
                    })}
                    <div>
                        <a>{product.get('title')}</a>
                    </div>
                </div>
            );
        }
    });
