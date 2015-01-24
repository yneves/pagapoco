var React = require('react'),
    ProductStore = require('../../stores/ProductStore'),
    FilterStore = require('../../stores/FilterStore'),
    Header = require('../header/header.jsx'),
    Products = require('../product/products.jsx'),
    ProductSingleView = require('../product/singleView.jsx'),
    Filters = require('../product/filters.jsx'),
    Sidebar = require('../sidebar/sidebar.jsx'),
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
                filters         : FilterStore.getFilters(),
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

            var content,
                sidebar,
                sideStyle,
                contentStyle;

            if (this.props.route === 'product' && Object.getOwnPropertyNames(this.state.currentProduct).length) {
                contentStyle = {
                    width: '100%'
                };
                content = (
                    <ProductSingleView product={this.state.currentProduct} />
                );
            } else if ((this.props.route === 'products' || this.props.route === 'taxonomy') && Object.getOwnPropertyNames(this.state.products).length) {
                contentStyle = {
                    width: '75%',
                    float: 'right'
                };
                sideStyle = {
                    width: '25%',
                    float: 'left'
                };
                content = (
                    <Products style={contentStyle} products={this.state.products} sorting={this.state.sortingProducts} />
                );
                sidebar = (
                    <Sidebar style={sideStyle}>
                        if (this.state.filters && Object.getOwnPropertyNames(this.state.filters).length) {
                            <Filters suppliers={this.state.filters.suppliers} />
                        }
                    </Sidebar>
                );
            } else {
                sidebar = null;
                content = null;
            }

            return (
                <div className="page">
                    <Header />
                    <div className="page-body">
                        <div className="page-sidebar">
                            {sidebar}
                        </div>
                        <div className="page-content">
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
