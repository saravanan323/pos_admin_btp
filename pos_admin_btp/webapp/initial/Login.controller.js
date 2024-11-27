sap.ui.define([
    "com/posadminbtp/initial/BaseController",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/library',
    'com/posadminbtp/utils/ErrorMessage',
    'com/posadminbtp/utils/URLConstants',
], function (BaseController, JSONModel, coreLibrary, ErrorMessage, URLConstants) {
    "use strict";

    return BaseController.extend("com.posadminbtp.initial.Login", {
        onInit() {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("login").attachMatched(this._onObjectMatched, this);

            //validation related id parameters
            this.formId = this.getView().byId('loginForm');
            this.pageId = this.getView().byId('loginPage');
            this.popoverBtn = this.getView().byId('messagePopoverBtnLogin');
            //
            this.loginBtn = this.byId("loginBtn");

        },
        _onObjectMatched() {
            //Default theme
            sap.ui.getCore().applyTheme("sap_horizon");

            this.errorPopoveraParams();

            this.loginBtn.setVisible(true);
            this.loginModel();
            this.onPressChangePassword();
        },
        onAfterRendering() {
            this.getView().addDelegate({
                onsapenter() {
                    that.oView.getController().onPressLogin();
                }
            });
        },
        loginModel() {
            let oModel = new JSONModel({ userName: "Saravanan", password: "Pass123", enable: true });
            this.getView().setModel(oModel, "loginModel");
        },
        errorPopoveraParams() {
            //value state removing if existing state is thare means
            this.eMdl = this.getOwnerComponent().getModel('errors');
            ErrorMessage.removeValueState([this.formId], this.eMdl);
        },
        handleMessagePopoverPress(oEvent) {
            //this.errorMessagePopover(oEvent.getSource());
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
        onPressChangePassword(oEvent) {
            var cModel = this.getView().getModel('loginModel');
            cModel.getData().enable = true;
            cModel.refresh();
            this.loginBtn.setText("Login");
        },
        onPressLogin(oEvent) {
            this.oRouter.navTo("home");
        },
    });
});
