
var React = require('react'),
    Box = require('../common/box.jsx'),
    Block = require('./block.jsx'),
    playerStore = require('../../stores/PlayerStore'),
    playerActions = require('../../actions/PlayerActionCreators'),
    classSet = React.addons.classSet,
    profile;

profile =
    React.createClass({

        getInitialState: function () {
            return {
                logged:  playerStore.getLogin()
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

        handleSubmit: function(e) {
            e.preventDefault();
            var user = this.refs.username.getDOMNode().value.trim();
            var pass = this.refs.password.getDOMNode().value.trim();
            if (user && pass){
                playerActions.logIn(user,pass);
            }
        },

        handleLogout: function(){
            playerActions.logOut();
        },

        render: function () {


            var display;
            if (this.state.logged){
                display = <div><h5>Logado</h5><a href="javascript:void(0)" onClick={this.handleLogout}>Deslogar</a></div>
            } else {
                display =   <form id="loginForm" onSubmit={this.handleSubmit}>
<input type="text" ref="username" />
                    <br />
                    <input type="password" ref="password" />
                    <br />
                    <input type="submit" />
                </form>;

            }
            return(
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

module.exports = profile;
