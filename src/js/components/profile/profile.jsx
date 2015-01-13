
var React = require('react'),
    Box = require('../common/box.jsx'),
    Block = require('./block.jsx'),
    playerStore = require('../../stores/PlayerStore'),
    playerActions = require('../../actions/PlayerActionCreators'),
    classSet = React.addons.classSet;

module.exports = 
    React.createClass({

        getInitialState: function () {
            return {
                logged: playerStore.getLogin()
            };
        },

        componentWillMount: function (){
            playerActions.initPlayer();
        },

        componentDidMount: function() {
            playerStore.addChangeListener(this._onChange);
        },

        componentWillUnmount: function() {
            playerStore.removeChangeListener(this._onChange);
        },

        handleSubmit: function(event) {
            event.preventDefault();
            var user = this.refs.username.getDOMNode().value;
            var pass = this.refs.password.getDOMNode().value;
            playerActions.logIn(user,pass);            
        },

        handleLogout: function(){
            playerActions.logOut();
        },

        render: function () {
            var content;

            if (this.state.logged) {
                content = (
                    <div>
                        <h5>Logado</h5>
                        <a href="javascript:void(0)" onClick={this.handleLogout}>Deslogar</a>
                    </div>
                );
                
            } else {
                content = (
                    <form id="loginForm" onSubmit={this.handleSubmit}>
                        <input type="text" ref="username" />
                        <input type="password" ref="password" />
                        <button type="submit"></button>
                    </form>
                );
            }
            
            return (
                <div>
                    {display}
                </div>
            );
        },

        _onChange: function() {
            this.setState(
                {logged : playerStore.getLogin()}
            );
        }
    });
