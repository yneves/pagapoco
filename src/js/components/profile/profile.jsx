
var React = require('react'),
    Box = require('../common/box.jsx'),
    Block = require('./block.jsx'),
    localStorage = require('../common/mixin/localStorage'),
    classSet = React.addons.classSet,
    profile;

profile =
    React.createClass({

        mixins: [localStorage],

        displayName: 'playerProfile',

        getInitialState: function () {
            return {
                isProfileOpen: false
            };
        },

        render: function () {

            var box,
                classes;

            if (this.state.isProfileOpen) {
                box = <Box><Block handleProfileBox={this._handleProfileBox} /></Box>;
            }

            classes = classSet({
                'playerToggle' : true,
                'active' : this.state.isProfileOpen
            });

            return(
                <div>
                    <div flex="35"  id="playerButtonTop" layout="horizontal" >
                        <div className="material-tile-left">
                        <span className="face"></span>
                            <span id="playerLvl"><span id="lvl">lvl</span>10</span>
                        </div>
                        <div className="material-tile-content">
                            <p id="playerName"> Olá, <span>Duck</span></p>
                            <a className={classes} onClick={this._handleProfileBox} id="playerLink">Ver meu Perfil</a>
                            <a id="playerSair">Sair</a>
                        </div>
                    </div>
                    {box}
                </div>
            );
        },

        _handleProfileBox: function () {
            this.setState({
                isProfileOpen: true
            });
        }

    });

module.exports = profile;
