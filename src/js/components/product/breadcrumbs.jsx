
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
            var taxonomy = product.get("taxonomy"); 
            return (
                <div className="breadcrumbs">
                    {taxonomy.map(function(item,index) {
                        var separator = (index > 0 && index < taxonomy.length - 1) ? '>' : '';
                        var key = item.type + '-' + item.id;
                        return (
                            <div key={key}>
                                <a>{key}</a>
                                <span>{separator}</span>
                            </div>
                        );
                    })}
                </div>
            );
        }
    });
