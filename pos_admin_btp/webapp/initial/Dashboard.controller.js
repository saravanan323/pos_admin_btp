sap.ui.define([
    "com/posadminbtp/initial/BaseController",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/library',
    'com/posadminbtp/utils/ErrorMessage',
    'com/posadminbtp/utils/URLConstants',
], function (BaseController, JSONModel, coreLibrary, ErrorMessage, URLConstants) {
    "use strict";

    return BaseController.extend("com.posadminbtp.initial.Dashboard", {
        onInit() {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("home").attachMatched(this._onRouteMatched, this);

        },
        _onRouteMatched(oEvent) {
            let settingsMdl = this.oOwnerComponent.getModel("settings");
            let settingData = settingsMdl.getData();
            settingData.genericTitle = this.getResourceProperty("db_headerTitle");
            settingsMdl.refresh();

            const tileData = this.tilesData();
            this.getView().setModel(new JSONModel(tileData), "dashboard");
        },
        onPressTile(oEvent) {
            const oSource = oEvent.getSource();
            const oSelObject = oSource.getBindingContext('dashboard')?.getObject();
            let sKey = oSelObject.key
            if (sKey) {
                this.oRouter.navTo(sKey, {
                    layout: "OneColumn"
                });
            }
        },
        tilesData() {
            return [
                {
                    header: this.getResourceProperty("db_configuration"),
                    subHeader: this.getResourceProperty("db_httpsandSSL"),
                    icon: "sap-icon://disconnected",
                    value: 12,
                    footer: this.getResourceProperty("db_connection"),
                    withMargin: false,
                    key: "manage_configurations"
                }, {
                    header: this.getResourceProperty("db_manageSystems"),
                    subHeader: "",
                    icon: "sap-icon://it-system",
                    value: 2,
                    footer: this.getResourceProperty("db_systemswithcompanies"),
                    withMargin: false,
                    key: "manage_system"
                }, {
                    header: this.getResourceProperty("db_sychronization"),
                    subHeader: "",
                    icon: "sap-icon://synchronize",
                    value: 12,
                    footer: this.getResourceProperty("db_masterData"),
                    withMargin: false,
                    key: "manage_synchronization"
                }, {
                    header: this.getResourceProperty("db_manageUsers"),
                    subHeader: "",
                    icon: "sap-icon://user-settings",
                    value: 100,
                    footer: this.getResourceProperty("db_manageUsers"),
                    withMargin: false,
                    key: "manage_user"
                }, {
                    header: this.getResourceProperty("db_licenseKeyControl"),
                    subHeader: "",
                    icon: "sap-icon://key",
                    value: 50,
                    footer: this.getResourceProperty("db_connection"),
                    withMargin: false,
                    key: "manage_licence_key_control"
                }, {
                    header: this.getResourceProperty("db_monitor"),
                    subHeader: this.getResourceProperty("db_logs"),
                    icon: "sap-icon://end-user-experience-monitoring",
                    value: 2,
                    footer: this.getResourceProperty("db_managingPerformance"),
                    withMargin: false,
                    key: ""
                }
            ]
        }

    });
});
