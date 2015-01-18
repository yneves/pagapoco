
var React = require('react'),
    Texts = require('../texts'),
    RouteActionCreator = require('../../actions/RouteActionCreators'),
    ProductAction = require('../../actions/ProductActionCreators');

var Search =
    React.createClass({

        handleKeyUp: function(event) {
            if (event.which === 13) {
                this.submitQuery();
            }
        },
        
        submitQuery: function () {
            var query;
            newQuery = this.refs.input.getDOMNode().value;

            if (this.props.query !== newQuery) {
                if (this._delayTimeout) {
                    clearTimeout(this._delayTimeout);
                }

                this._delayTimeout = setTimeout(function() {
                    this._delayTimeout = undefined;
                    // fire the action to search
                    ProductAction.searchProducts(newQuery);
                    // redirect to the home page
                    RouteActionCreator.setRoute('/');
                }.bind(this),200);
            }
        },

        render: function () {
            return (
                <div className="search">
                    <input
                        type="text"
                        placeholder={Texts.search.placeholder}
                        onKeyUp={this.handleKeyUp}
                        onChange={this.submitQuery}
                        ref="input" />
                    <button type="button" onClick={this.submitQuery}>
                        {Texts.search.submit}
                    </button>
                </div>
            );
        }
    });

module.exports = Search;
