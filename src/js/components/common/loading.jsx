<<<<<<< HEAD
<<<<<<< HEAD

var React = require('react'),
    debug = require('debug')('loading.jsx');

module.exports =
    React.createClass({
        render: function () {
            return (
                <div id="loading">
                    <div id='Wrapper'>
                        <img id='loadImg' src='../../assets/icons/ajax-loader.gif'/>
                        <h2>Carregando...</h2>
                    </div>
                </div>
            );
        }
    });
=======
=======
>>>>>>> origin/master
var React = require('react'),
    LoadStore = require('../../stores/LoadStore'),
    Loading;

Loading =

    React.createClass({

        getInitialState: function () {
            return {
                LoadState  : LoadStore.getLoadingState(),
                LoadMessage: LoadStore.getLoadingMessage()
            };
        },

        componentDidMount: function () {
            LoadStore.addChangeListener(this._onChange);
        },

        componentWillUnmount: function () {
            LoadStore.removeChangeListener(this._onChange);
        },

        render : function() {
            var Visible = this.state.LoadState;
            var LoadMsg = this.state.LoadMessage;
            var Showing;

            if (Visible){
               Showing = <div id="loading">
                           <div id='Wrapper'>
                               <img id='loadImg' src='../../assets/icons/ajax-loader.gif'/>
                               <h2>{LoadMsg}</h2>
                           </div>
                         </div>;
            } else {
                Showing = '';
            }

            return (
                <div>
                 {Showing}
                </div>
            );
        },

        _onChange: function() {
            this.setState({
                LoadState  : LoadStore.getLoadingState(),
                LoadMessage: LoadStore.getLoadingMessage()
            });
        }
    });

module.exports = Loading;
<<<<<<< HEAD
>>>>>>> LoadStore Added.
=======
>>>>>>> origin/master
