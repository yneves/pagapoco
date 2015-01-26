
var pathToRegexp = require('path-to-regexp'), // https://www.npmjs.org/package/path-to-regexp
    reverend = require('reverend'), // https://www.npmjs.org/package/reverend
    debug = require('debug')('Router.js'),
    assign = require('object-assign'),
    _routes;

_routes = [
    {
        name: 'home',
        method: 'GET',
        type: 'home',
        path: '/home'
    },
    {
        name: 'products',
        method: 'GET',
        type: 'products',
        path: '/produtos'
    },
    {
        name: 'product',
        method: 'GET',
        type: 'product',
        path: '/produtos/:slug'
    },
    {
        name: 'register',
        method: 'GET',
        type: 'register',
        path: '/registrar'
    },
    {
        name: 'taxonomy',
        method: 'GET',
        type: 'taxonomy',
        path: '/categoria/:name'
    }
];

function createPath(pathName, data) {

    var path;

    pathName = pathName.toLowerCase();

    _routes.forEach(function (value) {

        if (value.name === pathName) {
            try {
                path = reverend(value.path, data);
            } catch(err) {
                debug('Error creating link for path: ' + value.path + ' name: ' + pathName);
                debug(err);
            }
        }
    });

    return path;
}

// return an object with the route or null
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
        // pathKeys = [{ name: 'foo', ... }]
        // response should be a string
        if (response) {
            route = response.exec(link);
            //=> ['/123', '123']
        } else {
            debug('No valid pathToRegexp response for: ' + value.path);
            throw new TypeError('Routing problems means Stop');
        }

        // checar o typeof daqui
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
