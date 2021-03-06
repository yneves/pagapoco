
var React = require('react'),
    Texts = require('../Texts.js'),
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
            // TODO acho que é melhor deixar este call no app.jsx
            //playerActions.initPlayer();
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

        handleFbLogin: function(){
            playerActions.faceLogIn();
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
                        <a href="javascript:void(0)" onClick={this.handleLogout}>{Texts.logout}</a>
                    </div>
                );
            } else {
                content = (
                    <div>
                        <a href="javascript:void(0)" onClick={this.handleFbLogin}>{Texts.facebook}</a>
                        <form id="loginForm" onSubmit={this.handleSubmit}>
                            <input type="text" ref="username" placeholder={Texts.username} />
                            <input type="password" ref="password" placeholder={Texts.password} />
                            <button type="submit">{Texts.login}</button>
                        </form>
                    </div>
                );
            }
            return (
                <div>
                    {content}
                </div>
            );
        },

        _onChange: function() {
            this.setState({
              logged: playerStore.getLogin()
            });
        }
    });
