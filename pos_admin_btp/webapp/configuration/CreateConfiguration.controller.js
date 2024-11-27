sap.ui.define([
    "com/posadminbtp/initial/BaseController",
    "sap/ui/model/json/JSONModel",
    "com/posadminbtp/utils/URLConstants",
    'com/posadminbtp/utils/ErrorMessage',
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (
    BaseController, JSONModel, URLConstants, ErrorMessage, MessageBox, MessageToast
) {
    "use strict";

    return BaseController.extend("com.posadminbtp.configuration.CreateConfiguration", {

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("manage_configurations").attachPatternMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("create_configuration").attachPatternMatched(this._onRouteMatched, this);

            let oSource = ((sId) => this.getView().byId(sId));
            [this.formId, this.pageId, this.popoverBtn] = [oSource('sfConfigGen'), oSource('oplCreateConfig'), oSource('errorBtnCrtConfig')]
        },
        _onRouteMatched: function (oEvent) {
            this._product = oEvent.getParameter("arguments").id || 0;

            let settingsMdl = this.oOwnerComponent.getModel("settings");
            let settingData = settingsMdl.getData();
            settingData.genericTitle = "Configurations";
            settingsMdl.refresh();

            var setDataModel = {
                Status: [
                    { key: "1", text: "Draft" },
                    { key: "2", text: "Active" },
                    { key: "3", text: "Inactive" }
                ],
                systemType: [
                    { key: "1", text: "Test" },
                    { key: "2", text: "Production" }
                ],
                type: [
                    { key: "1", text: "SAP S4/HANA Cloud" },
                    { key: "2", text: "SAP S4/HANA On-premise" },
                    { key: "3", text: "SAP Business ByDesign" },
                    { key: "4", text: "SAP Business One" }
                ]
            };

            this.getView().setModel(new JSONModel(setDataModel), "masterdataMdl");

            this.errorPopoverParams();

            this.setModel();
        },
        errorPopoverParams: function () {
            //******Set Initially Empty Error Mdl******
            this.eMdl = this.getOwnerComponent().getModel('errors');
            ErrorMessage.removeValueState([this.formId], this.eMdl);
            this.eMdl.setData([]);
        },
        setModel() { // Setting new model for create screen
            let newData = {
                "name": "New Configuration",
                "type": null,
                "endpoint": null,
                "username": null,
                "password": null,
                "connectionStateColor": null,
                "connectionStateIcon": null,
                "systemType": null,
                "createdAt": null,
                "updatedAt": null,
                "status": 2,
            }
            this.getView().setModel(new JSONModel(newData), "configurationMdl");
        },
        handleFullScreen: function () {
            //var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
            this.oRouter.navTo("create_configuration", { layout: "MidColumnFullScreen" });
        },
        handleExitFullScreen: function () {
            //var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
            this.oRouter.navTo("create_configuration", { layout: "TwoColumnsMidExpanded" });
        },
        handleClose: function () {
            // var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
            //this.oRouter.navTo("manage_configurations", { layout: "OneColumn" });
            this.onPressCancel();
        },
        onExit: function () {
            this.oRouter.getRoute("manage_configurations").detachPatternMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("create_configuration").detachPatternMatched(this._onRouteMatched, this);
        },
        onPressCancel: function () {
            this.errorPopoverParams();
            this.setModel();
            this.oRouter.navTo("manage_configurations", { layout: "OneColumn" });
        },
        onPressSave() {
            this.errorPopoverParams();
            ErrorMessage.formValidation([this.formId], this.eMdl, this.pageId);
            let valid = this.eMdl.getData();
            if (valid.length == 0) {
                this.onSuccessMessage();
            } else {
                this.errorHandling();
            }
        },
        onSuccessMessage: function () {
            if (MessageBox) { // Check if MessageBox is defined
                MessageBox.success("Saved successfully!", {
                    actions: ["OK"],
                    emphasizedAction: "OK",
                    onClose: (() => {
                        //this.onPressCancel();
                        this.setModel();
                    })
                });
            } else {
                console.error("MessageBox is not defined!");
            }
        },
        onShowPassword(oEvent) {
            let oSource = oEvent.getSource();
            let type = oSource.getType() == 'Text';
            let getIcon = oSource.getValueHelpIconSrc();
            let show = ((oSource) => {
                oSource.setValueHelpIconSrc("sap-icon://show");
                oSource.setType("Password");
            });
            let hide = ((oSource) => {
                oSource.setValueHelpIconSrc("sap-icon://hide");
                oSource.setType("Text");
            });

            if (type) {
                show(oSource);
            } else {
                hide(oSource);
            }

            oSource.setValue(oSource.getValue());

        },
        async onPressCheckConnection(oEvent) {
            this.errorPopoverParams();
            ErrorMessage.formValidation([this.formId], this.eMdl, this.pageId);
            let valid = this.eMdl.getData();
            if (valid.length == 0) {
                let configModel = this.getView().getModel("configurationMdl");
                if (configModel) {
                    let configData = configModel.getData();

                    // Icons and Colors for connection status
                    const ICONS = {
                        success: "sap-icon://sys-enter-2",
                        failure: "sap-icon://sys-cancel-2",
                    };
                    const COLORS = {
                        success: "green",
                        failure: "red",
                    };

                    this.showLoading(true);

                    // Simulate a check operation with a timeout
                    //setTimeout(async () => {

                    let isUrlValid = await this.checkConnection();
                    this.showLoading(false);
                    configData.connectionValueState = isUrlValid ? "None" : "Error";
                    configData.connectionStateIcon = isUrlValid ? ICONS.success : ICONS.failure;
                    configData.connectionStateColor = isUrlValid ? COLORS.success : COLORS.failure;

                    // Update log entry based on the result
                    let connectionMsg = isUrlValid ? "Successfully Authenticated!" : "Authentication Failed!";
                    if (isUrlValid) {
                        MessageBox.success(connectionMsg)
                    } else {
                        MessageBox.error(connectionMsg)
                    }
                    configModel.refresh(true);
                    //}, 2000);
                }
            }

        },
        //API call for checking connection
        async checkConnection() {
            try {
                const path = URLConstants.URL.config_check;
                let request = {
                    url: "API_PRODUCT_SRV/A_Product"
                }
                let resStatus = await this.restMethodPost(path, request)
                if (resStatus && resStatus.includes("200")) {
                    return true;
                } else {
                    return false;
                }
            } catch (ex) {
                this.errorHandling(ex)
            }
        }
    });
});
