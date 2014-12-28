
var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Dispatcher = require('../dispatcher/AppDispatcher'),
    getRoute = require('../utils/Router').getRoute,
    api = require('../api/AppApi'),
    debug = require('debug')('RouteActionCreators.js'),
    routeAction = ActionTypes.Route,
    RouteActionCreator;

RouteActionCreator = {

    // @todo link can be a link or a named route
    setRoute: function (link) {

        var routeData;

        // the user clicked on a route
        Dispatcher.handleViewAction({
            type : routeAction.CHANGE_ROUTE_START,
            data : link
        });

        // let's look for the route information
        routeData = getRoute(link);

        if (routeData) {

            // first dispatch an event alerting that the route was found
            Dispatcher.handleViewAction({
                type : routeAction.CHANGE_ROUTE_SUCCESS,
                data : routeData
            });

            // now do everything that is needed and route related
            // if the route is looking for products
            if (routeData.type === 'product') {
                // let's require the products from the server
                api.product.getAllProducts();
            }

        } else {
            // no route found, alert the routing error
            Dispatcher.handleViewAction({
                type: routeAction.CHANGE_ROUTE_ERROR,
                data: link
            });
        }
    }
};

module.exports = RouteActionCreator;
