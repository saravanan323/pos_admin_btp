sap.ui.define([
	"com/posadminbtp/initial/BaseController",
	"sap/ui/model/json/JSONModel",
	"com/posadminbtp/utils/URLConstants",
	'com/posadminbtp/utils/ErrorMessage',
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"com/posadminbtp/utils/Formatter"
], function (
	BaseController, JSONModel, URLConstants, ErrorMessage, MessageBox, MessageToast, Filter, FilterOperator, Formatter
) {
	"use strict";

	return BaseController.extend("com.posadminbtp.configuration.ConfigurationDetail", {

		onInit() {
			this.oOwnerComponent = this.getOwnerComponent();

			this.oRouter = this.oOwnerComponent.getRouter();
			this.oModel = this.oOwnerComponent.getModel();

			this.oRouter.getRoute("manage_configurations").attachPatternMatched(this._onRouteMatched, this);
			this.oRouter.getRoute("configuration_detail").attachPatternMatched(this._onRouteMatched, this);
			this.oTable = this.byId("id_SystemTable");


			let oSource = ((sId) => this.getView().byId(sId));
			[this.formId, this.pageId, this.popoverBtn] = [oSource('sfConfigGen'), oSource('oplConfigDetail'), oSource('errorBtnEditConfig')]
		},
		_onRouteMatched(oEvent) {
			this._item = oEvent.getParameter("arguments").id || 0;
			this.errorPopoverParams();
			let settingsMdl = this.oOwnerComponent.getModel("settings");
			let settingData = settingsMdl.getData();
			settingData.genericTitle = "Configurations";
			settingsMdl.refresh();
			

            // Set visibility model
            let visibleData = {
                edit: false,
                view: true
            };
            this.getView().setModel(new JSONModel(visibleData), "visible");

          
			this.setData(this._item)
			var setDataModel = {
				Status: [
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
				systemType: [
					{ key: "1", text: "Production" },
					{ key: "2", text: "Test" }
				],
				type: [
					{ key: "1", text: "SAP S4/HANA Cloud" },
					{ key: "2", text: "SAP S4/HANA On-premise" },
					{ key: "3", text: "SAP Business ByDesign" },
					{ key: "4", text: "SAP Business One" }
				]
			};


			this.getView().setModel(new JSONModel(setDataModel), "masterdataMdl");

			// this.setUpModel();

		},
		onListItemPress(oEvent) {
            let systemCtxt = oEvent.getSource().getSelectedItem().getBindingContext('configurationMdl');
            let system = systemCtxt.getObject();
            let oSettingsModel = this.oOwnerComponent.getModel('settings');
            oSettingsModel.setProperty("/navigatedItem", system.id);
            this.oRouter.navTo("system_detail", { layout: "TwoColumnsMidExpanded", id: system.id });
        },

		errorPopoverParams: function () {
			//******Set Initially Empty Error Mdl******
			this.eMdl = this.getOwnerComponent().getModel('errors');
			ErrorMessage.removeValueState([this.formId], this.eMdl);
			this.eMdl.setData([]);
		},
		setData(id) {
			let config;
			if (id) {
				let data = this.dummyData();
				config = data.find(e => e.id == id);

				// Check if config exists and modify system status to Active if not set
				if (config && config.system) {
					config.system.forEach(system => {
						if (system.status === undefined || system.status === null) {
							system.status = "Active";
						}
					});
				}

				// Set default status for masterItems if undefined

			}
			this.getView().setModel(new JSONModel(config), "configurationMdl");

			// Now, filter the table to show only Active rows
			const oTable = this.byId("id_SystemTable");
			const oBinding = oTable.getBinding("items");
			const aFilters = [
				new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "Active")
			];
			oBinding.filter(aFilters, "Application");
		},

		onPressEdit() {
			let vModel = this.getView().getModel("visible");
			if (vModel) {
				let vData = vModel.getData();
				vData.edit = !vData.edit;
				vData.view = !vData.view;
				vModel.refresh();
			}
		},
		onPressCancel() {
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
			this.errorPopoverParams();
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


		handleFullScreen() {
			//var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.oRouter.navTo("configuration_detail", { layout: "MidColumnFullScreen", id: this._item });
		},
		handleExitFullScreen() {
			//var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
			this.oRouter.navTo("configuration_detail", { layout: "TwoColumnsMidExpanded", id: this._item });
		},

		handleClose() {
			// var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
			this.oRouter.navTo("manage_configurations", { layout: "OneColumn" });
		},

		onExit() {
			this.oRouter.getRoute("manage_configurations").detachPatternMatched(this._onRouteMatched, this);
			this.oRouter.getRoute("configuration_detail").detachPatternMatched(this._onRouteMatched, this);
		},
		dummyData() {
			return [
				{
					"id": "12345",
					"name": "Sample Service",
					"type": 1,
					"endpoint": "https://api.sample.com",
					"username": "sampleUser",
					"password": "p@ssw0rd!",
					"connectionStateColor": null,
					"connectionStateIcon": null,
					"systemType": 1,
					"createdAt": "2023-10-15T10:30:00Z",
					"updatedAt": "2024-10-16T15:45:00Z",
					"status": 2,
					"system": [
						{
							"id": "MS001",
							"name": "System1",
							"macAddress": "00-09-6B-F2-53-AE",
							"company": "ITFZ_inflexion",
							"salesOffice": "Oman",
							"status": "Active",

						},
						{
							"id": "MS002",
							"name": "System2",
							"macAddress": "00-09-6B-F2-54-AE",
							"company": "ITFZ_inflexion",
							"salesOffice": "Bengaluru",
							"status": "Inactive",

						}

					]
				},
				{
					"id": "23456",
					"name": "User Management Service",
					"type": 1,
					"endpoint": "https://api.usermanagement.com",
					"username": "adminUser",
					"password": "adminPass123",
					"connectionStateColor": null,
					"connectionStateIcon": null,
					"systemType": 1,
					"createdAt": "2023-08-01T09:00:00Z",
					"updatedAt": "2024-09-10T14:00:00Z",
					"status": 2,
					"system": [
						{
							"id": "MS002",
							"name": "System2",
							"macAddress": "00-09-6B-F2-54-AE",
							"company": "ITFZ_inflexion",
							"salesOffice": "Bengaluru",
							"status": "Inactive",

						}
					]
				},
				{
					"id": "34567",
					"name": "Payment Gateway",
					"endpoint": "https://api.paymentgateway.com",
					"connectionStateColor": null,
					"connectionStateIcon": null,
					"systemType": 3,
					"username": "paymentUser",
					"password": "apikey1234",
					"type": 3,
					"createdAt": "2022-12-12T12:12:12Z",
					"updatedAt": "2024-08-25T08:20:00Z",
					"status": 3
				},
				{
					"id": "45678",
					"name": "Notification Service",
					"endpoint": "https://api.notificationservice.com",
					"connectionStateColor": null,
					"connectionStateIcon": null,
					"systemType": 1,
					"username": "notifyUser",
					"password": "notifyPass456",
					"type": 4,
					"createdAt": "2024-01-05T10:00:00Z",
					"updatedAt": "2024-10-14T17:30:00Z",
					"status": 1
				},
				{
					"id": "56789",
					"name": "Order Management Service",
					"endpoint": "https://api.ordermanagement.com",
					"connectionStateColor": null,
					"connectionStateIcon": null,
					"systemType": 2,
					"username": "orderAdmin",
					"password": "orderPass789",
					"type": 1,
					"createdAt": "2023-04-20T15:45:00Z",
					"updatedAt": "2024-09-30T11:00:00Z",
					"status": 2
				}
			]
		},

		onNavAdd: function () {
			this.oRouter.navTo("create_system", { layout: "TwoColumnsMidExpanded" });
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
						new sap.ui.model.Filter("id", sap.ui.model.FilterOperator.Contains, sQuery),
						new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains, sQuery),
						new sap.ui.model.Filter("company", sap.ui.model.FilterOperator.Contains, sQuery),
						new sap.ui.model.Filter("macAddress", sap.ui.model.FilterOperator.Contains, sQuery),
						new sap.ui.model.Filter("salesOffice", sap.ui.model.FilterOperator.Contains, sQuery),
						// new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, sQuery.search("inactive") ? 3 : sQuery.search("active") ? 2 : null)

					],
					and: false
				}));


			}

			// Update list binding
			var oList = this.byId("id_SystemTable");
			var oBinding = oList.getBinding("items");
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

			var oList = this.byId("id_SystemTable");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilters, "Application");
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
