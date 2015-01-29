
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
                var price = sellerData.price.value.toFixed(2).replace(/\./,',');
                var link = sellerData.links.length ? (
                    <a href={sellerData.links[0].url} target="_blank">{Texts.storeList.view}</a>
                ) : null;
                var seller = sellerData.seller.thumbnail && sellerData.seller.thumbnail.url ? (
                    <img src={sellerData.seller.thumbnail.url} />
                ) : sellerData.seller.sellername;
                return (
                    <li key={sellerData.id}>
                        <span className="store-list-seller">{seller}</span>
                        <strong className="store-list-price">{Texts.cs} {price}</strong>
                        <span className="store-list-parcel">{Texts.storeList.parcels.one}</span>
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
