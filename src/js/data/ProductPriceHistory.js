
var Collection = require('collection'),
    Model = require('model'),
    debug = require('debug')('ProductPriceHistory.js'),
    ProductPriceHistoryModel,
    ProductPriceHistoryCollectionConstructor,
    ProductPriceHistoryCollection,
    ProductPriceHistory;

ProductPriceHistoryModel = Model.extend({
  
    _schema: {
        id: '/ProductPriceHistory',
        properties: {
            id: { type: 'string' },        // the productId this history references to
            id_buscape: { type: 'integer' }, // the buscape_id
            days: { type : 'object' }    // array of objects containing { timestamp : { min, max } }
        }
    },
    
    getChartData: function() {
      
        var data = {
            labels: [],
            series: [[]]
        };
      
        function dateKey(time) {
            var date = new Date(parseInt(time));        
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();
            if (day < 10) day = "0" + day;
            if (month < 10) month = "0" + month;
            return year + "-" + month + "-" + day;
        }
      
        var days = this.get('days');
        var keys = Object.keys(days);

        var prices = {};
            keys.forEach(function(day) {
            prices[dateKey(day)] = parseFloat(days[day].min);
        });
      
        var dates = [];
        if (keys.length) {
            var first = Math.max(Math.min.apply(null,keys),1414807200000);
            var last = new Date().getTime();
            while (first <= last) {
                dates.push(dateKey(first));
                first += 24 * 60 * 60 * 1000;
            }
        } 
      
        dates.forEach(function(date,index) {
            var price = prices[date];
            var prev = index - 1;
            while (!price && prev >= 0) {
                console.log("prev");
                price = prices[ dates[prev] ];
                prev--;
            }
            data.labels[index] = date;
            data.series[0][index] = price || 0;
        });

        return data;      
    },
    
});

ProductPriceHistoryCollectionConstructor = Collection.extend({
    model: ProductPriceHistoryModel
});

ProductPriceHistoryCollection = new ProductPriceHistoryCollectionConstructor();

ProductPriceHistory = {
    create : function (data) {
        return ProductPriceHistoryCollection.add(data);
    },
    collection : ProductPriceHistoryCollection
};

module.exports = ProductPriceHistory;
