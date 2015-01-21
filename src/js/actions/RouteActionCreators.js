
var ActionTypes = require('../constants/AppConstants').ActionTypes,
    Dispatcher = require('../dispatcher/AppDispatcher'),
    Validator = require('../utils/Validator'),
    getRoute = require('../utils/Router').getRoute,
    api = require('../api/AppApi'),
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

            // Load data based on current Route type
            if (routeData.link.type === 'products') {
                // let's require the products from the server
                if (Validator.isFunction(api.product.getProducts)) {
                    api.product.getProducts();
                } else {
                    debug('No getProducts valid method found');
                }
            } else if (routeData.link.type === 'product') {
                if (Validator.isFunction(api.product.getCurrentProduct)) {
                    api.product.getCurrentProduct(routeData.link.slug);
                } else {
                    debug('No getCurrentProduct valid method found');
                }
            }
        } else {
            // no route found, alert a routing error
            Dispatcher.handleViewAction({
                type: routeAction.CHANGE_ROUTE_ERROR,
                data: routeData
            });
        }
        
        // let's require the product price history from the server
        if (Validator.isFunction(api.productPriceHistory.getProductPriceHistory)) {
            api.productPriceHistory.getProductPriceHistory();
        } else {
            debug('No getProductPriceHistory valid method found');
        }
    }
};

module.exports = RouteActionCreator;
