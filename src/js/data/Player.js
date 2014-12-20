
var request = require('superagent'),
    Helper = require('../utils/Helpers'),
    Collection = require('collection'),
    Model = require('model'),
    debug = require('debug')('Player.js'),
    _player;

_player = {};

var Product = {

    getAllPlayers: function () {

        var data;

        if (_player) {
            // products were already fetched, just return the data
            // @todo maybe do a check to see if there is no new data to return (add a timelife?)
            playerAction.setPlayer(_player);
            return;
        } else {
            playerAction.setPlayer(false);
        }

        request
            .get('resources/players.json') // future firebase api
            .end(function (error, res) {

                var data;

                if (error) {
                    productAction.setAllProducts(new Error(error));
                } else if (!res.body) {
                    productAction.setAllProducts(new Error('No data returned'));
                } else {

                    var _tempPlayer;
                    angular.copy(data.players, _players);
                    _tempPlayer = HelperService.findWhereInArray(_players, {id: _playerId}, true);
                    if (_tempPlayer.length) {
                      _player = _tempPlayer[0];
                    }

                    data = res.body; // simple shortcut

                    /**
                     * This actions are wrappers to update the current store data once we go live the discounts will be already
                     * calculated in the backend and will be sent ready in the $resource.$get().products.json
                     */
                    data.products.forEach(function (value) {

                        value.taxonomy = [];

                        // associate category
                        data.category_product.forEach(function (categoryValue) {
                            if (value.id === categoryValue.product_id) {
                                categoryValue.category_id.forEach(function (categoryId) {
                                    value.taxonomy.push({id: categoryId, type: 'category'});
                                });
                            }
                        });

                        data.tag_product.forEach(function (tagValue) {
                            if (value.id === tagValue.product_id) {
                                tagValue.tag_id.forEach(function (tagId) {
                                    value.taxonomy.push({id: tagId, type: 'tag'});
                                });
                            }
                        });

                        // calculate the initial_discount based on the price
                        value.initial_discount = (1 - value.price / value.original_price);

                        _products.original.push(Product.create(value));

                    });
                    productAction.setAllProducts(_products.original);
                }
            });
    },

    create: function (data) {

        /**
         * Private product data
         */
        var Player;

        /**
         * Creating a new product object, could change to a new if I want a constructor
         * @type {null}
         */
        Player = function Product(data) {

            /**
             * Setters ( Public Exposed )
             * @param id
             */
            setId = function setId(id) {
                if (Helper.isNumber(id)) {
                    _id = id;
                } else {
                    debug('A player must have a valid numeric ID');
                }
            };

            /**
             * Initialize with the data provided
             * Private Actions
             */
            setId(data.id || 0);
        };


        /**
         * public Getters
         */
        Product.prototype = {
            get id() {
                return _id;
            }
        };

        return new Player(data);
    }

};


module.exports = Product;
