
var React = require('react'),
    Header = require('../header/header.jsx');

var NotFound =
    React.createClass({
        render: function (){
            return (
                <div>
                    <Header />
                    <div>
                        <div>
                            <h1>Página Não Encontrada</h1>
                        </div>
                    </div>
                </div>
            );
        }
    });

module.exports = NotFound;
