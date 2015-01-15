
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

        changeQuery: function (event) {
          this.setState({
              query: this.refs.input.getDOMNode().value,
          });
        },

        render: function () {
            return (
                <div className="search">
                    <input
                        type="text"
                        value={this.state.query}
                        placeholder={Texts.search}
                        onChange={this.changeQuery}
                        ref="input" />
                </div>
            );
        }
    });

module.exports = Search;
