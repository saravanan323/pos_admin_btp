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

    return BaseController.extend("com.posadminbtp.licence_key_control.CreateLicenceKeyControl", {

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("manage_licence_key_control").attachPatternMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("create_licence_key_control").attachPatternMatched(this._onRouteMatched, this);

            let oSource = ((sId) => this.getView().byId(sId));
            [this.formId, this.pageId, this.popoverBtn] = [oSource('from_CLKC'), oSource('creatlicence_page'), oSource('errorBtnCrtLicence')]
        },
        _onRouteMatched: function (oEvent) {
            this._product = oEvent.getParameter("arguments").id || 0;

            let settingsMdl = this.oOwnerComponent.getModel("settings");
            let settingData = settingsMdl.getData();
            settingData.genericTitle = this.getResourceProperty("lkc_licenceKeyControl");
            settingsMdl.refresh();

            var setDataModel = {
                Status: [
                    { key: "1", text: "Draft" },
                    { key: "2", text: "Active" },
                    { key: "3", text: "Inactive" }
                ],
                system: [
                    { key: "1", text: "System1" },
                    { key: "2", text: "System2" }
                ],

            };

            this.getView().setModel(new JSONModel(setDataModel), "masterdataMdl");

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
                "name": null,
                "description": null,
                "system": null,
                "licenceKey": null,
                "expirationDate": null,
                "createBy": null,
                "updatedBy": null,
                "status": 2,
            }
            this.getView().setModel(new JSONModel(newData), "licenceKeyControlMdl");
        },
        onPressCancel: function () {
            this.errorPopoverParams();
            this.clearInputFields();
            this.oRouter.navTo("manage_licence_key_control", { layout: "OneColumn" });
        },
        handleFullScreen: function () {
            //var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
            this.oRouter.navTo("create_licence_key_control", { layout: "MidColumnFullScreen" });
        },

        handleExitFullScreen: function () {
            //var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
            this.oRouter.navTo("create_licence_key_control", { layout: "TwoColumnsMidExpanded" });
        },

        handleClose: function () {
            this.errorPopoverParams();
            this.clearInputFields();
            //let sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
            this.oRouter.navTo("manage_licence_key_control", { layout: "OneColumn" });
        },

        onExit: function () {
            this.oRouter.getRoute("manage_licence_key_control").detachPatternMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("licence_key_control_detail").detachPatternMatched(this._onRouteMatched, this);
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
        clearInputFields: function () {
            this.setModel();
        }
    });
});
