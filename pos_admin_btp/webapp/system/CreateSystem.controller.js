sap.ui.define([
    "com/posadminbtp/initial/BaseController",
    "sap/ui/model/json/JSONModel",
    "com/posadminbtp/utils/URLConstants",
    'com/posadminbtp/utils/ErrorMessage',
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/routing/History",
], function (
    BaseController, JSONModel, URLConstants, ErrorMessage, MessageBox, MessageToast, History
) {
    "use strict";

    const oHistory = History.getInstance();
    const sPreviousHash = oHistory.getPreviousHash();

    return BaseController.extend("com.posadminbtp.system.CreateSystem", {

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("manage_system").attachPatternMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("create_system").attachPatternMatched(this._onRouteMatched, this);

            let oSource = ((sId) => this.getView().byId(sId));
            [this.formId, this.pageId, this.popoverBtn] = [oSource('form_CS'), oSource('creatSystem_page'), oSource('errorBtnCrtSystem')]
        },
        _onRouteMatched: function (oEvent) {
            this._product = oEvent.getParameter("arguments").id || 0;

            let settingsMdl = this.oOwnerComponent.getModel("settings");
            let settingData = settingsMdl.getData();
            settingData.genericTitle = this.getResourceProperty("ms_systems");
            settingsMdl.refresh();

            this.setModel();

            let masterData = {
                status: [
                    { key: "1", text: "Draft" },
                    { key: "2", text: "Active" },
                    { key: "3", text: "Inactive" }
                ],
                company: [
                    { key: "1", text: "ITFZ_inflexion" },
                ],
                configuration: [
                    { key: "1", text: "Sample Service" },
                    { key: "2", text: "User Management Service" },
                    { key: "3", text: "Order Management Service" }
                ],
                salesOrg: [
                    { key: "1", text: "Functional" },
                    { key: "2", text: "Technical" },
                    { key: "3", text: "Sales" }

                ],
                salesOffice: [
                    { key: "1", text: "Oman" },
                    { key: "2", text: "Bengaluru" },
                    { key: "3", text: "Abu Dhabi" }


                ]

            };
            this.getView().setModel(new JSONModel(masterData), "masterDataMdl");
        },
        errorPopoverParams: function () {
            //******Set Initially Empty Error Mdl******
            this.eMdl = this.getOwnerComponent().getModel('errors');
            ErrorMessage.removeValueState([this.formId], this.eMdl);
            this.eMdl.setData([]);
        },
        setModel() { // Setting new model for create screen
            let newData = {
                "name": null,
                "description": null,
                "macAddress": null,
                "company": null,
                "companyLogo": "./images/no-preview.jpg",
                "configuration": null,
                "salesOrg": null,
                "salesOffice": null,
                "status": 2,
            }
            this.getView().setModel(new JSONModel(newData), "systemMdl");
        },
        onPressCancel: function () {
            this.errorPopoverParams();
            this.clearInputFields();
            if (sPreviousHash.includes("manage_system")) {
                this.oRouter.navTo("manage_system", { layout: "OneColumn" });
            } else {
                window.history.go(-1);//Other screen navigations
            }

        },
        handleFullScreen: function () {
            //let sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
            this.oRouter.navTo("create_system", { layout: "MidColumnFullScreen" });
        },

        handleExitFullScreen: function () {
            //let sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
            this.oRouter.navTo("create_system", { layout: "TwoColumnsMidExpanded" });
        },

        handleClose: function () {
            this.errorPopoverParams();
            this.clearInputFields();
            //let sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
            if (sPreviousHash && sPreviousHash.includes("manage_system")) {
                this.oRouter.navTo("manage_system", { layout: "OneColumn" });
            } else {
                window.history.go(-1);//Other screen navigations
            }
        },

        onExit: function () {
            this.oRouter.getRoute("manage_system").detachPatternMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("system_detail").detachPatternMatched(this._onRouteMatched, this);
        },

        onPressSave: function () {
            let that = this;
            this.errorPopoverParams();
            ErrorMessage.formValidation([this.formId], this.eMdl, this.pageId);
            let valid = this.eMdl.getData();
            if (valid.length === 0) {
                MessageBox.success(this.getResourceProperty("msg_success"), {
                    actions:[MessageBox.Action.OK],
                    onClose: function () {
                        that.onPressCancel();
                    }.bind(this)
                });
            } else {

                this.errorHandling();
            }
        },

        clearInputFields: function () {
            this.setModel();
        }

    });
});
