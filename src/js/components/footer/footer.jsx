
var React = require('react');


var Footer =
    React.createClass({
        render: function () {
            return (
                <div>
                    <material-toolbar id="mobileBar" hide-md hide-lg block-sm>
                      <div flex="100" layout="horizontal" layout-padding layout-align="center">

                        <div flex layout-order-md="1">
                          <i class="fa fa-trophy"></i>
                        </div>

                        <a flex layout-order-md="2" ng-click="wishlistCtrl.toggleWishlist()" ng-class="{active : wishlistCtrl.isActive()}">

                          <i class="fa fa-heart"></i>
                        </a>

                        <a flex layout-order-md="3" snap-toggle="left" ng-class="{active : deckButtonCtrl.active}">
                          <i class="fa fa-stack-overflow"></i>
                        </a>

                        <a flex layout-order-md="4" snap-toggle="right" ng-class="{active : friendButtonCtrl.active}">
                          <i class="fa fa-users"></i>
                        </a>

                      </div>
                    </material-toolbar>;
                </div>
            );
        }
    });

module.exports = Footer;
