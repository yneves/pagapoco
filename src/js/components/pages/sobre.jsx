
var React = require('react'),
    Header = require('../header/header.jsx'),
    debug = require('debug')('sobre.jsx');

module.exports =
    React.createClass({
        render: function () {
            return (
                <div>
                    <Header />
                    <h1>Sobre Nós</h1>
                    <p>Aqui paragrafo 1</p>
                    <p>Aqui parágrafo 2</p>
                </div>
            );
        }
    });
