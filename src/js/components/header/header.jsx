
var React = require('react'),
    CartSummary = require('./header-cartsummary.jsx'),
    Link = require('../common/link.jsx'),
    debug = require('debug')('header.jsx');

module.exports =
    React.createClass({
        render : function() {
            return(
                <div className="header">
                    <h1>Header</h1>
                    <ul>
                        <li>
                            <Link name="Home">Início</Link>
                        </li>
                        <li>
                            <Link name="Home">Sobre</Link>
                        </li>
                    </ul>
                    <CartSummary />
                </div>
            );
        }
    });
