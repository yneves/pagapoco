var Collection = require('collection'),
    Model = require('model'),
    debug = require('debug')('Supplier.js'),
    SupplierModel,
    SupplierCollectionConstructor,
    SupplierCollection,
    Supplier;

SupplierModel = Model.extend({

    _schema: {
        id: '/Supplier',
        properties: {
            id: { type: 'string' },        // the productId this history references to
            id_buscape: { type: 'integer' },
            name: { type: 'string' },
            slug: { type: 'string' },
            members: { type: 'object' }
        }
    }

});

SupplierCollectionConstructor = Collection.extend({
    model: SupplierModel
});

SupplierCollection = new SupplierCollectionConstructor();

Supplier = {
    create : function (data) {
        return SupplierCollection.add(data);
    },
    collection : SupplierCollection
};

module.exports = Supplier;
