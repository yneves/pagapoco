
var React = require('react'),
    Header = require('../header/header.jsx'),
    Search = require("../search/search.jsx"),
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
                            <Search />
                            <Products />
                        </div>
                    </div>
                </div>
            );
        }
    });

module.exports = Store;
