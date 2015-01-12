var React = require('react'),
    Link = require('../common/link.jsx'),
    debug = require('debug')('header.jsx'),
    LoginBox = require('../profile/profile.jsx'),
    Search = require("../search/search.jsx");


module.exports =
    React.createClass({
        render : function() {
            return(
                <div id='header'>
                    <div className='row' id='header-container'>
                        <div className='col-lg-1' id='logoBlock'><img id='logoImg' src='../../assets/icons/logo-web.png'/></div>
                        <div className='col-lg-8'><Search /></div>
                        <div className='col-lg-3'><LoginBox /></div>
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