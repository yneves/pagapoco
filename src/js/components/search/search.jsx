
var React = require('react'),
    Texts = require('../texts'),
    RouteStore = require('../../stores/RouteStore'),
    RouteActionCreator = require('../../actions/RouteActionCreators')
    ProductAction = require('../../actions/ProductActionCreators');

var Search =
    React.createClass({

        getInitialState: function () {
            return {
                query: '',
            };
        },
        
        componentDidUpdate: function () {
            if (this.state.query !== this._lastQuery) {
                if (this._delayTimeout) {
                    clearTimeout(this._delayTimeout);
                }
                this._delayTimeout = setTimeout(function() {
                    this._delayTimeout = undefined;
                    ProductAction.applyFilter(this.state.query);
                }.bind(this),200);
                this._lastQuery = this.state.query;
            }                
        },
        
        handleKeyUp: function(event) {
            if (event.which === 13) {
                this.submitQuery();
            }
        },
        
        submitQuery: function () {
            RouteActionCreator.setRoute('/');
            var value = this.refs.input.getDOMNode().value;
            this.setState({
                value: value,
                query: value,
            });            
        },

        changeQuery: function () {
            var value = this.refs.input.getDOMNode().value;
            var state = { value: value };
            var route = RouteStore.getRoute();            
            if (route.link.name === 'home') {
                state.query = value;
            }
            this.setState(state);            
        },

        render: function () {
            return (
                <div className="search">
                    <input
                        type="text"
                        value={this.state.value}
                        placeholder={Texts.search.placeholder}
                        onKeyUp={this.handleKeyUp}
                        onChange={this.changeQuery}
                        ref="input" />
                    <button type="button" onClick={this.submitQuery}>
                        {Texts.search.submit}
                    </button>
                </div>
            );
        }
    });

module.exports = Search;
