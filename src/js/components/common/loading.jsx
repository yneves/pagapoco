
var React = require('react'),
    debug = require('debug')('loading.jsx');

module.exports =
    React.createClass({
        render: function () {
            return (
                <div id="loading">
                    <div id='Wrapper'>
                        <img id='loadImg' src='../../assets/icons/ajax-loader.gif'/>
                        <h2>Carregando...</h2>
                    </div>
                </div>
            );
        }
    });
