
var Collection = require('collection'),
    Model = require('model'),
    lodash = {
        collections: {
            min: require('lodash-node/modern/collections/min')
        }
    },
    Transmuter = require('transmuter'),
    debug = require('debug')('Product.js'),
    ProductModel,
    ProductCollectionConstructor,
    ProductCollection,
    Product;

ProductModel = Model.extend({

    _schema: {
        id: '/Product',
        properties: {
            id: { type: 'string' },                 // the key from firebase
            id_buscape: { type: 'integer' },        // id reference from buscape
            categories: { type: 'object' },         // reference to category table
            offersBySellerId: { type : 'object' },
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

    get: function (attr) {
        switch(attr) {
            case 'category':
                return this.find( attr, { type: 'category' }, false);
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

    // TODO STAGE 3
    // toggleAdd : function () {
    //     if (this.attributes.added) {
    //         this.set('added', 0);
    //     } else {
    //         this.set('added', 1);
    //     }
    // },

    toggleWished: function () {
        if (this.attributes.wished) {
            this.set('wished', 0);
        } else {
            this.set('wished', 1);
        }
    },

    getCheapestOffer: function () {
        if (this.attributes.offersBySellerId) {
            var selectedOffer = lodash.collections.min(this.attributes.offersBySellerId, function (offer) {
                return Transmuter.toFloat(offer.price.value);
            });
            return selectedOffer.price.value;
        } else {
            return 0.00;
        }
    },

    getLargeImage: function () {
        if (this.attributes.thumb && this.attributes.thumb.large) {
            return this.attributes.thumb.large.url;
        } else {
            // TODO return some default large image
        }
    },

    getMediumImage: function () {
        if (this.attributes.thumb && this.attributes.thumb.medium) {
            return this.attributes.thumb.medium.url;
        } else {
            // TODO return some default medium image
        }
    },

    getSmallImage: function () {
        if (this.attributes.thumb && this.attributes.thumb.small) {
            return this.attributes.thumb.small.url;
        } else {
            // TODO return some default small image;
        }
    }

    // update the quantity by adding to the current ammount
    // TODO STAGE 3
    // updateQuantity: function (quantity) {
    //     quantity += this.attributes.quantity;
    //     this.set('quantity', quantity);
    // }

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
