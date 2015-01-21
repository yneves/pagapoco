
var React = require('react'),
    Texts = require('../texts.js'),
    debug = require('debug')('storeList.jsx');

module.exports =
    React.createClass({

        propTypes: {
            product: React.PropTypes.object.isRequired
        },

        getDefaultProps: function () {
            return {
                product: {}
            };
        },

        render: function () {
            var list;
            var offersBySeller = this.props.product.get('offers_sellers');
            list = offersBySeller.map( function (sellerData) {
                var link = sellerData.links.length === 0 ? null : (
                    <a href={sellerData.links[0].url} target="_blank">{Texts.storeList.view}</a>
                );
                return (
                    <li key={sellerData.id}>
                        <span className="store-list-seller">{sellerData.seller.sellername}</span>
                        <strong className="store-list-price">{Texts.cs} {sellerData.price.value}</strong>
                        <span className="store-list-parcel"></span>
                        {link}
                    </li>
                );
            });

            return (
                <div className="store-list">
                  <h3>{Texts.storeList.title}</h3>
                  <ul>{list}</ul>
                </div>
            );
        }
    });
