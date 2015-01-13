
var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Dispatcher = require('../dispatcher/AppDispatcher'),
    getRoute = require('../utils/Router').getRoute,
    api = require('../api/AppApi').product,
    debug = require('debug')('RouteActionCreators.js'),
    routeAction = ActionTypes.Route,
    RouteActionCreator;

RouteActionCreator = {

    // @todo link can be a link or a named route
    setRoute: function (link, stateName) {

        var linkInfo,
            routeData;

        routeData = {
            link: link,
            stateName: stateName || null
        };

        // the user clicked on a route
        Dispatcher.handleViewAction({
            type : routeAction.CHANGE_ROUTE_START,
            data : routeData
        });

        // let's look for the route information
        routeData.link = getRoute(link);
        if (routeData.link) {
            // first dispatch an event alerting that the route was found
            Dispatcher.handleViewAction({
                type : routeAction.CHANGE_ROUTE_SUCCESS,
                data : routeData
            });

            // now do everything that is needed and route related
            // if the route is looking for products
            if (routeData.link.type === 'product') {
                // let's require the products from the server
                api.getAllProducts();
            }

        } else {
            debug('no Link');
            // no route found, alert the routing error
            Dispatcher.handleViewAction({
                type: routeAction.CHANGE_ROUTE_ERROR,
                data: routeData
            });
        }
    }
};

module.exports = RouteActionCreator;
