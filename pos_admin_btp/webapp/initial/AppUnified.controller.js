sap.ui.define([
    "com/posadminbtp/initial/BaseController",
],
    function (BaseController) {
        "use strict";

        return BaseController.extend("com.posadminbtp.initial.AppUnified", {
            onInit() {
                this.oOwnerComponent = this.getOwnerComponent();
                this.oRouter = this.oOwnerComponent.getRouter();
                this.oRouter.attachRouteMatched(this.onRouteMatched, this);
                this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
            },
            onRouteMatched(oEvent) {
                var sRouteName = oEvent.getParameter("name"),
                    oArguments = oEvent.getParameter("arguments");

                this._updateUIElements();
                this.userSettingsData();
                // Save the current route name
                this.currentRouteName = sRouteName;
                this.currentProduct = oArguments.product;
            },
            onStateChanged(oEvent) {
                var bIsNavigationArrow = oEvent.getParameter("isNavigationArrow"),
                    sLayout = oEvent.getParameter("layout");

                this._updateUIElements();

                // Replace the URL with the new layout if a navigation arrow was used
                if (bIsNavigationArrow) {
                    this.oRouter.navTo(this.currentRouteName, { layout: sLayout, product: this.currentProduct }, true);
                }
            },
            // Update the close/fullscreen buttons visibility
            _updateUIElements() {
                var oModel = this.oOwnerComponent.getModel(),
                    oUIState;
                this.oOwnerComponent.getHelper().then(function (oHelper) {
                    oUIState = oHelper.getCurrentUIState();
                    oModel.setData(oUIState);
                });
            },
            onPressLogo: function () {
                this.oRouter.navTo("home");
            },
            onExit() {
                this.oRouter.detachRouteMatched(this.onRouteMatched, this);
                this.oRouter.detachBeforeRouteMatched(this.onBeforeRouteMatched, this);
            }
        });
    });
