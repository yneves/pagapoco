
var React = require('react'),
    Texts = require('../texts.js'),
    ProductAction = require('../../actions/ProductActionCreators');

var Search =
    React.createClass({

        getInitialState: function () {
            return {
                query: '',
            };
        },

        componentDidUpdate: function () {
            if (this._delayTimeout) {
                clearTimeout(this._delayTimeout);
            }
            this._delayTimeout = setTimeout(function() {
                this._delayTimeout = undefined;
                ProductAction.applyFilter(this.state.query);
            }.bind(this),200);
        },

        onChange: function (event){
          this.setState({
              query: event.target.value,
          });
        },

        render: function () {
            return (
                <div className="search">
                    <input
                        type="text"
                        value={this.state.query}
                        onChange={this.onChange}
                        placeholder={Texts.search}
                    />
                </div>
            );
        }
    });

module.exports = Search;
