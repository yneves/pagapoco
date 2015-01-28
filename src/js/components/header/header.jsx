var React = require('react'),
    Link = require('../common/link.jsx'),
    Search = require("../product/filters/search.jsx"),
    debug = require('debug')('header.jsx');
    LoginBox = require('../profile/profile.jsx');

module.exports =
    React.createClass({
        render : function() {
            return(
                <div id='header'>
                    <div className='row center-xs' id='header-container'>
                        <div className='col-xs-1' id='logoBlock'>
                            <Link name="home">
                                <img id='logoImg' src='../../assets/icons/logo-web.png'/>
                            </Link>
                        </div>
                        <div className='col-xs-9'><Search /></div>
                        <div className='col-xs-2 logoLogin'>
                            <span className='loginBox'><Icon className='loginIcon' icon="action-account-circle" /> Entrar / Registrar</span>
                        </div>
                     </div>

                <div className='colorbar'>
                    <span className='bar1'></span>
                    <span className='bar2'></span>
                    <span className='bar3'></span>
                    <span className='bar4'></span>
                    <span className='bar5'></span>
                </div>
            </div>
            );
        }
    });
