
var React = require('react'),
    Texts = require('../texts.js'),
    Breadcrumbs = require('./breadcrumbs.jsx'),
    WishButton = require('./wish.jsx'),
    ShareButton = require('./share.jsx'),
    StoreList = require('./storeList.jsx'),
    PriceTag = require('./priceTag.jsx'),
    PriceAlert = require('./priceAlert.jsx'),
    PriceHistory = require('./priceHistory.jsx'),
    ProductReview = require('./productReview.jsx'),
    debug = require('debug')('singleView.jsx');

module.exports =
    React.createClass({

        propTypes: {
            product: React.PropTypes.object.isRequired,
            priceHistory: React.PropTypes.object.isRequired,
        },

        getDefaultProps: function () {
            return {
                product: {},
                priceHistory: {}
            };
        },

        getInitialState: function () {
            return {
                tab: 'history',
            };
        },

        showHistory: function (event) {
            event.preventDefault();
            this.setState({
                tab: 'history',
            });
        },

        showReview: function (event) {
            event.preventDefault();
            this.setState({
                tab: 'review',
            });
        },

        render: function () {
            var product = this.props.product;
            return (
                <div className="product-single-view">

                    <div className="product-header">
                        <div className="product-title">
                            <h1>{product.get('title')}</h1>
                            <h2>
                                <Breadcrumbs product={product} />
                            </h2>
                        </div>
                        <div className="product-price">
                            <PriceTag product={product} />
                        </div>
                    </div>

                    <div className="product-body-one">

                        <div className="product-image">
                            <img src={product.get('thumb_large')} />
                            <WishButton product={product} />
                            <ShareButton product={product} />
                        </div>

                        <div className="product-description">
                            <p>{Texts.lorem}</p>
                            <dl>
                                <dt>{Texts.supplier}</dt>
                                <dd>{product.get('supplier')}</dd>
                                <dt>{Texts.size}</dt>
                                <dd>{'n/a'}</dd>
                            </dl>
                        </div>

                        <div className="product-offers">
                            <StoreList product={product} />
                        </div>
                        
                    </div>
                        
                    <div className="product-body-two">

                        <div className="product-tabset">
                            <div className="product-tab-heading">
                                <a href="#" className={this.state.tab === 'review' ? '' : 'selected'} onClick={this.showHistory}>
                                    {Texts.priceHistory.title}
                                </a>
                                <a href="#" className={this.state.tab === 'review' ? 'selected' : ''} onClick={this.showReview}>
                                    {Texts.productReview.title}
                                </a>
                            </div>
                            <div className="product-tab-content">
                                <div className={ this.state.tab === 'review' ? '' : 'product-tab-active' }>
                                    <PriceHistory priceHistory={this.props.priceHistory} />
                                </div>
                                <div className={ this.state.tab === 'review' ? 'product-tab-active' : '' }>
                                    <ProductReview product={product} />
                                </div>
                            </div>
                        </div>

                        <div className="product-alert">
                            <PriceAlert product={product} />
                        </div>
                        
                    </div>
                    
                </div>
            );
        }
    });
