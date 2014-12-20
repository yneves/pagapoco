
var React = require('react'),
    ProductAction = require('../../actions/ProductActionCreators'),
    RaisedButton = require('material-ui').RaisedButton,
    debug = require('debug')('add.jsx');

module.exports =
    React.createClass({

        propTypes : { // @todo a validation by instanceOf 'product' would be better, but it was buggy
            product : React.PropTypes.object.isRequired
        },

        getDefaultProps : function () {
            return {
                product : {}
            };
        },

        render : function () {

            var active = this.props.product.added ? 'active' : '';

            return (
                <RaisedButton className={active} type="FLAT" label="Adicionar" onClick={this._handleClick}><i class="fa fa-shopping-cart"></i>AEE</RaisedButton>
            );
        },

        _handleClick: function () {
            debug('Adicionando produto de id ' + this.props.product.get('id') + ' ao carrinho');
            ProductAction.addItem(this.props.product.get('id'));
        }
    });
