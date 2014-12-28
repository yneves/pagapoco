/*

    This file works as an agregator of the API files, in the future will
    make it easier to map everything that the site does that requires
    API requests

*/

var productApi = require('./ProductApi'),
    debug = require('debug')('AppApi.js');

module.exports = {
    product: productApi
};
