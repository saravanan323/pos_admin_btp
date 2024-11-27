sap.ui.define([
	"com/posadminbtp/initial/BaseController",
	"sap/ui/model/json/JSONModel",
	"com/posadminbtp/utils/URLConstants",
	'com/posadminbtp/utils/ErrorMessage',
	"com/posadminbtp/utils/Formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/core/routing/History",


], function (
	BaseController, JSONModel, URLConstants, ErrorMessage, Formatter, Filter, FilterOperator, MessageBox, MessageToast,History
) {
	"use strict";
	const oHistory = History.getInstance();
    const sPreviousHash = oHistory.getPreviousHash();


	return BaseController.extend("com.posadminbtp.system.SystemDetail", {

		onInit() {
			this.oOwnerComponent = this.getOwnerComponent();

			this.oRouter = this.oOwnerComponent.getRouter();
			this.oModel = this.oOwnerComponent.getModel();

			this.oRouter.getRoute("manage_system").attachPatternMatched(this._onRouteMatched, this);
			this.oRouter.getRoute("system_detail").attachPatternMatched(this._onRouteMatched, this);

			let oSource = ((sId) => this.getView().byId(sId));
			[this.formId, this.pageId, this.popoverBtn, this.oTable] = [oSource('form_SD'), oSource('pageSystemDetail'), oSource('errorBtnEditsystem'), oSource("id_UserTable")]
		},

		_onRouteMatched(oEvent) {
			this._item = oEvent.getParameter("arguments").id || 0;

			let settingsMdl = this.oOwnerComponent.getModel("settings");
			let settingData = settingsMdl.getData();
			settingData.genericTitle = this.getResourceProperty("ms_systems"),
				// settingData.genericTitle = "Systems";
				settingsMdl.refresh();

			this.errorPopoverParams();
			let system;
            if (this._system) {
                let data = this.dummyData();
                user = data.find(e => e.id == this._system);
            }

            // Set the system model
            this.getView().setModel(new JSONModel(system), "systemMdl");

            // Initialize error popover parameters
            this.errorPopoverParams();

            // Set visibility model
            let visibleData = {
                edit: false,
                view: true
            };
            this.getView().setModel(new JSONModel(visibleData), "visible");

            let isConditionTrue = system && system.initialPassword;
            let systemModel = this.getView().getModel("systemMdl");
            systemModel.setProperty("/isEnabled", isConditionTrue);
			this.setData(this._item)
			let setDataModel = {
				status: [
					{ key: "1", text: "Draft" },
					{ key: "2", text: "Active" },
					{ key: "3", text: "Inactive" }
				],
				status: [
					{ key: "1", text: "Draft" },
					{ key: "2", text: "Active" },
					{ key: "3", text: "Inactive" },
					{ key: "4", text: "All" }
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
				salesoffice: [
					{ key: "1", text: "Oman" },
					{ key: "2", text: "Bengaluru" },
					{ key: "3", text: "Abu Dhabi" }


				]

			};
			this.getView().setModel(new JSONModel(setDataModel), "masterdataMdl");
		},

		errorPopoverParams: function () {
			//******Set Initially Empty Error Mdl******
			this.eMdl = this.getOwnerComponent().getModel('errors');
			ErrorMessage.removeValueState([this.formId], this.eMdl);
			this.eMdl.setData([]);
		},
		onListItemPress(oEvent) {
            let userCtxt = oEvent.getSource().getSelectedItem().getBindingContext('systemMdl');
            let user = userCtxt.getObject();
            let oSettingsModel = this.oOwnerComponent.getModel('settings');
            oSettingsModel.setProperty("/navigatedItem", user.id);
            this.oRouter.navTo("user_detail", { layout: "TwoColumnsMidExpanded", id: user.id });
        },
		setData(id) {
			let system;
			if (id) {
				let data = this.dummyData();
				system = data.find(e => e.id == id);

				if (system && system.system) {
					system.system.forEach(system => {
						if (system.status === undefined || system.status === null) {
							system.status = "Active";
						}
					});
				}
			}
			this.getView().setModel(new JSONModel(system), "systemMdl");

			// Now, filter the table to show only Active rows
			const oTable = this.byId("id_UserTable");
			const oBinding = oTable.getBinding("items");
			const aFilters = [
				new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "Active")
			];
			oBinding.filter(aFilters, "Application");
		},
		async onFileUploaderChange(oEvent) {
			let oFile = oEvent.getParameter('files')[0];
			let oModel = this.getView().getModel("systemMdl");
			if (oFile && oModel) {
				let oData = oModel.getData();
				let mimeType = oEvent.getParameter('files')[0].type
				let base64File = await this.fileReader(oFile, 'url');
				oData.companyLogo = base64File;
				oModel.refresh();
			}
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
		onPressCancel() {
			this.errorPopoverParams();
            // this.clearInputFields();
            if (sPreviousHash && sPreviousHash.includes("system_details")) {
                this.oRouter.navTo("system_details", { layout: "OneColumn" });
            } else {
                window.history.go(-1);//Other screen navigations
            }
		},
		dummyData() {
			return [

				{
					"id": "MS001",
					"name": "System1",
					"description": "Manage System",
					"macaddress": "00-09-6B-F2-53-AE",
					"company": 1,
					"companyLogo": "./images/no-preview.jpg",
					"configuration": 1,
					"salesOrg": 1,
					"salesoffice": 1,
					"createdAt": "28-09-2013 09:57:19",
					"updatedAt": "29-09-2013 09:57:19",
					"createdBy": "admin",
					"updatedBy": "",
					"status": 2,
					"users": [
						{
							"id": "100US",
							"name": "John Doe",
							"email": "john@example.com",
							"username": "johndoe",
							"userType": "Admin",
							"status": "Active"
						},
						{
							"id": "200US",
							"name": "Jane Smith",
							"email": "jane@example.com",
							"username": "janesmith",
							"userType": "View",
							"status": "Inactive"
						}

					]


				},
				{
					"id": "MS002",
					"name": "System2",
					"description": "Test Manage System",
					"macaddress": "00-09-6B-F2-54-AE",
					"company": 1,
					"companyLogo": "./images/no-preview.jpg",
					"configuration": 2,
					"salesOrg": 2,
					"salesoffice": 2,
					"createdAt": "28-09-2013 09:57:19",
					"updatedAt": "29-09-2013 09:57:19",
					"createdBy": "admin",
					"updatedBy": "",
					"status": 3,
					"user": [
						{
							"id": "200US",
							"name": "Jane Smith",
							"email": "jane@example.com",
							"username": "janesmith",
							"userType": "View",
							"status": "Inactive"
						}
					]

				}

			]
		},
		handleFullScreen() {
			//let sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.oRouter.navTo("system_detail", { layout: "MidColumnFullScreen", id: this._item });
		},

		handleExitFullScreen() {
			//let sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
			this.oRouter.navTo("system_detail", { layout: "TwoColumnsMidExpanded", id: this._item });
		},

		handleClose() {
			this.errorPopoverParams();
            // this.clearInputFields();
            if (sPreviousHash && sPreviousHash.includes("system_details")) {
                this.oRouter.navTo("system_details", { layout: "OneColumn" });
            } else {
                window.history.go(-1);//Other screen navigations
            }
		},

		onExit() {
			this.oRouter.getRoute("manage_system").detachPatternMatched(this._onRouteMatched, this);
			this.oRouter.getRoute("system_detail").detachPatternMatched(this._onRouteMatched, this);
		},
		onPressSave: function () {
            this.errorPopoverParams();
            ErrorMessage.formValidation([this.formId], this.eMdl, this.pageId);

            let valid = this.eMdl.getData();
            console.log("Validation results:", valid); // Log validation results

            if (valid.length == 0) {
				MessageBox.success(this.getResourceProperty("msg_success"), {
                    actions:[MessageBox.Action.OK],
				});
            } else {
                this.errorHandling();
            }
        },
       
		onAddNav: function () {
			this.oRouter.navTo("create_user", { layout: "TwoColumnsMidExpanded" });
		},
		onSearch: function (oEvent) {
			let oSource = oEvent.getSource();
			// Build filter array
			let aFilters = [];
			const sQuery = oSource.getValue().toLowerCase();

			if (sQuery) {


				// Filtering for the main object properties
				aFilters.push(new sap.ui.model.Filter({
					filters: [
						new sap.ui.model.Filter("id", sap.ui.model.FilterOperator.EQ, sQuery),
						new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.EQ, sQuery),
						new sap.ui.model.Filter("email", sap.ui.model.FilterOperator.EQ, sQuery),
						new sap.ui.model.Filter("username", sap.ui.model.FilterOperator.EQ, sQuery),
						new sap.ui.model.Filter("userType", sap.ui.model.FilterOperator.EQ, sQuery),
						new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, sQuery.search("inactive") ? 3 : sQuery.search("active") ? 2 : null)
					],
					and: false
				}));
			}
			// Update list binding
			let oList = this.byId("id_UserTable");
			let oBinding = oList.getBinding("items");
			oBinding.filter(aFilters, "Application");
		},

		onSearchStatus: function (oEvent) {
			const oComboBox = oEvent.getSource();
			const selectedKey = oComboBox.getSelectedKey();

			let aFilters = [];

			if (selectedKey) {
				switch (selectedKey) {
					case "1": // Draft
						aFilters.push(new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "Draft"));
						break;
					case "2": // Active
						aFilters.push(new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "Active"));
						break;
					case "3": // Inactive
						aFilters.push(new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "Inactive"));
						break;
					case "4": // All

						break;
					default:
						break;
				}
			}
			let oList = this.byId("id_UserTable");
			let oBinding = oList.getBinding("items");
			oBinding.filter(aFilters, "Application");
		},
		
	});
});
