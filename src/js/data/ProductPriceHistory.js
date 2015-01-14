
var Collection = require('collection'),
    Model = require('model'),
    debug = require('debug')('ProductPriceHistory.js'),
    ProductPriceHistoryModel,
    ProductPriceHistoryCollectionConstructor,
    ProductPriceHistoryCollection,
    ProductPriceHistory;

ProductPriceHistoryModel = Model.extend({
    _schema: {
        id: '/ProductPriceHistory',
        properties: {
            id: { type: 'string' },        // the productId this history references to
            id_buscape: { type: 'integer' }, // the buscape_id
            days: { type : 'object' }    // array of objects containing { timestamp : { min, max } }
        }
    }
});

ProductPriceHistoryCollectionConstructor = Collection.extend({
    model: ProductPriceHistoryModel
});

ProductPriceHistoryCollection = new ProductPriceHistoryCollectionConstructor();

ProductPriceHistory = {
    create : function (data) {
        return ProductPriceHistoryCollection.add(data);
    },
    collection : ProductPriceHistoryCollection
};

module.exports = ProductPriceHistory;
