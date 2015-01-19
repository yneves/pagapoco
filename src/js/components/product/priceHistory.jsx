
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
                  width: '300px',
                  height: '200px'
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
        
        formatDate: function(time) {
            var date = new Date(time * 1000);
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();
            if (day < 10) day = "0" + day;
            if (month < 10) month = "0" + month;            
            return day + "/" + month + "/" + year;
        },

        render: function () {
            return (
                <div className="price-history">
                    <div className="price-history-chart" ref="chart">
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
