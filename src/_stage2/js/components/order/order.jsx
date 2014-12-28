
var React = require('react'),
    AppStore = require('../../stores/ProductStore'),
    RemoveProduct = require('../product/remove.jsx'),
    IncreaseProductQuantity = require('../product/increase.jsx'),
    DecreaseProductQuantity = require('../product/decrease.jsx');

function cartItems () {
    return {
        items: AppStore.getAdded()
    };
}

var OrderProductWrapper =
    React.createClass({
        render : function() {
            return(
                <tr>
                    <td><RemoveProduct id={this.props.data.id} /></td>
                    <td>{this.props.data.title}</td>
                    <td>{this.props.data.quantity}</td>
                    <td>
                        <IncreaseProductQuantity id={this.props.data.id} />
                        <DecreaseProductQuantity id={this.props.data.id} />
                    </td>
                    <td>R$ {this.props.data.total}</td>
                </tr>
            );
        }
    });

module.exports =
    React.createClass({
        getInitialState:function() {
            return cartItems();
        },
        componentWillMount:function() {
            AppStore.addChangeListener(this._onChange);
        },
        _onChange:function() {
            this.setState(cartItems());
        },
        render:function() {
            var total = 0;
            var items = this.state.items.map(function(item, i){
                total += item.total;
                return (<OrderProductWrapper key={i} data={item} />);
            });
            return (
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Item</th>
                            <th>Qty</th>
                            <th></th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="4" className="text-right">Total da Compra</td>
                            <td>R$ {total}</td>
                        </tr>
                    </tfoot>
                </table>
            );
        }
    });
