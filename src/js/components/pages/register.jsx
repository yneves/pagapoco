
var React = require('react'),
    Header = require('../header/header.jsx'),
    Registro = require('../profile/register.jsx');

module.exports =
    React.createClass({
        render: function () {
            return (
                <div>
                     <Registro />
                </div>
            )
        }
    });