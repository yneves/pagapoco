var React = require('react'),
    Header = require('../header/header.jsx'),
    Products = require('../products/products.jsx'),
    debug = require('debug')('store.jsx');

var Store =
    React.createClass({

        render: function (){
            return (
                <div className="page">
                    <Header />
                    <div className="page-body">
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
