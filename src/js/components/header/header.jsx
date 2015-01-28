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
                    <div className='row' id='header-container'>
                        <div className='col-xs-1' id='logoBlock'>
                            <Link name="home">
                                <img id='logoImg' src='../../assets/icons/logo-web.png'/>
                            </Link>
                        </div>
                        <div className='col-xs-8'><Search /></div>
                        <div className='col-xs-3'><LoginBox /></div>
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
