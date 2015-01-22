
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
            token: { type: 'string' },
            list: { type: 'object' }
        }
    },

    idAttribute: 'uid'
});


Player = {
    create : function (type, data) {
        if (type === 'facebook') {
            return new PlayerSimpleModel(data);
        } else {
            return new PlayerSimpleModel(data);
        }
    }
};

module.exports = Player;
