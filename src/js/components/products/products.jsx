
var React = require('react'),
    ProductStore = require('../../stores/ProductStore'),
    Masonry = require('../common/masonry.jsx'),
    ProductGrid = require('../product/gridView.jsx'),
    ProductSingleView = require("../product/singleView.jsx"),
    ProductSingleDialog = require('../product/singleDialogView.jsx'),
    debug = require('debug')('products.jsx');


module.exports =
    React.createClass({

        getDefaultProps: function () {
            return {
                products        : [],
                currentProduct  : null
            };
        },

        getInitialState: function () {
            return {
                products        : this.props.products || ProductStore.getCatalog(),
                currentProduct  : this.props.currentProduct || ProductStore.getCurrent()
            };
        },

        componentDidMount: function () {
            ProductStore.addChangeListener(this._onChange);
        },

        componentWillUnmount: function () {
            ProductStore.removeChangeListener(this._onChange);
        },

        render: function () {
            var content;

            if (this.state.currentProduct) {
                content = (
                    <ProductSingleView product={this.state.currentProduct} />
                );

            } else {
                var productGrid;
                var masonryOptions = {
                    transitionDuration: 0
                };
                if (this.state.products.length > 0) {
                    productGrid = [];
                    var products = this.state.products.models;
                    var length = products.length;
                    for (var i = 0; i < length; i++) {
                        var product = products[i];
                        productGrid[i] = (
                            <ProductGrid key={i} product={product} />
                        );
                    }
                } else {
                    productGrid = null;
                }

                // @todo quando o state mudar ele tentará limpar este elemento abaixo (React) e como não encontrará uma referência
                // @todo a ele mais, pois o modal chamado futuramente se reposiciona no DOM, ele acusará um erro de INVARIANT
                // @todo temos 3 possíveis soluções neste caso:

                // @todo  1. Pais ficam responsáveis por apenas inserir o elemento no DOM e nada mais (entretanto ainda assim terão uma referência
                // @todo a este elemento, porém ela não será simplesmente mais utilizada (PROVAVELMENTE ERRADO)

                // @todo 2. Todo elemento que se reposiciona no DOM não pode ser chamado por nenhum elemento pai, mas somente
                // @todo ser embedado diretamente na página através do React.render(); (POSSIVEL SOLUÇÃO - parece um pouco mais engessada)

                // @todo 3. Somente statefull elements e que sejam TOP na hierarquia é que podem implementar elementos de
                // @todo reposicionamento de DOM como o Tether Mixin, eles que devem criar tais filhos (POSSÍVEL SOLUÇÃO - parece um pouco mais flexível)

                // var modal = this.state.currentProduct ? <ProductSingleDialog openImmediately={true} product={this.state.currentProduct} /> : '';

                content = (
                    <Masonry options={masonryOptions}>
                        {productGrid}
                    </Masonry>
                );
            }

            return (
                <div className="products">
                    {content}
                </div>
            );

        },

        /**
         * Apenas atualizar os states
         * @private
         */
        _onChange: function() {
            this.setState({
                products        : ProductStore.getCatalog(),
                currentProduct  : ProductStore.getCurrent()
            });
        }
    });
