
var React = require('react'),
    Texts = require('../texts.js'),
    Chartist = require('../../vendor/chartist.js');

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
                <div className="price-history">

                </div>
            );
        }
    });
