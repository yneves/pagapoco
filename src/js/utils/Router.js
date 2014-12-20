
var pathToRegexp = require('path-to-regexp'), // https://www.npmjs.org/package/path-to-regexp
    reverend = require('reverend'), // https://www.npmjs.org/package/reverend
    debug = require('debug')('Router.js'),
    assign = require('object-assign'),
    _routes;

_routes = [
    {
        name: 'home',
        method: 'GET',
        type: 'product',
        path: '/'
    },
    {
        name: 'products',
        method: 'GET',
        type: 'product',
        path: '/products'
    },
    {
        name: 'product',
        method: 'GET',
        type: 'product',
        path: '/products/:id'
    },
    {
        name: 'fechar',
        method: 'GET',
        type: 'order',
        path: '/fechar'
    }
];

function createPath(pathName, data) {

    var path;

    pathName = pathName.toLowerCase();

    _routes.forEach(function (value) {

        if (value.name === pathName) {
            path = reverend(value.path, data);
        }

    });

    return path;
}

function getRoute(link) {

    var response,
        pathKeys,
        route,
        routeData,
        updatedKey;

    routeData = null;
    pathKeys = [];
    route = '';

    _routes.forEach( function(value) {

        // reset pathKeys array
        pathKeys.length = 0;

        response = pathToRegexp(value.path, pathKeys);
        // keys = [{ name: 'foo', ... }]

        route = response.exec(link);
        //=> ['/123', '123']

        if (route) {
            routeData = { href : link };
            assign(routeData, value);
            pathKeys.forEach( function (value, key) {
                key++;
                routeData[value.name] = route[key];
            });
        }
    });

    return routeData;
}


module.exports = {
    getRoute : getRoute,
    createPath: createPath
};
