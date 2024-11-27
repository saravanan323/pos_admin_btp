sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History",
        "sap/ui/model/json/JSONModel",
        "sap/ui/core/Element",
        "sap/m/Button",
        "sap/ui/core/Fragment",
        "sap/m/Dialog",
        "sap/m/library",
        "com/posadminbtp/utils/URLConstants",
        "sap/ui/core/format/DateFormat"
    ],
    function (
        Controller,
        History,
        JSONModel,
        Element,
        Button,
        Fragment,
        Dialog,
        mobileLibrary,
        URLConstants,
        DateFormat
    ) {
        "use strict";
        // shortcut for sap.m.ButtonType
        var ButtonType = mobileLibrary.ButtonType;

        // shortcut for sap.m.DialogType
        var DialogType = mobileLibrary.DialogType;
        return Controller.extend("com.posadminbtp.initial.BaseController", {
            onInit() {
                //console.log("test")
            },
            getRouter() {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },
            getModel(sName) {
                return this.getView().getModel(sName);
            },
            setModel(oModel, sName) {
                return this.getView().setModel(oModel, sName);
            },
            getResourceProperty(text) {
                return this.getOwnerComponent()
                    .getModel("i18n")
                    .getResourceBundle()
                    .getText(text);
            },
            onNavBack() {
                var oHistory, sPreviousHash;

                oHistory = History.getInstance();
                sPreviousHash = oHistory.getPreviousHash();

                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    this.getRouter().navTo("login", {}, true /*no history*/);
                }
            },
            encode(value) {
                return btoa(value);
            },
            decode(value) {
                return atob(value);
            },
            setStorage(name, sContext) {
                jQuery.sap.require("jquery.sap.storage");
                var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
                oStorage.put(name, sContext);
            },
            getStorage(name) {
                jQuery.sap.require("jquery.sap.storage");
                var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
                return oStorage.get(name);
            },
            getUserContext() {
                // Access login user information anywhere in the application....
                let oUserContext = this.getStorage("userContext");
                if (oUserContext) {
                    return oUserContext;
                }
            },
            fileReader: async function (oFile, type) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();

                    reader.onload = e => {
                        //resolve(e.target.result);
                        resolve(e.target.result);
                    };
                    reader.onerror = err => reject(err);

                    switch (type) {
                        case "arrayBuffer":
                            reader.readAsArrayBuffer(oFile);
                            break;
                        case "url":
                            reader.readAsDataURL(oFile);
                            break;
                        case "text":
                            reader.readAsText(oFile);
                            break;
                        default:
                            reader.readAsBinaryString(oFile);
                            break;
                    }
                });
            },
            //METHOD FOR GET & POST
            ///HTTP re-usable methods
            restMethodGet(url) {
                url = URLConstants.URL.app_end_point + url;
                /* var contexts = this.getStorage("userContext");
                var token = "";
                if (contexts != null)
                    token = contexts.sessionID; */

                var deferred = $.Deferred();
                $.ajax({
                    type: 'GET',
                    url: url,
                    contentType: "application/json",
                    /* headers: {
                      "sessionCookie": this.getStorage("userContext").sessionCookie || null
                    }, */
                    //headers: { Authorization: "Bearer " + token },
                    success(response) {
                        deferred.resolve(response);
                    },
                    error(xhr) {
                        deferred.reject(xhr.responseJSON);
                    }
                });
                return deferred.promise();
            },
            restMethodGetWitData(url, request) {
                url = URLConstants.URL.app_end_point + url;
                var deferred = $.Deferred();
                $.ajax({
                    type: 'POST',
                    url: url,
                    contentType: "application/json",
                    data: JSON.stringify(request),
                    //headers: { Authorization: "Bearer " + token },
                    success(response) {
                        deferred.resolve(response);
                    },
                    error(xhr) {
                        deferred.reject(xhr.responseJSON.message);
                    }
                });
                return deferred.promise();
            },
            restMethodPost(url, request) {
                url = URLConstants.URL.app_end_point + url;
                var deferred = $.Deferred();
                $.ajax({
                    type: 'POST',
                    url: url,
                    data: JSON.stringify(request),
                    contentType: "application/json",
                    /* headers: {
                      "sessionCookie": this.getStorage("userContext").sessionCookie || null
                    }, */
                    success(response) {
                        deferred.resolve(response);
                    },
                    error(xhr) {
                        deferred.reject(xhr.responseJSON);
                    }
                });
                return deferred.promise();
            },
            restMethodPostLogin(url, request)//without cookie
            {
                url = URLConstants.URL.app_end_point + url;
                var deferred = $.Deferred();
                $.ajax({
                    type: 'POST',
                    url: url,
                    data: JSON.stringify(request),
                    contentType: "application/json",
                    success(response) {
                        deferred.resolve(response);
                    },
                    error(xhr) {
                        deferred.reject(xhr.responseJSON);
                    }
                });
                return deferred.promise();
            },
            showLoading(status) {
                this.getView().setBusy(status);
                this.getView().setBusyIndicatorDelay(10);
            },

            onPressHome() {
                this.getRouter().navTo("dashboard");
            },
            //Set Title
            setTitle(title) {
                let oModel = this.getOwnerComponent().getModel();
                oModel.getData().genericTitle = title;
                oModel.refresh();
            },
            /* Date Formate Change */
            getDateFormats(key, date) {
                let oModel = this.getOwnerComponent().getModel();
                if (oModel) {
                    let oData = oModel.getData();
                    let userSettings = oData.userSettings || this.defaultUserSettings().userSettings;
                    let convDate, oDateObject; // Converted Date
                    if (date) {
                        oDateObject = new Date(date);

                        if (key == 1) {
                            userSettings.dateFormat = "dd-MM-yyyy";
                        } else if (key == 2) {
                            //Short
                            userSettings.dateFormat = "dd-MMM-yyyy";
                        } else if (key == 3) {
                            //Long
                            userSettings.dateFormat = "dd-MMMM-yyyy";
                        } else {
                            userSettings.dateFormat = "dd-MM-yyyy";
                        }
                        convDate = DateFormat.getTimeInstance({ pattern: userSettings.dateFormat });
                        return convDate.format(oDateObject);
                    }
                    oModel.refresh();
                }
            },

            /* Time Format Change */
            getTimeFormats(key, time) {
                let oModel = this.getOwnerComponent().getModel();
                if (oModel) {
                    let oData = oModel.getData();
                    let userSettings = oData.userSettings || this.defaultUserSettings().userSettings;
                    if (time) {
                        let todayDateWithTime = new Date(`${new Date().toDateString()}, ${time}`); // Combine today's date with the time
                        let convTime; // Converted time
                        if (key == 1) {
                            userSettings.timeFormat = "hh:mm:ss a";
                        } else if (key == 2) {
                            userSettings.timeFormat = "HH:mm:ss";
                        }
                        convTime = DateFormat.getTimeInstance({ pattern: userSettings.timeFormat });
                        return convTime.format(todayDateWithTime);
                    }
                    oModel.refresh();
                }
            },

            /* Date and Time Formate Change */
            getDateTimeFormats(format, date) {
                let oModel = this.getOwnerComponent().getModel();
                if (oModel) {
                    let defaultFormat = this.defaultUserSettings().userSettings?.dateTimeFormat;
                    if (date) {
                        let cDateObject = new Date(date);//Converted Date Object
                        let dateFormat = DateFormat.getInstance({ pattern: format || defaultFormat });
                        let result = dateFormat.format(cDateObject);
                        return result;
                    }
                }

            },
            defaultUserSettings() {
                return {
                    themes: [
                        {
                            key: "sap_bluecrystal",
                            name: "Blue Crystal",
                        },
                        {
                            key: "sap_belize",
                            name: "Belize",
                        },
                        {
                            key: "sap_fiori_3",
                            name: "Quartz Light",
                        },
                        {
                            key: "sap_fiori_3_dark",
                            name: "Quartz Dark",
                        },
                        {
                            key: "sap_horizon",
                            name: "Morning Horizon",
                        },
                        {
                            key: "sap_horizon_dark",
                            name: "Evening Horizon",
                        },
                    ],
                    timeFormat: [
                        {
                            key: 1,
                            name: "12 Hours",
                        },
                        {
                            key: 2,
                            name: "24 Hours",
                        },
                    ],
                    dateFormat: [
                        {
                            key: 1,
                            name: "Numeric",
                        },
                        {
                            key: 2,
                            name: "Short",
                        },
                        {
                            key: 3,
                            name: "Long",
                        },
                    ],
                    language: [
                        {
                            key: "en",
                            name: "English",
                        },
                        {
                            key: "ar",
                            name: "Arabic",
                        },
                    ],
                    userSettings: {
                        theme: "sap_horizon",
                        language: "en",
                        dateFormatKey: 1,
                        timeFormatKey: 1,
                        dateFormat: "dd-MM-yyyy",
                        timeFormat: "HH:mm:ss",
                        dateTimeFormat: "dd-MM-yyyy, HH:mm:ss"
                    },
                }
            },
            userSettingsData() {
                let oModel = this.getModel();
                let oData = this.defaultUserSettings();
                if (oModel) {
                    //Themes and User Settings
                    let settings = this.getStorage("userSettings");
                    let oModel = this.getView().getModel();
                    let existData = oModel.getData();
                    let merge = {
                        ...existData,
                        ...oData,
                    };
                    oModel.setData(merge);

                    oModel.getData().userSettings.currentDate = this.getDateFormats(1, new Date());
                    oModel.getData().userSettings.currentTime = this.getTimeFormats(1, new Date().toLocaleTimeString());

                    if (settings) {
                        oModel.getData().userSettings = settings;
                        this.setStorage("userSettings", settings);
                        this.onApplyTheme(settings.theme);
                    } else {
                        this.setStorage("userSettings", oData.userSettings);
                    }
                    oModel.refresh();
                } else {
                    this.setModel(new JSONModel(oData));
                }
            },
            //User Settings Dialog
            onPressUserSetting() {
                var that = this;
                if (!this.userSettingsDialog) {
                    this.userSettingsDialog = this.loadFragment(
                        {
                            name: "com.posadminbtp.initial.fragment.UserSettings",
                        },
                        this
                    );
                }
                this.userSettingsDialog.then((oDialog) => {
                    var listTheme = that.byId("dg_listThemes");
                    var settings = that.getStorage("userSettings");
                    listTheme.getItems().forEach((e) => {
                        let key = e.getBindingContext().getObject().key;
                        if (key == settings.theme) {
                            listTheme.setSelectedItem(e);
                        }
                    });
                    oDialog.open();
                    that.userSettingsData();
                });
            },
            onCloseUserSetting() {
                this.userSettingsDialog.then((oDialog) => {
                    oDialog.close();
                });
            },
            onPressUserDialogMenu(oEvent) {
                let splitContainer = this.byId("userSettingsSplitContainer");
                splitContainer.backMaster();
            },
            //on Apply theme
            onApplyTheme(key) {
                if (key) {
                    sap.ui.getCore().applyTheme(key);
                    sap.ui.getCore().attachThemeChanged(function (oEvent) {
                        console.log(oEvent.getParameters());
                    });
                }
            },
            //on Theme Selection
            onThemSelect(oEvent) {
                var oModel = this.getModel();
                var selThemObj = oEvent
                    .getParameter("listItem")
                    .getBindingContext()
                    .getObject();

                oModel.getData().userSettings.theme = selThemObj.key;
                this.onApplyTheme(selThemObj.key);
                oModel.refresh();
            },
            // on Language Selection
            onChangeLanguage(oEvent) {
                var oModel = this.getModel();
                var coreConfig = sap.ui.getCore().getConfiguration();
                var selThemObj = oEvent
                    .getParameter("selectedItem")
                    .getBindingContext()
                    .getObject();

                oModel.getData().userSettings.language = selThemObj.key;
                sap.ui.getCore().attachLocalizationChanged((oEvent) => {
                    console.log(oEvent.getParameters());
                });

                coreConfig.setLanguage(selThemObj.key);

                oModel.refresh();
            },
            onResetAdaptFilter: function (oSource) {//its alternative for reset todo: future will remove this
                //reset adapt filter options
                let that = this;
                let oSettingMdl = this.getOwnerComponent().getModel("settings");
                oSettingMdl.getData().visible_filter = that._defaultAFOption;
                oSettingMdl.refresh(true);
                oSource.getFilterGroupItems().forEach((e) => {
                  let findLbl = that._defaultAFOption.find(
                    (e1) => e.getLabel() == Object.keys(e1)[0]
                  );
                  if (findLbl) {
                    e.setVisibleInFilterBar(findLbl[e.getLabel()]);
                  }
                });
              },
            // on Change Date Format for Entire Application
            onChangeApplicationDate(oEvent) {
                var oModel = this.getModel();
                var oKey = oEvent.getParameter("selectedItem").getKey();
                oModel.getData().userSettings.currentDate = this.getDateFormats(
                    oKey,
                    new Date()
                );
                oModel.refresh();
                this.setStorage("userSettings", oModel.getData().userSettings)
            },
            // on Change Time Format for Entire Application
            onChangeApplicationTime(oEvent) {
                var oModel = this.getModel();
                var oKey = oEvent.getParameter("selectedItem").getKey();
                oModel.getData().userSettings.currentTime = this.getTimeFormats(oKey, new Date().toLocaleTimeString());
                oModel.refresh();
            },
            onPressSaveSettings(oEvent) {
                var oModel = this.getModel();
                this.setStorage("userSettings", oModel.getData().userSettings);
                this.userSettingsDialog.then((oDialog) => {
                    oDialog.close();
                });
            },
            onListUserSettingItemPress(oEvent) {
                var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();
                var sContainer = this.getView().byId("userSettingsSplitContainer");
                sContainer.toDetail(this.createId(sToPageId));
            },
            disableItemNavigated(oTable) {
                if (oTable) {
                    oTable.getItems().forEach((e) => e.setNavigated(false));
                }
            },
            //LogOut Dialog
            onPressLogOut() {
                if (!this.oApproveDialog) {
                    this.oApproveDialog = new Dialog({
                        type: DialogType.Message,
                        title: "Confirm",
                        content: new sap.m.Text({
                            text: "Are you sure you want to log off?",
                        }),
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "OK",
                            press: (() => {
                                this.getRouter().navTo("login");
                                this.oApproveDialog.close();
                            }).bind(this),
                        }),
                        endButton: new Button({
                            text: "Cancel",
                            press: (() => {
                                this.oApproveDialog.close();
                            }).bind(this),
                        }),
                    });
                }

                this.oApproveDialog.open();
            },
            //Menu popover
            menuPopoverOpen(oEvent) {
                var oButton = oEvent.getSource(),
                    oView = this.getView();

                // create popover
                if (!this._menuPopover) {
                    this._menuPopover = Fragment.load({
                        id: oView.getId(),
                        name: "com.posadminbtp.initial.fragment.MenuButton",
                        controller: this,
                    }).then((oPopover) => {
                        oView.addDependent(oPopover);
                        return oPopover;
                    });
                }
                this._menuPopover.then((oPopover) => {
                    oPopover.openBy(oButton);
                });
            },

            //Error popover button handler
            handleMessagePopoverPress(oEvent) {
                let isDialog = false;
                let oSource;
                if (oEvent?.oSource) {
                    oSource = oEvent.getSource();
                } else {
                    oSource = oEvent;
                }
                if (!this.oPopover) {
                    this.errorMessagePopover(oSource, isDialog);
                } else {
                    this.oPopover.toggle(oSource);
                }
            },
            //Error Popover Start
            async errorMessagePopover(popoverBtn) {
                let oButton = popoverBtn,
                    oView = this.getView();

                try {
                    if (!this.oPopover) {
                        this.oPopover = await this.loadFragment({
                            name: "com.posadminbtp.initial.fragment.ErrorMessage",
                        });
                        oView.addDependent(this.oPopover);
                    }

                    this.oPopover.openBy(oButton);
                } catch (error) {
                    console.log(error);
                }

            },
            errorMessagePopoverClose() {
                if (this.oPopover != undefined) {
                    this.oPopover.close();
                }
            },
            onActiveTitlePress(oEvent) {
                var getSelItem = oEvent.getParameter("item").getBindingContext("errors").getObject();
                var control = getSelItem.control;
                var oPage = getSelItem.page;
                var oControl = Element.registry.get(control.getId());

                if (oControl) {
                    jQuery.sap.delayedCall(500, this, (() => {
                        oControl.focus();
                    }));
                    if (oControl?.getAccessibilityInfo) {
                        var type = oControl?.getAccessibilityInfo()?.type;
                    }
                    if (type == "Checkbox") {
                        var text = oControl.getText();
                        var oPopover = new sap.m.Popover({
                            showHeader: false,
                            placement: "Bottom",
                            content: [
                                new sap.m.Text({
                                    text: text,
                                    width: "auto",
                                }).addStyleClass("sapUiTinyMargin"),
                            ],
                        });
                        oPopover.openBy(oControl);
                    }
                }
            },

            customErrorObject(errorMessages, pageId, oControl, description) {
                return {
                    type: "Error",
                    active: false,
                    control: oControl,
                    title: errorMessages,
                    subTitle: null,
                    description: description,
                    page: pageId,
                };
            },
            errorHandling(ex) {
                var that = this;
                if (!this.errorData || !ex) {
                    this.errorData = [];
                }
                let isInvalidSession = ex?.errorDescription?.includes("301") || ex?.errorDescription?.includes("Invalid Session");
                let invalidSession = ((ex) => {
                    if (ex.errorDescription.includes("301") || ex.errorDescription.includes("Invalid Session")) {
                        sap.m.MessageBox.error(ex.errorDescription, {
                            actions: [sap.m.MessageBox.Action.OK],
                            emphasizedAction: "OK",
                            onClose(sAction) {
                                that.getRouter().navTo('login');
                            }
                        });
                    }
                });
                if (!isInvalidSession) {
                    let eModel = this.getOwnerComponent().getModel("errors");
                    let exist = this.errorData.find((e) => e.title == (ex?.responseJSON?.errorDescription || ex?.responseJSON?.debugMessage || ex?.errorDescription));
                    if (ex && !exist) {
                        if (ex.responseJSON?.debugMessage) {
                            this.errorData.push(that.customErrorObject(ex.responseJSON.debugMessage, that.pageId, null));
                        } else if (ex.responseJSON?.errorDescription) {
                            this.errorData.push(that.customErrorObject(ex.responseJSON.errorDescription, that.pageId, null));
                        } else if (ex.responseJSON) {
                            this.errorData.push(that.customErrorObject(ex.responseJSON.error, that.pageId, null));
                        } else if (ex?.errorDescription || ex?.debugMessage) {
                            this.errorData.push(that.customErrorObject(ex?.errorDescription || ex?.debugMessage, that.pageId, null));
                        } else if (ex.status) {
                            this.errorData.push(that.customErrorObject(ex.status + " " + ex.statusText, that.pageId, null));
                        } else {
                            this.errorData.push(that.customErrorObject(ex, that.pageId, null));
                        }
                    }
                    let exData = eModel.getData().length ? eModel.getData() : [];
                    let merge = [...exData, ...this.errorData];
                    eModel.setData(merge);

                    if (merge.length) {
                        that.errorMessagePopover(that.popoverBtn, false);
                    }
                } else {
                    invalidSession(ex);
                }
                that.showLoading(false);
            },
            //Error Popover End
        });
    }
);
