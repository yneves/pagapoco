
var React = require('react'),
    ProductStore = require('../../stores/ProductStore'),
    Masonry = require('../common/masonry.jsx'),
    ProductGrid = require('../product/gridView.jsx'),
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

        componentWillUnmount : function () {
            ProductStore.removeChangeListener(this._onChange);
        },

        render : function () {
            var productGrid,
                masonryOptions;

            if(this.state.products.length) {
                productGrid = this.state.products.models.map(function (product, i) {
                    return (
                        <ProductGrid key={i} product={product} />
                    );
                }, this);
            } else {
                productGrid = null;
            }

            masonryOptions = {
                transitionDuration: 0
            };

            // @todo quando o state mudar ele tentará limpar este elemento abaixo (React) e como não encontrará uma referência
            // @todo a ele mais, pois o modal chamado futuramente se reposiciona no DOM, ele acusará um erro de INVARIANT
            // @todo temos 3 possíveis soluções neste caso:

            // @todo  1. Pais ficam responsáveis por apenas inserir o elemento no DOM e nada mais (entretanto ainda assim terão uma referência
            // @todo a este elemento, porém ela não será simplesmente mais utilizada (PROVAVELMENTE ERRADO)

            // @todo 2. Todo elemento que se reposiciona no DOM não pode ser chamado por nenhum elemento pai, mas somente
            // @todo ser embedado diretamente na página através do React.render(); (POSSIVEL SOLUÇÃO - parece um pouco mais engessada)

            // @todo 3. Somente statefull elements e que sejam TOP na hierarquia é que podem implementar elementos de
            // @todo reposicionamento de DOM como o Tether Mixin, eles que devem criar tais filhos (POSSÍVEL SOLUÇÃO - parece um pouco mais flexível)

            var modal = this.state.currentProduct ? <ProductSingleDialog openImmediately={true} product={this.state.currentProduct} /> : '';

            return (
                <div>
                    <Masonry options={masonryOptions}>
                        {productGrid}
                    </Masonry>
                    {modal}
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
