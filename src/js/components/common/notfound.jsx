var React = require('react'),
    NotFound;

NotFound =

    React.createClass({
        render : function() {
            return (
                <div>
                    <h1>Página não encontrada</h1>
                </div>
            );
        }
    });

module.exports = NotFound;
