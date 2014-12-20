
var React = require('react'),
    Header = require('../header/header.jsx'),
    Products = require('../products/products.jsx');

var Store =
    React.createClass({
        render: function (){
            return (
                <div>
                    <Header />
                    <div>
                        <div>
                            <h1>Lets Shop</h1>
                            <Products />
                        </div>
                    </div>
                </div>
            );
        }
    });

module.exports = Store;
