/**
 * Copyright 2014, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
var React = require('react'),
    Store = require('../components/pages/store.jsx'),
    NotFound = require('../components/pages/notfound.jsx'),
    routeAction = require('../actions/RouteActionCreators'),
    routeStore = require('../stores/RouteStore'),
    Application,
    debug = require('debug')('app.jsx');

Application =
    React.createClass({

        propTypes: {
            route: React.PropTypes.object
        },

        getDefaultProps: function () {
           return {
               route: {}
           };
        },

        getInitialState: function () {
           return {
               route: this.props.route || routeStore.getRoute()
           };
        },

        componentWillMount: function () {
            routeStore.addChangeListener(this._onChange);
            routeAction.setRoute(window.location.pathname);
        },

        componentWillUnmount: function () {
            routeStore.removeChangeListener(this._onChange);
        },

        render: function () {

            var componentToLoad;

            // do something like a loading or whatever

            // check if the route as success or error when not loading

            if (this.state.route.status == 'success') {
                switch(this.state.route) {
                    case 'home':
                    case 'product':
                    case 'products':
                        componentToLoad = <Store />;
                        break;
                    case 'cart':
                        componentToLoad = <Order />;
                        break;
                    default:
                        componentToLoad = <Store />;
                        break;
                }
            } else {
                componentToLoad = <NotFound />;
            }

            return (
                <div>
                    {componentToLoad}
                </div>
            );
        },

        _onChange: function () {
            this.setState({
               route: routeStore.getRoute()
            });
        }
});

module.exports = Application;
