var React = require('react'),
    debug = require('debug')('sidebar.jsx');

module.exports =
    React.createClass({

        render: function (){
            return (
                <div>
                    <h1>Sidebar</h1>
                    {this.props.children}
                </div>
            );
        }
        
    });
