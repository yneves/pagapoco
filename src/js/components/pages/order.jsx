
var React = require('react'),
    Header = require('../header/header.jsx'),
    Order = require('../order/order.jsx');

var Order =
    React.createClass({
        render: function (){
            return (
                <div>
                    <Header />
                    <div>
                        <div>
                            <h1>Fechar Compra</h1>
                            <Order />
                        </div>
                    </div>
                </div>
            );
        }
    });

module.exports = Order;
