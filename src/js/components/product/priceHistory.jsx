
var React = require('react'),
    Texts = require('../texts.js'),
    Chartist = require('chartist');

module.exports =
    React.createClass({

        propTypes: {
            product: React.PropTypes.object.isRequired
        },

        getDefaultProps: function () {
            return {
                product: {}
            };
        },
        
        componentDidUpdate: function() {
          var data = this.chartData();
          var options = {
            width: '300px',
            height: '200px'
          };
          var elm = this.refs.chart.getDOMNode();
          // this.chartist = new Chartist.Line(elm, data, options);
        },
        
        chartData: function() {
            var product = this.props.product;
            // var history = product.get('price_history').y[1];
            var data = {
                labels: [],
                series: [ [], [] ]
            };
            
            [].forEach(function(item,index) {
              data.labels[index] = item.day;
              data.series[0][index] = item.min;
              data.series[1][index] = item.max;
            });
            
            return data;
        },

        render: function () {
            return (
                <div className="price-history">
                    <div className="price-history-chart" ref="chart">
                    </div>
                </div>
            );
        }
    });
