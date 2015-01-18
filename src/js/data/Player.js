
var Model = require('model'),
    debug = require('debug')('Product.js'),
    PlayerSimpleModel,
    PlayerFacebookModel,
    Player;

PlayerSimpleModel = Model.extend({
    _schema: {
        id: '/PlayerSimpleModel',
        properties: {
            uid: { type: 'string' },
            auth: { type: 'object' },
            expires: { type: 'integer' },
            password: { type: 'object' },
            provider: { type: 'string' },
            token: { type: 'string' }
        }
    },

    idAttribute: 'uid'
});

PlayerFacebookModel = Model.extend({
    _schema: {
        id: '/PlayerFacebookModel',
        properties: {
            uid: { type: 'string' },
            auth: { type: 'object' },
            expires: { type: 'integer' },
            facebook: { type: 'object' },
            provider: { type: 'string' },
            token: { type: 'string' }
        }
    },

    idAttribute: 'uid'
});


Player = {
    create : function (type, data) {
        if (type === 'facebook') {
            return new PlayerFacebookModel(data);
        } else {
            return new PlayerSimpleModel(data);
        }
    }
};

module.exports = Player;
