var React = require('react'),
    Checkbox = require('material-ui').Checkbox,
    FilterAction = require('../../../actions/FilterActionCreator'),
    debug = require('debug')('filters.jsx');

module.exports =
    React.createClass({

        propTypes: {
            current: React.PropTypes.object,
            filters: React.PropTypes.object
        },

        getDefaultProps: function () {
            return {
                current: {},
                filters: {}
            };
        },

        render: function (){

            var checkboxesSupplier,
                checkboxesPackage,
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

            if (Object.getOwnPropertyNames(this.props.filters.supplier).length) {
                checkboxesSupplier = this.props.filters.supplier.map( function (supplier) {
                    if (supplier.get('total_members') > 0 ) {
                        if (currentTerms.supplier.indexOf(supplier.get('id')) !== -1) {
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
                                            onChange={this._handleOnChange.bind(this, 'supplier', supplier.get('id'))}
                                    />
                                </div>
                                <span style={floatLeft}>{supplier.get('name')} - ({supplier.get('total_members')})</span>
                            </div>
                        );
                    }
                }.bind(this));
            } else {
                checkboxesSupplier = null;
            }

            if (Object.getOwnPropertyNames(this.props.filters.package).length) {
                checkboxesPackage = this.props.filters.package.map( function (package) {
                    if (package.get('total_members') > 0 ) {
                        if (currentTerms.package.indexOf(package.get('id')) !== -1) {
                            isChecked = true;
                        } else {
                            isChecked = false;
                        }

                        return (
                            <div style={checkboxWrapperStyle}>
                                <div style={floatLeft}>
                                    <input  type="checkbox"
                                            name={package.get('slug')}
                                            value={package.get('id')}
                                            checked={isChecked}
                                            onChange={this._handleOnChange.bind(this, 'package', package.get('id'))}
                                    />
                                </div>
                                <span style={floatLeft}>{package.get('name')} - ({package.get('total_members')})</span>
                            </div>
                        );
                    }
                }.bind(this));
            } else {
                checkboxesPackage = null;
            }

            return (
                <div>
                    <h1>Filters</h1>
                    <form>
                        <h3>Fabricantes</h3>
                        <div style={boxStyle}>
                            {checkboxesSupplier}
                        </div>
                        <h3>Embalagens</h3>
                        <div style={boxStyle}>
                            {checkboxesPackage}
                        </div>
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
