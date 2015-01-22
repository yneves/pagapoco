
var Collection = require('collection'),
    Model = require('model'),
    debug = require('debug')('PlayerList.js'),
    PlayerListModel,
    PlayerListCollectionConstructor,
    PlayerListCollection,
    PlayerList;

PlayerListModel = Model.extend({

    _schema: {
        id: '/PlayerList',
        properties: {
            id: { type: 'string' },        // the productId this history references to
            lists: { type : 'object' }    // should have name: (listname) / members: (products)
        }
    }

});

PlayerListCollectionConstructor = Collection.extend({
    model: PlayerListModel
});

PlayerListCollection = new PlayerListCollectionConstructor();

PlayerList = {
    create : function (data) {
        return PlayerListCollection.add(data);
    },
    collection : PlayerListCollection
};

module.exports = PlayerList;
