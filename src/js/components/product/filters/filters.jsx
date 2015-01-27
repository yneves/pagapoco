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

            var checks;
            if (Object.getOwnPropertyNames(this.props.supplier).length) {
                checks = this.props.supplier.map( function (supplier) {
                    debug(supplier);
                    return (
                        <div>
                            <Checkbox
                                    name={supplier.get('name')}
                                    value={supplier.get('slug')}
                                    onClick={this._handleOnChange.bind(this, supplier.get('id'))}
                            />{supplier.get('name')}
                        </div>
                    );
                }.bind(this));
            } else {
                checks = null;
            }

            return (
                <div>
                    <h1>Filters</h1>
                    <form>
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
        _handleOnChange: function(id) {
            debug('_handleOnChange');
            debug(id);
            FilterAction.setFilters(id);
        }
    });
