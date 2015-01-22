
var Model = require('model'),
    debug = require('debug')('Player.js'),
    PlayerBaseModel,
    PlayerSimpleModel,
    PlayerFacebookModel,
    PlayerInstance,
    Player;

PlayerBaseModel = Model.extend({

    addProductToList: function (productId) {
        debug('add product to list');
        debug(productId);
    },

    removeProductFromlist: function (productId) {
        debug('remove product from list');
        debug(productId);
    }
});

PlayerSimpleModel = PlayerBaseModel.extend({
    _schema: {
        id: '/PlayerSimpleModel',
        properties: {
            uid: { type: 'string' },
            auth: { type: 'object' },
            expires: { type: 'integer' },
            password: { type: 'object' },
            provider: { type: 'string' },
            token: { type: 'string' },
            list: { type: 'object' }
        }
    },

    idAttribute: 'uid',

    // For specific get queries or virtual fields like, declare they bellow
    get: function (attr) {
        switch(attr) {
            case 'avatar':
                // TODO load some default avatar image
                return '';
            case 'name':
                // TODO return empty i guess
                return '';
            case 'email':
                return this.attributes.password.email || '';
            default:
                return Model.prototype.get.apply(this, arguments);
        }
    }
});

PlayerFacebookModel = PlayerBaseModel.extend({
    _schema: {
        id: '/PlayerFacebookModel',
        properties: {
            uid: { type: 'string' },
            auth: { type: 'object' },
            expires: { type: 'integer' },
            facebook: { type: 'object' },
            provider: { type: 'string' },
            token: { type: 'string' },
            list: { type: 'object' }
        }
    },

    idAttribute: 'uid',

    // For specific get queries or virtual fields like, declare they bellow
    get: function (attr) {
        switch(attr) {
            case 'avatar':
                return this.attributes.facebook.cachedUserProfile.picture.data.url || '';
            case 'name':
                return this.attributes.facebook.cachedUserProfile.first_name || '';
            case 'email':
                return this.attributes.facebook.cachedUserProfile.email || '';
            default:
                return Model.prototype.get.apply(this, arguments);
        }
    }
});

Player = {
    create : function (data) {
        if (data.facebook) {
            PlayerInstance = new PlayerFacebookModel(data);
        } else {
            PlayerInstance = new PlayerSimpleModel(data);
        }
        return PlayerInstance;
    },
    instance: PlayerInstance
};

module.exports = Player;
