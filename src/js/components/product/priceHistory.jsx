
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
                chart: {
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
            var data = this.getChartData();          
            var options = this.props.chart;
            var elm = this.refs.chart.getDOMNode();
            this.chartist = new Chartist.Line(elm, data, options);
        },
        
        getChartData: function() {
            var productHistory = this.state.history;
            if (productHistory) {
                return productHistory.getChartData();
            } else {
                return {
                  labels: [],
                  series: [],
                };
            }
        },
        
        render: function () {
            return (
                <div className="price-history">
                    <div className="ct-chart" ref="chart">
                    </div>
                </div>
            );
        },
        
        _onChange: function () {
            var productId = this.props.product.get('id');
            this.setState({
                history: ProductPriceHistoryStore.getProduct(productId)
            });
        }
    });
