
var React = require('react'),
    Header = require('../header/header.jsx'),
    Registro = require('../profile/register.jsx');

module.exports =
    React.createClass({
        propTypes: {
            route: React.PropTypes.string
        },

        getDefaultProps: function () {
            return {
                route: ''
            };
        },

        render: function () {
            return (
                <div>
                     <Registro />
                </div>
            );
        }
    });
