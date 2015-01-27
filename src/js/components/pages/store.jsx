var React = require('react'),
    ProductAction = require('../../actions/ProductActionCreators'),
    FilterAction = require('../../actions/FilterActionCreator'),
    ProductStore = require('../../stores/ProductStore'),
    FilterStore = require('../../stores/FilterStore'),
    Header = require('../header/header.jsx'),
    Products = require('../product/products.jsx'),
    ProductSingleView = require('../product/singleView.jsx'),
    Filters = require('../product/filters/filters.jsx'),
    Sidebar = require('../sidebar/sidebar.jsx'),
    debug = require('debug')('store.jsx');

module.exports =
    React.createClass({

        propTypes: {
            route: React.PropTypes.object
        },

        getDefaultProps: function () {
            return {
                route: {}
            };
        },

        getInitialState: function () {
            return {
                filters         : FilterStore.getFilters(),
                products        : ProductStore.getCurrentCatalog(),
                currentProduct  : ProductStore.getCurrentProduct(),
                sortingProducts : ProductStore.getSorting()
            };
        },

        componentWillMount: function () {
            ProductStore.addChangeListener(this._onChangeProduct);
            FilterStore.addChangeListener(this._onChangeFilter);
            this._defineData();
        },

        componentWillReceiveProps: function (nextProps) {
            if (this.props.route.link.type !== nextProps.route.link.type) {
                this._defineData(nextProps);
            }
        },

        componentWillUnmount: function () {
            ProductStore.removeChangeListener(this._onChangeProduct);
            FilterStore.removeChangeListener(this._onChangeFilter);
        },

        render: function (){

            var content,
                sidebar,
                sideStyle,
                contentStyle;

            if (this.props.route.link.type === 'product' && Object.getOwnPropertyNames(this.state.currentProduct.product).length) {
                contentStyle = {
                    width: '100%'
                };
                content = (
                    <ProductSingleView product={this.state.currentProduct.product} priceHistory={this.state.currentProduct.priceHistory} />
                );
            } else if ((this.props.route.link.type === 'products' || this.props.route.link.type === 'taxonomy') && Object.getOwnPropertyNames(this.state.products).length) {
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
                        if (this.state.filters && Object.getOwnPropertyNames(this.state.filters.supplier).length) {
                            <Filters supplier={this.state.filters.supplier} />
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

        _defineData: function (nextProps) {
            var props;

            props = nextProps || this.props;

            if (props.route.link.type) {
                switch (props.route.link.type) {
                    case 'products':
                        ProductAction.getProducts();
                        FilterAction.getFilters();
                        break;
                    case 'product':
                        ProductAction.getCurrentProduct(props.route.link.slug);
                        break;
                    case 'taxonomy':
                        FilterAction.getFilters();
                        FilterAction.setFilters(props.route.link.name);
                        break;
                    default:
                        FilterAction.getFilters();
                        ProductAction.getProducts();
                        break;
                }
            }
        },

        /**
         * Apenas atualizar os states
         * @private
         */
        _onChangeProduct: function () {
            this.setState({
                products        : ProductStore.getCurrentCatalog(),
                currentProduct  : ProductStore.getCurrentProduct(),
                sortingProducts : ProductStore.getSorting()
            });
        },

        _onChangeFilter: function () {
            this.setState({
                filters : FilterStore.getFilters(),
            });
        }
    });
