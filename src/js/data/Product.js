
var Collection = require('collection'),
    Model = require('model'),
    lodash = {
        collections: {
            forEach: require('lodash-node/modern/collections/forEach')
        }
    },
    Transmuter = require('transmuter'),
    debug = require('debug')('Product.js'),
    ProductModel,
    ProductCollectionConstructor,
    ProductCollection,
    Product;

ProductModel = Model.extend({

    className: 'Product',

    _schema: {
        id: '/Product',
        properties: {
            id: { type: 'string' },                 // the key from firebase
            id_buscape: { type: 'integer' },        // id reference from buscape
            categories: { type: 'object' },         // reference to category table
            offers: { type : 'object' },
            thumb: { type: 'object' },
            title: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string' },
            tipo: { type: 'string' },
            original_link: { type: 'object' },
            rating: { type: 'object' },
            package: { type: 'string' },     // reference to package table
            shape: { type: 'string' },      // reference to the shapes table
            weight: { type: 'string' },     // reference to the weights table
            supplier: { type: 'string' },   // reference to supplier table
            volume: { type: 'string' }     // reference to the volumes table
        }
    },
    // TODO future (code for reference only)
    // _validTypes: {
    //     range : function (instance, schema, options, ctx) {
    //         debug('decimal called');
    //         if(typeof instance!='string') return;
    //         if(typeof schema.contains!='string') throw new jsonschema.SchemaError('"contains" expects a string', schema);
    //         if(instance.indexOf()<0){
    //             return 'does not contain the string '+JSON.stringify(schema.contains);
    //         }
    //     }
    // },

    set: function(attributes, options) {
        // just call the parent method...
        Model.prototype.set.apply(this, arguments);
        // TODO STAGE 3
        // this.setPrice();
    },

    // For specific get queries or virtual fields like, declare they bellow
    get: function (attr) {
        switch(attr) {
            case 'best_offer':
                if (this.attributes.offers && this.attributes.offers.best_offer)  {
                    return Transmuter.toFloat(this.attributes.offers.best_offer.price.value);
                }
                return 0;
            case 'best_offer_supplier':
                if (this.attributes.offers && this.attributes.offers.best_offer)  {
                    return this.attributes.offers.best_offer.seller.sellername;
                }
                return 0;
            case 'worst_offer':
                if (this.attributes.offers && this.attributes.offers.worst_offer)  {
                    return Transmuter.toFloat(this.attributes.offers.worst_offer.price.value);
                }
                return 0;
            case 'discount':
                if (this.attributes.offers && this.attributes.offers.best_discount) {
                    return Transmuter.toFloat(this.attributes.offers.best_discount);
                }
                return 0;
            case 'discount_price':
                if (this.attributes.offers && this.attributes.offers.best_discount_price) {
                    return Transmuter.toFloat(this.attributes.offers.best_discount_price);
                }
                return 0;
            case 'offers_sellers':
                var sellers = [];
                if (this.attributes.offers && this.attributes.offers.offers_by_seller_id) {
                    lodash.collections.forEach(this.attributes.offers.offers_by_seller_id, function (value, key) {
                        var seller = value;
                        seller.id = key;
                        sellers.push(seller);
                    });
                }
                return sellers;
            case 'thumb_large':
                if (this.attributes.thumb && this.attributes.thumb.large) {
                    return this.attributes.thumb.large.url || '';
                }
                // TODO return some default image
                return '';
            // TODO STAGE 3
            // case 'category':
            //     return this.find( attr, { type: 'category' }, false);
            // case 'tag':
            //     return this.find( attr, { type: 'tag' }, false);
            // case 'original_price':
            //     return this.to('toFixed', attr, 2);
            // case 'price':
            //     return this.to('toFixed', attr, 2);
            // case 'initial_discount':
            //     return this.to('toFixed', attr) * 100;
            // case 'current_discount':
            //     return this.to('toFixed', attr) * 100;
            // case 'discount':
            //     return ((this.to('toFixed', 'current_discount', 2) + this.to('toFixed', 'initial_discount', 2)) * 100);
            // case 'total':
            //     return this.to('toFixed', 'quantity') * this.to('toFixed', 'price', 2);
            default:
                return Model.prototype.get.apply(this, arguments);
        }
    },

    /**
    * Set the product price based on the original price, initial_discount and current_discount
    * once this method is finish it will be responsible for calling the setTotal method to define the current
    * amount of this product
    * TODO STAGE 3 IMPLEMENTATION
    */
    // setPrice: function () {
    //     // if there is both currentDiscount and initialDiscount (card applied)
    //     if (this.attributes.current_discount && this.attributes.initial_discount) {
    //         this.attributes.price = this.attributes.original_price - (this.attributes.original_price * (this.attributes.current_discount + this.attributes.initial_discount));
    //     } else if (this.attributes.initial_discount) { // if we have only the initialDiscount (no cards applied)
    //         this.attributes.price = this.attributes.original_price - (this.attributes.original_price * this.attributes.initial_discount);
    //     } else { // if there is no discount to apply to the product just set it to the original value)
    //         this.attributes.price = this.attributes.original_price;
    //     }
    // },
});

ProductCollectionConstructor = Collection.extend({
    model: ProductModel
});

ProductCollection = new ProductCollectionConstructor();

Product = {
    create : function (data) {
        return ProductCollection.add(data);
    },
    collection : ProductCollection
};

module.exports = Product;
