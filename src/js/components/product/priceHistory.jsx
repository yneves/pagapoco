
var React = require('react'),
    Texts = require('../texts'),
    Chartist = require('chartist');

module.exports =
    React.createClass({

        propTypes: {
            priceHistory: React.PropTypes.object.isRequired,
            chartist: React.PropTypes.object.isRequired
        },

        getDefaultProps: function () {
            return {
                history: {},
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

        componentDidUpdate: function() {
            if (Object.getOwnPropertyNames(this.props.priceHistory).length) {
                var data = this.props.priceHistory.getChartData();
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
        }
    });
