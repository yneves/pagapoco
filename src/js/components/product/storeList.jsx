
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
                <ul class="store-list">
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
            );
        }
    });
