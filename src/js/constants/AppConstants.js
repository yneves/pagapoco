/**
 * Utiliza o keymirror para facilitar a criação dos objetos, não ter que ficar faznedo key : value repetindo todos os
 * nomes, passamos a key e um valor null e o keyMirror se encarrega de criar os objetos necessários. Isso é bom para facilitar
 * a leitura do código e também evitar problemas por digitação errada por exemplo
 *
 */
var keyMirror = require('keymirror'),
    RouteConstants = require('./RouteConstants'),
    PlayerConstants = require('./PlayerConstants'),
    ProductConstants = require('./ProductConstants');


module.exports = {

    ActionTypes: {
        Route: keyMirror(RouteConstants),
        Player: keyMirror(PlayerConstants),
        Product: keyMirror(ProductConstants)
    },

    PayloadSources: keyMirror({
        SERVER_ACTION: null,
        VIEW_ACTION: null
    })

};
