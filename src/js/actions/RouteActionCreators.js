
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

        Dispatcher.handleViewAction({
            type : routeAction.CHANGE_ROUTE_START,
            data : link
        });

        routeData = getRoute(link);

        if (routeData) {

            Dispatcher.handleViewAction({
                type : routeAction.CHANGE_ROUTE_SUCCESS,
                data : routeData
            });

            if (routeData.type === 'product') {
                api.product.getAllProducts();
            }

        } else {
            Dispatcher.handleViewAction({
                type: routeAction.CHANGE_ROUTE_ERROR,
                data: link
            });
        }
    }
};

module.exports = RouteActionCreator;
