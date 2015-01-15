var React = require('react'),
    Header = require('../header/header.jsx'),
    Products = require('../products/products.jsx');

module.exports = 
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
