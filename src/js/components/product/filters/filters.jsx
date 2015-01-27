var React = require('react'),
    Checkbox = require('material-ui').Checkbox,
    FilterAction = require('../../actions/FilterActionCreator'),
    debug = require('debug')('filters.jsx');

module.exports =
    React.createClass({

        propTypes: {
            suppliers: React.PropTypes.array
        },

        getDefaultProps: function () {
            return {
                suppliers: [    // TODO have to transform into object later
                    {
                        id: 1,
                        name: 'Probiótica',
                        slug: 'probiotica'
                    },
                    {
                        id: 2,
                        name: 'Integralmédica',
                        slug: 'integralmedica'
                    }
                ]
            };
        },

        render: function (){

            var checks;

            if (Object.getOwnPropertyNames(this.props.suppliers).length) {
                checks = this.props.suppliers.map( function (supplier) {
                    return (
                        <div>
                            <Checkbox
                                    name={supplier.name}
                                    value={supplier.slug}
                                    onClick={this._handleOnChange.bind(this, supplier.id)}
                            />{supplier.name}
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
