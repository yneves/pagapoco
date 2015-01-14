
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

        // TODO este component nem deve funcionar se não tiver o atributo name
        // o data até que está ok ser um objeto vazio mas acredito que o name
        // não deve ter opção default
        getDefaultProps: function () {
            return {
                name: null,
                data: {}
            };
        },

        getInitialState: function () {
            return {
                href: this._createLink()
            };
        },

        componentWillReceiveProps: function (nextProps) {
            if (
                this.props.name !== nextProps.name ||
                this.props.data !== nextProps.data
            ) {
                this.setState({
                    href: this._createLink(nextProps)
                });
            }
        },

        render: function () {

            if (!this.state.href) {
                debug('We need a valid href to create a link');
                return null;
            }

            return (
                <a href={this.state.href} onClick={this._handleClick}>{this.props.children}</a>
            );
        },

        _createLink: function (nextProps) {
            var name,
                data;

            if (nextProps) {
                name = nextProps.name;
                data = nextProps.data;
            } else {
                name = this.props.name;
                data = this.props.data;
            }

            return createPath(name, data);
        },

        _handleClick: function (e) {

            event.preventDefault();
            event.stopPropagation();

            // TODO poderia setar também como um state dele, não sei...
            // ou talvez seja melhor o mais puro e deixar state/props para informações
            // abstraidas relacionadas a lógica e não necessariamente ao DOM
            routeAction.setRoute(this.state.href);
        }
    });

module.exports = Link;
