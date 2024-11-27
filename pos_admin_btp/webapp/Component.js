/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "com/posadminbtp/model/models",
    "sap/ui/model/json/JSONModel",
    'sap/f/FlexibleColumnLayoutSemanticHelper',
    'sap/f/library',
    "sap/ui/core/IconPool",
    "com/posadminbtp/local_service/mockserver"
],
    function (UIComponent, Device, models, JSONModel, FlexibleColumnLayoutSemanticHelper, fioriLibrary, IconPool, mockserver) {
        "use strict";

        return UIComponent.extend("com.posadminbtp.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init() {
                var oModel,
                    oRouter;


                // Initialize the mock server
                mockserver.init();

                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                oModel = new JSONModel();
                this.setModel(oModel);

                // enable routing
                oRouter = this.getRouter();
                oRouter.attachBeforeRouteMatched(this._onBeforeRouteMatched, this);
                oRouter.initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                var oSettingsModel = new JSONModel({
                    route: null,
                    filter: null,
                    genericTitle: null,
                    navigatedItem: null
                });
                this.setModel(oSettingsModel, "settings");

                //Icon Register
                this.iconPoolRegister();
            },
            getHelper() {
                return this._getFcl().then(function (oFCL) {
                    var oSettings = {
                        defaultTwoColumnLayoutType: fioriLibrary.LayoutType.TwoColumnsBeginExpanded,
                        defaultThreeColumnLayoutType: fioriLibrary.LayoutType.ThreeColumnsBeginExpanded,
                        initialColumnsCount: 1,
                        maxColumnsCount: 2
                    };
                    return (FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings));
                });
            },
            _onBeforeRouteMatched(oEvent) {
                var oModel = this.getModel(),
                    sLayout = oEvent.getParameters().arguments.layout,
                    oNextUIState;

                this.setModel(new JSONModel([]), "errors"); // Every time route matched the error model will clear 


                // If there is no layout parameter, query for the default level 0 layout (normally OneColumn)
                if (!sLayout) {
                    this.getHelper().then(function (oHelper) {
                        oNextUIState = oHelper.getNextUIState(0);
                        oModel.setProperty("/layout", oNextUIState.layout);
                    });
                    return;
                }

                oModel.setProperty("/layout", sLayout);
                this.setModel(new JSONModel([]), "errors"); //it can set new error model every screen navigation before routing
            },
            _getFcl: async function () {
                return new Promise(function (resolve, reject) {
                    var oFCL = this.getRootControl().getContent().find(content => content.getPages().some(page => page.byId("fcl")))?.getPages().find(page => page.byId("fcl"))?.byId("fcl"); //this.getRootControl().byId('fcl');
                    if (!oFCL) {
                        this.getRootControl().attachAfterInit(function (oEvent) {
                            resolve(oEvent.getSource().byId('fcl'));
                        }, this);
                        return;
                    }
                    resolve(oFCL);

                }.bind(this));
            },

            //Icon Font register
            iconPoolRegister() {
                var b = [];
                var c = {};
                //Fiori Theme font family and URI
                var t = {
                    fontFamily: "SAP-icons-TNT",
                    fontURI: sap.ui.require.toUrl("sap/tnt/themes/base/fonts/")
                };
                //Registering to the icon pool
                IconPool.registerFont(t);
                b.push(IconPool.fontLoaded("SAP-icons-TNT"));
                c["SAP-icons-TNT"] = t;
                //SAP Business Suite Theme font family and URI
                var B = {
                    fontFamily: "BusinessSuiteInAppSymbols",
                    fontURI: sap.ui.require.toUrl("sap/ushell/themes/base/fonts/")
                };
                //Registering to the icon pool
                IconPool.registerFont(B);
                b.push(IconPool.fontLoaded("BusinessSuiteInAppSymbols"));
                c["BusinessSuiteInAppSymbols"] = B;
            },
            getContentDensityClass() {
                return Device.support.touch ? "sapUiSizeCozy" : "sapUiSizeCompact";
            }
        });
    }
);