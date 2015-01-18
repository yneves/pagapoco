var React = require('react'),
    ProductStore = require('../../stores/ProductStore'),
    Header = require('../header/header.jsx'),
    Loading = require('../common/loading.jsx'),
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
                loadState       : ProductStore.getLoadingState()
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

            if (this.state.loadState) {
                content = (<Loading />);
            } else if (this.state.currentProduct) {
                content = (<ProductSingleView product={this.state.currentProduct} />);

            } else if (this.state.products.length) {
                content = (<Products products={this.state.products} />);
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
                loadState       : ProductStore.getLoadingState()
            });
        }
    });
