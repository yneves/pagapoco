
var React = require('react'),
    Texts = require('../texts.js');

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
            var product = this.props.product;
            var offersBySeller = product.get('offersBySellerId');
            
            var list = Object.keys(offersBySeller).map(function(sellerId) {
                var offer = offersBySeller[sellerId];                
                var link = offer.links.length === 0 ? null : ( 
                    <a href={offer.links[0].url} target="_blank">{Texts.storeList.view}</a> 
                );
                return (
                    <li key={sellerId}> 
                        <span className="store-list-seller">{offer.seller.sellername}</span>
                        <strong className="store-list-price">{Texts.cs} {offer.price.value}</strong>
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
