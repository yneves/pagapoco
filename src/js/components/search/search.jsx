
var React = require('react'),
    ProductStore = require('../../stores/ProductStore');

var Search =
    React.createClass({

        getInitialState: function (){
            return { query: '' };
        },

        // Definir aqui o delay para filtragem da collection.
        shouldComponentUpdate: function (){
            return true;
        },

        componentDidUpdate: function (){

        },

        onChange: function (event){
          this.setState({ query: event.target.value });
        },

        render: function (){
            return (
                <div>
                    <input
                        type="text"
                        value={this.state.query}
                        onChange={this.onChange}
                        placeholder="O que está procurando?"
                    />
                </div>
            );
        }
    });

module.exports = Search;
