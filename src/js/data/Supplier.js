var Collection = require('collection'),
    Model = require('model'),
    lodash = {
        collections: {
            size: require('lodash-node/modern/collections/size')
        }
    },
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
    },

    // For specific get queries or virtual fields like, declare they bellow
    get: function (attr) {
        switch(attr) {
            case 'total_members':
                if (this.attributes.members)  {
                    return lodash.collections.size(this.attributes.members);
                }
                return 0;
            default:
                return Model.prototype.get.apply(this, arguments);
        }
    },

});

SupplierCollectionConstructor = Collection.extend({

    _sortOrder: 'DESC',

    model: SupplierModel,

    comparator: 'total_members'

});

SupplierCollection = new SupplierCollectionConstructor();

Supplier = {
    create : function (data) {
        return SupplierCollection.add(data);
    },
    collection : SupplierCollection
};

module.exports = Supplier;
