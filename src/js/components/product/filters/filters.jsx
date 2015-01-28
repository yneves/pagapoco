var React = require('react'),
    Checkbox = require('material-ui').Checkbox,
    FilterAction = require('../../../actions/FilterActionCreator'),
    debug = require('debug')('filters.jsx');

module.exports =
    React.createClass({

        propTypes: {
            supplier: React.PropTypes.object
        },

        getDefaultProps: function () {
            return {
                supplier: {}
            };
        },

        render: function (){

            var checks,
                checkboxWrapperStyle,
                floatLeft,
                boxStyle;

            checkboxWrapperStyle = {
                width: '100%',
                height: '30px',
                fontSize: '14px'
            };

            floatLeft = {
                float: 'left'
            };

            boxStyle = {
                width: '250px',
                background: 'white',
                border: '1px solid black',
                height: '300px',
                overflow: 'scroll'
            };

            if (Object.getOwnPropertyNames(this.props.supplier).length) {
                checks = this.props.supplier.map( function (supplier) {
                    if (supplier.get('total_members') > 0 ) {
                        return (
                            <div style={checkboxWrapperStyle}>
                                <div style={floatLeft}>
                                    <Checkbox
                                            name={supplier.get('slug')}
                                            value={supplier.get('id')}
                                            onClick={this._handleOnChange.bind(this, 'supplier', supplier.get('id'))}
                                    />
                                </div>
                                <span style={floatLeft}>{supplier.get('name')} - ({supplier.get('total_members')})</span>
                            </div>
                        );
                    }
                }.bind(this));
            } else {
                checks = null;
            }

            return (
                <div>
                    <h1>Filters</h1>
                    <form style={boxStyle}>
                        <h3>Fabricantes</h3>
                        {checks}
                    </form>
                </div>
            );
        },

        /**
         * Apenas atualizar os states
         * @private
         */
        _handleOnChange: function(type, id) {
            debug('_handleOnChange');
            debug(type);
            debug(id);
            FilterAction.setFilters(type, id);
        }
    });
