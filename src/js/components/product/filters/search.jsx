
var React = require('react'),
    Texts = require('../../texts'),
    RouteAction = require('../../../actions/RouteActionCreators'),
    FilterAction = require('../../../actions/FilterActionCreator');

module.exports =
    React.createClass({

        componentWillMount: function () {
          this._delayTimeout = null;
        },

        handleKeyUp: function(event) {
            if (event.which === 13) {
                this.submitQuery();
            }
        },

        submitQuery: function () {
            var query;
            newQuery = this.refs.input.getDOMNode().value;

            if (this._delayTimeout) {
                clearTimeout(this._delayTimeout);
            }

            this._delayTimeout = setTimeout(function() {
                this._delayTimeout = undefined;
                // fire the action to search
                FilterAction.setSearch(newQuery);
                // redirect to the home page
                RouteAction.setRoute('/');
            }.bind(this),300);
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
