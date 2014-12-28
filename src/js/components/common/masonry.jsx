/*

    This file  is basically masonry for react. Since it
    doesn't change dom positioning (only presentation) we don't really need
    to controlle React trees and stuff's like that, we only need to create
    calls to the Masonry object and let it do it's magic.

*/

var React = require('react'),
    isBrowser = (typeof window !== 'undefined'),    // make sure it is running client-side only
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
