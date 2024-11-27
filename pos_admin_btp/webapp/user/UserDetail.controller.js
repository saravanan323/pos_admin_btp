sap.ui.define([
    "com/posadminbtp/initial/BaseController",
    "sap/ui/model/json/JSONModel",
    "com/posadminbtp/utils/URLConstants",
    "com/posadminbtp/utils/ErrorMessage",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/Popover",
    "sap/m/VBox",
    "sap/m/Text",
    "sap/ui/core/routing/History",
], function (
    BaseController, JSONModel, URLConstants, ErrorMessage, MessageBox, MessageToast, Popover, VBox, Text, History
) {
    "use strict";
    const oHistory = History.getInstance();
    const sPreviousHash = oHistory.getPreviousHash();

    return BaseController.extend("com.posadminbtp.user.UserDetail", {
        onInit() {
            this.oOwnerComponent = this.getOwnerComponent();
            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            // Attach route handlers
            this.oRouter.getRoute("manage_user").attachPatternMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("user_detail").attachPatternMatched(this._onRouteMatched, this);

            // Initialize UI elements
            let oSource = (sId) => this.getView().byId(sId);
            [this.formId, this.pageId, this.popoverBtn] = [oSource('id_form'), oSource('id_detailuser'), oSource('errorBtnEdituser')];

            // Initialize a variable to hold original data for cancel action
            this.originalData = null;
        },

        _onRouteMatched(oEvent) {
            this._user = oEvent.getParameter("arguments").id || 0;


            let settingsMdl = this.oOwnerComponent.getModel("settings");
            let settingData = settingsMdl.getData();
            settingData.genericTitle = "Users";
            settingsMdl.refresh();

            let user;
            if (this._user) {
                let data = this.dummyData();
                user = data.find(e => e.id == this._user);
            }

            // Set the user model
            this.getView().setModel(new JSONModel(user), "userMdl");

            // Initialize error popover parameters
            this.errorPopoverParams();

            // Set visibility model
            let visibleData = {
                edit: false,
                view: true
            };
            this.getView().setModel(new JSONModel(visibleData), "visible");

            let isConditionTrue = user && user.initialPassword;
            let userModel = this.getView().getModel("userMdl");
            userModel.setProperty("/isEnabled", isConditionTrue);
            var setDataModel = {
                system: [
                    { key: "1", text: "System1" },
                    { key: "2", text: "System2" }
                ],
                userType: [
                    { key: "1", text: "Admin" },
                    { key: "2", text: "Editor" },
                    { key: "3", text: "Viewer" },

                ],
                status: [
                    { key: "1", text: "Draft" },
                    { key: "2", text: "Active" },
                    { key: "3", text: "Inactive" },

                ]
            };


            this.getView().setModel(new JSONModel(setDataModel), "masterdataMdl");
        },

        // Function to initialize error popover parameters
        errorPopoverParams: function () {
            this.eMdl = this.getOwnerComponent().getModel('errors');
            ErrorMessage.removeValueState([this.formId], this.eMdl);
            this.eMdl.setData([]);
        },

        onPressEdit() {
            let vModel = this.getView().getModel("visible");
            if (vModel) {
                let vData = vModel.getData();
                vData.edit = !vData.edit;
                vData.view = !vData.view;
                vModel.refresh();
            }

            // Store the original data to revert in case of cancellation
            let userModel = this.getView().getModel("userMdl");
            this.originalData = JSON.parse(JSON.stringify(userModel.getData()));
        },

        onPressCancel() {
            this.errorPopoverParams();
            this.clearInputFields();
            if (sPreviousHash && sPreviousHash.includes("manage_user")) {
                this.oRouter.navTo("manage_user", { layout: "OneColumn" });
            } else {
                window.history.go(-1);//Other screen navigations
            }
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

        onShowErrors: function (errors) {
            // Create a popover to display error messages
            if (!this._oErrorPopover) {
                this._oErrorPopover = new Popover({
                    title: "Validation Errors",
                    content: new VBox({
                        items: errors.map(error => new Text({ text: error.message }))
                    }),
                    afterClose: function () {
                        this.destroy();
                    }
                });
            }
            this._oErrorPopover.openBy(this.getView().byId(this.popoverBtn));
        },

        onSuccessMessage: function () {
            MessageBox.success("Updated successfully!", {
                actions: ["OK", MessageBox.Action.CLOSE],
                emphasizedAction: "OK"
            });
        },

        handleFullScreen() {
            this.oRouter.navTo("user_detail", { layout: "MidColumnFullScreen", id: this._user });
        },

        handleExitFullScreen() {
            this.oRouter.navTo("user_detail", { layout: "TwoColumnsMidExpanded", id: this._user });
        },

        handleClose() {
            this.errorPopoverParams();
            this.clearInputFields();
            //let sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
            if (sPreviousHash && sPreviousHash.includes("manage_user")) {
                this.oRouter.navTo("manage_user", { layout: "OneColumn" });
            } else {
                window.history.go(-1);//Other screen navigations
            }
        },

        onExit() {
            this.oRouter.getRoute("manage_user").detachPatternMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("user_detail").detachPatternMatched(this._onRouteMatched, this);
        },

        dummyData() {
            return [
                {
                    id: "100US",
                    name: "John Doe",
                    email: "john@example.com",
                    status: 2,
                    description: "User description for John",
                    username: "johndoe",
                    password: "3241",
                    initialPassword: true,
                    validFrom: "01-01-2024",
                    validTo: "01-01-2024",
                    system: 1,
                    userType: 1,
                    createdAt: "01-01-2024 09:57:19",
                    updatedAt: "01-01-2024 09:57:19",
                    createdBy: "21-11-2024",
                    updatedBy: "21-11-2024"
                },
                {
                    id: "200US",
                    name: "Jane Smith",
                    email: "jane@example.com",
                    status: 3,
                    description: "User description for Jane",
                    username: "janesmith",
                    password: "456",
                    initialPassword: false,
                    validFrom: "01-01-2025",
                    validTo: "01-01-2025",
                    system: 2,
                    userType: 1,
                    createdAt: "01-01-2024 09:57:19",
                    updatedAt: "01-01-2024 09:57:19",
                    createdBy: "21-11-2024",
                    updatedBy: "21-11-2024"
                }
            ];
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
        clearInputFields: function () {
            this.setModel();
        }
    });
});
