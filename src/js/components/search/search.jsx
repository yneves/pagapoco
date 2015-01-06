
var React = require('react'),
    ProductStore = require('../../stores/ProductStore');

var Search =
    React.createClass({

        getInitialState: function (){
            return { query: '' };
        },

        componentDidUpdate: function (){
            if (this._delayTimeout) {
              clearTimeout(this._delayTimeout);
            }
            this._delayTimeout = setTimeout(function() {
              this._delayTimeout = undefined;
              console.log(this.state.query);
            }.bind(this),200);
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
