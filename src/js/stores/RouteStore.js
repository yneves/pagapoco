
var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Store = require('../utils/Store'),
    lodash = {
        objects: {
            assign: require('lodash-node/modern/objects/assign')
        },
        collections: {
            find: require('lodash-node/modern/collections/find')
        }
    },
    debug = require('debug')('RouteStore.js'),
    RouteAction = ActionTypes.Route,
    _route,
    _requestTypes,
    _responseCodes;
    
/**
 * Can work as a route history i guess
 * @type {Array}
 * @private
 */
_route = {};

_requestTpyes = [
    'GET', 'POST', 'PUT', 'PATCH', 'DELETE'
];

// complete list of possible response codes
// Collection (array of objects)
_responseCodes = [
    //Informational 1xx
    { code : 100, message : '100 Continue' },
    { code : 101, message : '101 Switching Protocols' },
    //Successful 2xx
    { code : 200, message : '200 OK' },
    { code : 201, message : '201 Created' },
    { code : 202, message : '202 Accepted' },
    { code : 203, message : '203 Non-Authoritative Information' },
    { code : 204, message : '204 No Content' },
    { code : 205, message : '205 Reset Content' },
    { code : 206, message : '206 Partial Content' },
    //Redirection 3xx
    { code : 300, message : '300 Multiple Choices' },
    { code : 301, message : '301 Moved Permanently' },
    { code : 302, message : '302 Found' },
    { code : 303, message : '303 See Other' },
    { code : 304, message : '304 Not Modified' },
    { code : 305, message : '305 Use Proxy' },
    { code : 306, message : '306 (Unused)' },
    { code : 307, message : '307 Temporary Redirect' },
    //Client Error 4xx
    { code : 400, message : '400 Bad Request' },
    { code : 401, message : '401 Unauthorized' },  // user is not authenticated
    { code : 402, message : '402 Payment Required' },
    { code : 403, message : '403 Forbidden' },     // user is authenticated but cannot perform the action
    { code : 404, message : '404 Not Found' },
    { code : 405, message : '405 Method Not Allowed' },
    { code : 406, message : '406 Not Acceptable' },
    { code : 407, message : '407 Proxy Authentication Required' },
    { code : 408, message : '408 Request Timeout' },
    { code : 409, message : '409 Conflict' },
    { code : 410, message : '410 Gone' },
    { code : 411, message : '411 Length Required' },
    { code : 412, message : '412 Precondition Failed' },
    { code : 413, message : '413 Request Entity Too Large' },
    { code : 414, message : '414 Request-URI Too Long' },
    { code : 415, message : '415 Unsupported Media Type' },
    { code : 416, message : '416 Requested Range Not Satisfiable' },
    { code : 417, message : '417 Expectation Failed' },
    { code : 422, message : '422 Unprocessable Entity' },
    { code : 423, message : '423 Locked' },
    //Server Error 5xx
    { code : 500, message : '500 Internal Server Error' },
    { code : 501, message : '501 Not Implemented' },
    { code : 502, message : '502 Bad Gateway' },
    { code : 503, message : '503 Service Unavailable' },
    { code : 504, message : '504 Gateway Timeout' },
    { code : 505, message : '505 HTTP Version Not Supported' }
];

function updateRoute(code, data) {
    var responseStatus,
        responseMessage,
        regex;

    data = data || null;

    regex = new RegExp('^[1-3]');
    responseStatus = regex.test(code) ? 'success' : 'error';
    responseData = lodash.collections.find(_responseCodes, { code : code });

    _route = {
        status: responseStatus, // based on code
        code: responseData.code, // just the code
        message: responseData.message
    };

    lodash.objects.assign(_route, data);
}

function changeRoute(routeData) {
    updateRoute(100, routeData.link);
}

function changeRouteSuccess(routeData) {
    if (history) {
        // if it's not a popevent, add as a new state
        if (!routeData.stateName) {
            history.pushState(routeData.link.name, '', routeData.link.href);
        } else { // the state were previously added, update it
            history.replaceState(routeData.link.name, '', routeData.link.href);
        }
    }
    updateRoute(200, routeData);
}

function changeRouteError(routeString) {
    updateRoute(404, routeString);
}

/**
 * Set store and define its public API, the component will use it to get data from the store and also to listen to it
 */
RouteStore = Store.extend({

    CHANGE_EVENT: 'change_route',

    getRoute: function () {
        return _route;
    }
});

RouteInstance = new RouteStore(
    RouteAction.CHANGE_ROUTE_START, changeRoute,
    RouteAction.CHANGE_ROUTE_SUCCESS, changeRouteSuccess,
    RouteAction.CHANGE_ROUTE_ERROR, changeRouteError
);

module.exports = RouteInstance;
