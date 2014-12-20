
var React = require('react'),
    isBrowser = (typeof window !== 'undefined'),
    Masonry = isBrowser ? window.Masonry || require('masonry') : null,
    imagesloaded = isBrowser ? require('imagesloaded') : null,
    MasonryComponent;

MasonryComponent =

    React.createClass({

        masonry: false,

        componentDidMount: function () {
            if (this.masonry || !isBrowser) return;

            this.masonry = new Masonry(this.getDOMNode(), this.props.options);
            this.getDOMNode().focus();
            this._imagesLoaded();
        },

        componentDidUpdate: function () {
            if (!isBrowser) return;

            this.masonry.reloadItems();
            this.masonry.layout();
            this._imagesLoaded();
        },

        render: function () {
            return(
                <div>
                    {this.props.children}
                </div>
            );
        },

        _imagesLoaded: function () {
            if (!isBrowser) return;

            imagesloaded(this.getDOMNode(), function(instance) {
                this.masonry.layout();
            }.bind(this));
        }
    });

module.exports = MasonryComponent;
