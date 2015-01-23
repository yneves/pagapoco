var React = require('react'),
    Checkbox = require('material-ui').Checkbox,
    debug = require('debug')('filters.jsx');

module.exports =
    React.createClass({

        propTypes: {
            suppliers: React.PropTypes.string
        },

        getDefaultProps: function () {
            return {
                suppliers: {}
            };
        },

        render: function (){
            return (
                <div>
                    <h1>Filters</h1>
                    <Checkbox name="somename" value="somename1" />Somename1
                    <Checkbox name="somename" value="somename2" />Somename2
                    <Checkbox name="somename" value="somename3" />Somename3
                </div>
            );
        },

        /**
         * Apenas atualizar os states
         * @private
         */
        _onChange: function() {
            debug('_onChange');
        }
    });
