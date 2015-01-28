var Collection = require('collection'),
    Model = require('model'),
    lodash = {
        collections: {
            size: require('lodash-node/modern/collections/size')
        }
    },
    debug = require('debug')('Package.js'),
    PackageModel,
    PackageCollectionConstructor,
    PackageCollection,
    Package;

PackageModel = Model.extend({

    className: 'Package',

    _schema: {
        id: '/Package',
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

PackageCollectionConstructor = Collection.extend({

    _sortOrder: 'DESC',

    model: PackageModel,

    comparator: 'total_members'

});

PackageCollection = new PackageCollectionConstructor();

Package = {
    create : function (data) {
        return PackageCollection.add(data);
    },
    collection : PackageCollection
};

module.exports = Package;
