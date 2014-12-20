
var assign = require('object-assign'),
    debug = require('debug')('Product.js'),
    Collection = require('collection'),
    Model = require('modele'),
    ProductModel,
    ProductCollection,
    Product;

ProductModel = Model.extend({

    // TODO estou namorando o https://www.npmjs.com/package/jsonschema para
    // criar uma espécie de validação de schema aqui, ele poderia funcionar
    // em paralelo com os beforeSet, beforeGet e validates
    // talvez seja o caso de criar uma entrada privada chamda _schema e definir
    // as informações relacionadas ao schema nele e deixar os _schema
    // apenas para os extras do beforeSet, beforeGet e Validate
    _schema: {
        id: '/Product',
        properties: {
            id: { type: 'integer', minimum: 1 },
            shop_id: { type: 'integer', minimum: 1 },
            product_batch_id: { type: 'integer', minimum: 1 },
            supplier: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            expiration: {type : 'date' },
            image: { type: 'string' },
            added: { type: 'boolean' },
            wished: { type: 'boolean' },
            original_price: { type: 'number', minimum: 0 },
            price: { type: 'number', minimum: 0 },
            price_history: { type: 'array' },
            initial_discount: { type: 'number', minimum: 0 },
            current_discount: { type: 'number', minimum: 0 },
            quantity: { type: 'integer', minimum: 0 },
            taxonomy: { type: 'array' }
        }
    },

    _validTypes: {
        range : function (instance, schema, options, ctx) {
            debug('decimal called');
            if(typeof instance!='string') return;
            if(typeof schema.contains!='string') throw new jsonschema.SchemaError('"contains" expects a string', schema);
            if(instance.indexOf()<0){
                return 'does not contain the string '+JSON.stringify(schema.contains);
            }
        }
    },

    initialize: function () {
        // debug('Initializing product model');
    },

    set: function(attributes, options) {
        Model.prototype.set.apply(this, arguments);
        this.setPrice();
    },

    get: function (attr) {
        switch(attr) {
            case 'category':
                return this.find( attr, { type: 'category' }, false);
            case 'tag':
                return this.find( attr, { type: 'tag' }, false);
            case 'original_price':
                return this.to('fixed', attr, 2);
            case 'price':
                return this.to('fixed', attr, 2);
            case 'initial_discount':
                return this.to('fixed', attr) * 100;
            case 'current_discount':
                return this.to('fixed', attr) * 100;
            case 'discount':
                return ((this.to('fixed', 'current_discount', 2) + this.to('fixed', 'initial_discount', 2)) * 100);
            case 'total':
                return this.to('fixed', 'quantity') * this.to('fixed', 'price', 2);
            default:
                return Model.prototype.get.apply(this, arguments);
        }
    },

    /**
    * Set the product price based on the original price, initial_discount and current_discount
    * once this method is finish it will be responsible for calling the setTotal method to define the current
    * amount of this product
    */
    setPrice: function () {
        // if there is both currentDiscount and initialDiscount (card applied)
        if (this.attributes.current_discount && this.attributes.initial_discount) {
            this.attributes.price = this.attributes.original_price - (this.attributes.original_price * (this.attributes.current_discount + this.attributes.initial_discount));
        } else if (this.attributes.initial_discount) { // if we have only the initialDiscount (no cards applied)
            this.attributes.price = this.attributes.original_price - (this.attributes.original_price * this.attributes.initial_discount);
        } else { // if there is no discount to apply to the product just set it to the original value)
            this.attributes.price = this.attributes.original_price;
        }
    },

    toggleAdd : function () {
        if (this.attributes.added) {
            this.set('added', 0);
        } else {
            this.set('added', 1);
        }
    },

    toggleWished: function () {
        if (this.attributes.wished) {
            this.set('wished', 0);
        } else {
            this.set('wished', 1);
        }
    },

    // update the quantity by adding to the current ammount
    updateQuantity: function (quantity) {
        quantity += this.attributes.quantity;
        this.set('quantity', quantity);
    }

});

ProductCollection = Collection.extend({
    model: ProductModel
});

collection = new ProductCollection();

Product = {
    create : function (data) {
        collection.add(data);
    },
    collection : collection
};

module.exports = Product;
