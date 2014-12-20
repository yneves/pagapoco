
var React = require('react'),
    routeAction = require('../../actions/RouteActionCreators'),
    createPath = require('../../utils/Router').createPath,
    debug = require('debug')('link.jsx'),
    Link;


Link =

    React.createClass({

        propTypes: {
            name: React.PropTypes.string.isRequired,
            data: React.PropTypes.object
        },

        // TODO acho que este component nem precisa ser stateful ja que o link
        // pode ser gerado diretamente no render method com o metodo interno _getRoute();
        // ate porque State e para algo que o component se atualizará e não faz sentido
        // pensar que o link do componente ficará mudando...
        getInitialState: function () {
            return {
                href: this._getRoute()
            };
        },

        // TODO este component nem deve funcionar se não tiver o atributo name
        // o data até que está ok ser um objeto vazio mas acredito que o name
        // não deve ter opção default
        getDefaultProps: function () {
            return {
                name: null,
                data: {}
            };
        },

        render: function () {

            if (!this.props.name) {
                debug('Link need the props name');
                return null;
            } else if (!this.state.href) {
                debug('No valid link found');
                return null;
            }

            // substituir this.state.href por this._getRoute(); ou ainda por direto
            // createPath(this.props.name, this.props.data);

            return (
                <a href={this.state.href} onClick={this._handleClick}>{this.props.children}</a>
            );
        },

        _handleClick: function (e) {

            event.preventDefault();
            event.stopPropagation();

            // poderia setar também de repente como um state dele, não sei...
            // ou talvez seja melhor o mais puro e deixar state/props para informações
            // abstraidas relacionadas a lógica e não necessariamente ao DOM
            routeAction.setRoute(this.state.href);
        },

        _getRoute: function () {

            var link;

            if (this.props.data) {
                link = createPath(this.props.name, this.props.data);
            } else {
                link = createPath(this.props.name);
            }

            return link;
        },
    });

module.exports = Link;
