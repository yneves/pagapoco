
var request = require('superagent'),
    debug = require('debug')('Request.js'),
    API_URL = '',
    TIMEOUT = 3000,
    Requester;

function _makeUrl(url) {
    return API_URL + url;
}

Requester = {
    get: function get(url, query, callback) {
        query = query || {};
        request
            .get(_makeUrl(url))
            .timeout(TIMEOUT)
            .query(query)
            .set('Accept', 'application/json')
            .end( function (err, res) {
                if (err && err.timeout === TIMEOUT) {
                    callback(new Error('Timeout'), res);
                } else if (!res.ok) {
                    callback(new Error('Some server error might have hapenned'), res);
                } else if (!res.body) {
                    callback(new Error('No data returned'), res);
                } else {
                    callback(null, res);
                }
            });
    },

    post: function post(url, data, callback) {
        request
            .post(_makeUrl(url))
            .timeout(TIMEOUT)
            .send(data)
            .set('X-API-Key', 'someapikey')
            .set('Accept', 'application/json')
            .end( function(err, res) {
                if (err && err.timeout === TIMEOUT) {
                    callback(new Error('Timeout'), res);
                } else if (!res.ok) {
                    callback(new Error('Some server error might have hapenned'), res);
                } else if (!res.body) {
                    callback(new Error('No data returned'), res);
                } else {
                    callback(null, res);
                }
            });
    }
};

module.exports = Requester;
