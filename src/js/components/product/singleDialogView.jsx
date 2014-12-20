
var React = require('react'),
    Dialog = require('material-ui').Dialog,
    ProductSingle = require('../product/singleView.jsx'),
    RouteAction = require('../../actions/RouteActionCreators'),
    debug = require('debug')('singleDialogView.jsx');

var ProductSingleModal =
    React.createClass({

        propTypes: {
            openImmediately: React.PropTypes.bool,
            product: React.PropTypes.object.isRequired
        },

        getDefaultProps: function () {
            return {
                openImmediately: false,
                product: {}
            };
        },

        render: function() {

            var dialogActions = [
                { text: 'Fechar' }
            ];

            return (
                <div>
                    <Dialog {...this.props} onDismiss={this._handleCloseDialog} actions={dialogActions}>
                        <ProductSingle product={this.props.product} />
                    </Dialog>
                </div>
            );
        },

        _handleCloseDialog : function() {
            // voltar a home, futuramente utilizar o history e voltar a página anterior (RouteAction.back() seria bom)
            RouteAction.setRoute('/');
        }
    });

module.exports = ProductSingleModal;
