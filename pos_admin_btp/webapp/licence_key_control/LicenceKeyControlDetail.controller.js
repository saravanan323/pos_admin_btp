sap.ui.define([
    "com/posadminbtp/initial/BaseController",
    "sap/ui/model/json/JSONModel",
    "com/posadminbtp/utils/URLConstants",
    'com/posadminbtp/utils/ErrorMessage',
    "sap/m/MessageBox",
    "sap/m/MessageToast",
], function (
    BaseController, JSONModel, URLConstants, ErrorMessage, MessageBox, MessageToast
) {
    "use strict";

    return BaseController.extend("com.posadminbtp.licence_key_control.LicenceKeyControlDetail", {

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();


            this.oRouter.getRoute("manage_licence_key_control").attachPatternMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("licence_key_control_detail").attachPatternMatched(this._onRouteMatched, this);

            let oSource = ((sId) => this.getView().byId(sId));
            [this.formId, this.pageId, this.popoverBtn] = [oSource('from_DLKC'), oSource('detaillicence_page'), oSource('errorBtnDetLicence')]
        },
        _onRouteMatched: function (oEvent) {
            this._item = oEvent.getParameter("arguments").id || 0;

            let settingsMdl = this.oOwnerComponent.getModel("settings");
            let settingData = settingsMdl.getData();
            settingData.genericTitle = this.getResourceProperty("lkc_licenceKeyControl");
            settingsMdl.refresh();

            this.errorPopoverParams();

            // this.getView().setModel(new JSONModel(product), "productMdl");
            let visibleData = {
                edit: false,
                view: true
            }
            this.getView().setModel(new JSONModel(visibleData), "visible");
            this.setData(this._item)
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
        },
        errorPopoverParams: function () {
            //******Set Initially Empty Error Mdl******
            this.eMdl = this.getOwnerComponent().getModel('errors');
            ErrorMessage.removeValueState([this.formId], this.eMdl);
            this.eMdl.setData([]);
        },
        setData(id) {
            let system;
            if (id) {
                let data = this.dummyData();
                system = data.find(e => e.id == id);
            }
            this.getView().setModel(new JSONModel(system), "LicenceKeyControlMDL");
        },
        onPressEdit() {
            this.errorPopoverParams();
            let vModel = this.getView().getModel("visible");
            if (vModel) {
                let vData = vModel.getData();
                vData.edit = !vData.edit;
                vData.view = !vData.view;
                vModel.refresh();
            }
        },
        async onPressCancel() {
            this.errorPopoverParams();
            let vModel = this.getView().getModel("visible");
            if (vModel) {
                let vData = vModel.getData();
                vModel.setData({
                    edit: !vData.edit,
                    view: !vData.view
                });
                vModel.refresh(true);
                this.setData(this._item);
            }
        },


        dummyData() {
            return [
                {
                    "id": "LKC001",
                    "name": "Test1 Licence",
                    "description": "licence key control",
                    "licenseKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
                    "expirationDate": "23-09-2013",
                    "createdAt": "28-09-2013 09:57:19",
                    "updatedAt": "29-09-2013 09:57:19",
                    "createdBy": "admin",
                    "updatedBy": "",
                    "SystemID": "System1",
                    "StatusID": 2,


                },
                {
                    "id": "LKC002",
                    "name": "Test2 Licence",
                    "description": "TESTblicence key control",
                    "licenseKey": "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ",
                    "expirationDate": "24-09-2013",
                    "createdAt": "28-09-2013 09:57:19",
                    "updatedAt": "29-09-2013 09:57:19",
                    "createdBy": "jone",
                    "updatedBy": "",
                    "SystemID": "System2",
                    "StatusID": 3,


                }


            ]
        },

        handleFullScreen() {
            //var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
            this.oRouter.navTo("licence_key_control_detail", { layout: "MidColumnFullScreen", id: this._item });
        },

        handleExitFullScreen() {
            //var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
            this.oRouter.navTo("licence_key_control_detail", { layout: "TwoColumnsMidExpanded", id: this._item });
        },

        handleClose() {
            // var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
            this.oRouter.navTo("manage_licence_key_control", { layout: "OneColumn" });
        },

        onExit() {
            this.oRouter.getRoute("manage_licence_key_control").detachPatternMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("licence_key_control_detail").detachPatternMatched(this._onRouteMatched, this);
        },
        onPressSave: function () {
            this.errorPopoverParams();
            ErrorMessage.formValidation([this.formId], this.eMdl, this.pageId);

            let valid = this.eMdl.getData();
            console.log("Validation results:", valid); // Log validation results

            if (valid.length == 0) {
                this.onSuccessMessage();
            } else {
                this.errorHandling();
            }
        },
        onSuccessMessage: function () {
            if (MessageBox) { // Check if MessageBox is defined
                MessageBox.success("Updated successfully!", {
                    actions: ["OK", MessageBox.Action.CLOSE],
                    emphasizedAction: "OK",
                    onClose: (() => {
                        this.onPressCancel();
                    })
                });
            } else {
                console.error("MessageBox is not defined!");
            }
        },
    });
});
