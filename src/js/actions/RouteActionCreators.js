
var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Dispatcher = require('../dispatcher/AppDispatcher'),
    getRoute = require('../utils/Router').getRoute,
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
        } else {
            // no route found, alert a routing error
            Dispatcher.handleViewAction({
                type: routeAction.CHANGE_ROUTE_ERROR,
                data: routeData
            });
        }
    }
};

module.exports = RouteActionCreator;
