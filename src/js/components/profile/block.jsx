
var React = require('react'),
    block;

block =
    React.createClass({

        displayName: 'playerProfileBox',

        propTypes: {
            handleProfileBox: React.PropTypes.func.isRequired
        },

        getDefaultProps: function () {
            return {
                handleProfileBox: function () {
                    // should be implemented in the parent class who is calling
                    // this component, by default it will do nothing
                }
            };
        },

        render: function () {
            return(
                <div id="player-block">
                    <a onClick={this.props.handleProfileBox()}>
                        <div id="playerExit">X</div>
                    </a>
                    <ul id="playerItens" className="animated fadeInDown">
                        <a className="playerApp perfilApp"></a>
                        <a className="playerApp pedidosApp"></a>
                        <a className="playerApp enderecosApp"></a>
                        <li className="playerApp ajudaApp">Ajuda</li>
                    </ul>
                    <a id="logoutApp">Deslogar</a>
                </div>
            );
        }
    });

module.exports = block;
