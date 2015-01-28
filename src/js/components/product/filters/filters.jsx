var React = require('react'),
    Checkbox = require('material-ui').Checkbox,
    FilterAction = require('../../../actions/FilterActionCreator'),
    debug = require('debug')('filters.jsx');

module.exports =
    React.createClass({

        propTypes: {
            current: React.PropTypes.object,
            supplier: React.PropTypes.object
        },

        getDefaultProps: function () {
            return {
                current: {},
                supplier: {}
            };
        },

        render: function (){

            var checks,
                checkboxWrapperStyle,
                floatLeft,
                currentTerms,
                currentRanges,
                isChecked,
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

            currentTerms = this.props.current.term;
            currentRanges = this.props.current.range;

            if (Object.getOwnPropertyNames(this.props.supplier).length) {
                checks = this.props.supplier.map( function (supplier) {
                    if (supplier.get('total_members') > 0 ) {
                        if (currentTerms.supplier.indexOf(supplier.get('id')) !== -1) {
                            debug('is checked');
                            isChecked = true;
                        } else {
                            isChecked = false;
                        }

                        return (
                            <div style={checkboxWrapperStyle}>
                                <div style={floatLeft}>
                                    <input  type="checkbox"
                                            name={supplier.get('slug')}
                                            value={supplier.get('id')}
                                            checked={isChecked}
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
            debug(id);
            FilterAction.setFilters(type, id);
        }
    });
