
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
            return (
                <div className="product-review">
                    <span>{Texts.productReview.text}</span>
                </div>
            );
        }
    });
