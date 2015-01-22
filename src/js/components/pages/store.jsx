var React = require('react'),
    ProductStore = require('../../stores/ProductStore'),
    Header = require('../header/header.jsx'),
    Products = require('../product/products.jsx'),
    ProductSingleView = require('../product/singleView.jsx'),
    debug = require('debug')('store.jsx');

module.exports =
    React.createClass({

        propTypes: {
            route: React.PropTypes.string
        },

        getDefaultProps: function () {
            return {
                route: ''
            };
        },

        getInitialState: function () {
            return {
                products        : ProductStore.getCurrentCatalog(),
                currentProduct  : ProductStore.getCurrent(),
                sortingProducts : ProductStore.getSorting()
            };
        },

        componentDidMount: function () {
            ProductStore.addChangeListener(this._onChange);
        },

        componentWillUnmount: function () {
            ProductStore.removeChangeListener(this._onChange);
        },

        render: function (){

            var content;
            if (this.props.route === 'product' && this.state.currentProduct) {
                content = (<ProductSingleView product={this.state.currentProduct} />);
            } else if (this.props.route === 'products' && this.state.products) {
                content = (<Products products={this.state.products} sorting={this.state.sortingProducts} />);
            } else {
                content = null;
            }

            return (
                <div className="page">
                    <Header />
                    <div className="page-body">
                        <div>
                            {content}
                        </div>
                    </div>
                </div>
            );
        },

        /**
         * Apenas atualizar os states
         * @private
         */
        _onChange: function() {
            this.setState({
                products        : ProductStore.getCurrentCatalog(),
                currentProduct  : ProductStore.getCurrent(),
                sortingProducts : ProductStore.getSorting()
            });
        }
    });
