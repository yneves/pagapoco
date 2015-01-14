/*

    This file works as an agregator of the API files, in the future will
    make it easier to map everything that the site does that requires
    API requests

*/

var playerApi = require ('./PlayerApi'),
    productApi = require('./ProductApi'),
    productPriceHistoryApi = require('./ProductPriceHistoryApi'),
    debug = require('debug')('AppApi.js');

module.exports = {
    player: playerApi,
    product: productApi,
    productPriceHistory: productPriceHistoryApi
};
