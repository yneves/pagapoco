
var React = require('react'),
    Texts = require('../Texts.js'),
    Box = require('../common/box.jsx'),
    Block = require('./block.jsx'),
    mui = require('material-ui'),
    Input = mui.Input,
    playerStore = require('../../stores/PlayerStore'),
    playerActions = require('../../actions/PlayerActionCreators'),
    classSet = React.addons.classSet;

module.exports =
    React.createClass({

        getInitialState: function () {
            return {

            };
        },

        componentWillMount: function (){
        },

        componentDidMount: function() {
            playerStore.addChangeListener(this._onChange);
        },

        componentWillUnmount: function() {
            playerStore.removeChangeListener(this._onChange);
        },

        handleSubmit: function(event) {
            event.preventDefault();
            var user = this.refs.email.getValue();
            var pass = this.refs.password.getValue();
            var infos = {};
            infos.firstName = this.refs.firstName.getValue();
            infos.lastName = this.refs.lastName.getValue();
            infos.bDay = this.refs.bDay.getValue();
            playerActions.registerUser(user,pass,infos);
        },


        render: function () {
            var content;

                content = (
                    <div>
                        <form id="registerForm" onSubmit={this.handleSubmit}>
                            <Input type="text" name="email" ref="email" placeholder='Email' />
                            <Input type="password" name="password" ref="password" placeholder={Texts.password} />
                            <Input type="password" name="passwordConfirm" ref="passwordConfirm" placeholder={Texts.password} />
                            <Input type="text" name="firstName" ref="firstName" placeholder="Nome" />
                            <Input type="text" name="lastName" ref="lastName" placeholder="Sobrenome" />
                            <Input type="text" name="bDay" ref="bDay" placeholder="Aniversário" />
                            <button type="submit">Registrar</button>
                        </form>
                    </div>
                );


            return (
                <div>
                    {content}
                </div>
            );
        },

        _onChange: function() {
            this.setState({
            });
        }
    });
