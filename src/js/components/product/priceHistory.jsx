
var React = require('react'),
    Texts = require('../texts'),
    Chartist = require('chartist'),
    ProductPriceHistoryStore = require('../../stores/ProductPriceHistoryStore');

module.exports =
    React.createClass({

        propTypes: {
            product: React.PropTypes.object.isRequired
        },

        getDefaultProps: function () {
            return {
                product: {},
                chartist: {
                    width: '500px',
                    height: '340px',
                    low: 0,
                    chartPadding: 5,
                    showArea: true,
                    axisX: {
                        labelInterpolationFnc: function(date) {
                            return date.split("-").reverse().join("/");
                        },
                    }
                },
            };
        },

        getInitialState: function () {
            return {
                history: null,
            };
        },

        componentDidMount: function () {
            ProductPriceHistoryStore.addChangeListener(this._onChange);
        },

        componentWillUnmount: function () {
            ProductPriceHistoryStore.removeChangeListener(this._onChange);
        },
        
        componentDidUpdate: function() {            
            var productHistory = this.state.history;
            if (productHistory) {
                var data = productHistory.getChartData();
                var options = this.props.chartist;
                var elm = this.refs.chartist.getDOMNode();
                this.chartist = new Chartist.Line(elm, data, options);
            }
        },
        
        render: function () {
            return (
                <div className="price-history">
                    <div className="ct-chart" ref="chartist">
                    </div>
                </div>
            );
        },
        
        _onChange: function () {
            var product = this.props.product;
            var productIdBuscape = product.get('id_buscape');
            this.setState({
                history: ProductPriceHistoryStore.getProduct(productIdBuscape)
            });
        }
    });
