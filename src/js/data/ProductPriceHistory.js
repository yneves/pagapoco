
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
          series: [ [], [] ]
      };
      var days = this.get('days');
      var keys = Object.keys(days);
      keys.sort();      
      keys.forEach(function(day,index) {
          data.labels[index] = day;
          data.series[0][index] = days[day].min;
          data.series[1][index] = days[day].max;
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
