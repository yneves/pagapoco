/**
 * Copyright 2014, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
var React = require('react'),
    Store = require('../components/pages/store.jsx'),
    Sobre = require('../components/pages/sobre.jsx'),
    Home = require('../components/pages/home.jsx'),
    Loading = require('../components/common/loading.jsx'),
    Register = require('../components/pages/register.jsx'),
    NotFound = require('../components/pages/notfound.jsx'),
    playerActions = require('../actions/PlayerActionCreators'),
    routeAction = require('../actions/RouteActionCreators'),
    routeStore = require('../stores/RouteStore'),
    Application,
    debug = require('debug')('app.jsx');

var injectTapEventPlugin = require("react-tap-event-plugin");

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

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
            playerActions.initPlayer();
            routeAction.setRoute(window.location.pathname, null);
        },

        componentDidMount: function () {
            if (window && "onpopstate" in window) {
                // window.onpopstate fires an event everytime the active history
                // entry changes between two history entries for the same document
                window.onpopstate = function(event) {
                    routeAction.setRoute(window.location.pathname, event.state);
                };
            }
        },

        componentWillUnmount: function () {
            routeStore.removeChangeListener(this._onChange);
        },

        render: function () {

            var componentToLoad;
            if (this.state.route.status == 'success') {
                switch(this.state.route.link.type) {
                    case 'home':
                    case 'product':
                    case 'products':
                    case 'taxonomy':
                        componentToLoad = <Store route={this.state.route} />;
                        break;
                    case 'register':
                        componentToLoad = <Register route={this.state.route} />;
                        break;
                    case 'main':
                        componentToLoad = <Home />;
                        break;
                    default:
                        componentToLoad = <Store route={this.state.route} />;
                        break;
                }
            } else {
                componentToLoad = <NotFound />;
            }

            return (
                <div id='viewPort'>
                    <Loading />
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