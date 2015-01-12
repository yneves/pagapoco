var React = require('react'),
    Header = require('../header/header.jsx'),
    Products = require('../products/products.jsx');

var Store =
    React.createClass({
        render: function (){
            return (
                <div className="page">
                    <Header />
                    <div className="page-body">
                        <div>
                            <Products />
                        </div>
                    </div>
                </div>
            );
        }
    });