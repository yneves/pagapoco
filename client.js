
// TODO este arquivo pode ser substituido e ir parar inteiro no server side acredito..

var React = require('react'),
    App = require('./src/js/components/app.jsx'),
    debug = require('debug')('client.jsx');

window.React = React; // For chrome dev tool support

React.render(
    <App />,
    document.getElementById('main'), function() {
        debug('React initialized');
    });
