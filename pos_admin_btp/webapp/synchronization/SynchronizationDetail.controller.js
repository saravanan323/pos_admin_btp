sap.ui.define(
	[
		"com/posadminbtp/initial/BaseController",
		"sap/ui/model/json/JSONModel",
		"com/posadminbtp/utils/URLConstants",
		"com/posadminbtp/utils/ErrorMessage",
		"sap/m/MessageBox",
		"sap/m/MessageToast",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"com/posadminbtp/utils/Formatter",
	],
	function (
		BaseController,
		JSONModel,
		URLConstants,
		ErrorMessage,
		MessageBox,
		MessageToast,
		Filter,
		FilterOperator,
		Formatter,
	) {
		"use strict";

		return BaseController.extend(
			"com.posadminbtp.synchronization.SynchronizationDetail",
			{
				onInit: function () {
					this.oOwnerComponent = this.getOwnerComponent();

					this.oRouter = this.oOwnerComponent.getRouter();
					this.oModel = this.oOwnerComponent.getModel();

					this.oRouter
						.getRoute("manage_synchronization")
						.attachPatternMatched(this._onRouteMatched, this);
					this.oRouter
						.getRoute("synchronization_detail")
						.attachPatternMatched(this._onRouteMatched, this);

					let oSource = (sId) => this.getView().byId(sId);
					[this.formId, this.pageId, this.popoverBtn, this.oMasterTable] = [
						oSource("sfConfigGen"),
						oSource("oplConfigDetail"),
						oSource("errorBtnEditConfig"),
						oSource("tableMasterData"),
					];
				},
				_onRouteMatched(oEvent) {
					this._item = oEvent.getParameter("arguments").id || 0;

					let settingsMdl = this.oOwnerComponent.getModel("settings");
					let settingData = settingsMdl.getData();
					settingData.genericTitle = "Synchronizations";
					settingsMdl.refresh();

					this.errorPopoverParams();

					let visibleData = {
						edit: false,
						view: true,
					};
					this.getView().setModel(new JSONModel(visibleData), "visible");

					this.setData(this._item);

					var setDataModel = {
						system: [
							{ key: "1", text: "SAP S4/HANA Cloud" },
							{ key: "2", text: "SAP S4/HANA On-premise" },
							{ key: "3", text: "SAP Business ByDesign" },
							{ key: "4", text: "SAP Business One" },
						],
						Status: [
							{ key: "1", text: "Synchronized" },
							{ key: "2", text: "Processing" },
							{ key: "3", text: "Pending" },
							{ key: "4", text: "Failed" },
						],
						status: [
							{ key: "1", text: "Synchronized" },
							{ key: "2", text: "Processing" },
							{ key: "3", text: "Pending" },
							{ key: "4", text: "Failed" },
							{ key: "5", text: "All" },
						],
					};

					this.getView().setModel(new JSONModel(setDataModel), "masterdataMdl");
				},
				errorPopoverParams: function () {
					//******Set Initially Empty Error Mdl******
					this.eMdl = this.getOwnerComponent().getModel("errors");
					ErrorMessage.removeValueState([this.formId], this.eMdl);
					this.eMdl.setData([]);
				},
				setData(id) {
					let data;
					if (id) {
						let dummyData = this.dummyData();
						data = dummyData.find((e) => e.id == id);

						// Define master lists
						data.masterList = [
							{ key: 1, text: "Material" },
							{ key: 2, text: "Customer" },
							{ key: 3, text: "Price List" },
						];

						data.masterStatus = [
							{ key: 1, text: "Synchronized" },
							{ key: 2, text: "Processing" },
							{ key: 3, text: "Pending" },
							{ key: 4, text: "Failed" },
							{ key: 5, text: "All" },
						];

						// Set default status for masterItems if undefined
						if (data && data.masterItems) {
							data.masterItems.forEach((masterItem) => {
								if (
									masterItem.status === undefined ||
									masterItem.status === null
								) {
									masterItem.status = 1; // Default status if not defined
								}
							});
						}
					}

					// Set the model with the prepared data
					this.getView().setModel(new JSONModel(data), "synchronizationMdl");
				},

				onAddMaster() {
					let oModel = this.getView().getModel("synchronizationMdl");
					let emptyObject = {
						id: null,
						master: null,
						url: null,
						urlStateIcon: "",
						urlValueState: "None",
						urlStateColor: "blue",
						syncType: true,
						status: 3,
					};
					if (oModel) {
						let oData = oModel.getData();
						if (oData.masterItems) {
							let valid = oData.masterItems.every((e) => e.master); // checking empty master values
							let sortIds = JSON.parse(JSON.stringify(oData.masterItems)).sort(
								(a, b) => b.id - a.id,
							); // sorting for auto increase id value

							if (sortIds && sortIds.length > 0) {
								//increamenting id
								emptyObject.id = parseInt(sortIds[0]?.id) + 1;
							} else {
								emptyObject.id = 1;
							}
							if (valid) {
								if (oData.masterItems) {
									//adding master empty master item
									oData.masterItems.push(emptyObject);
								} else {
									oData.masterItems = [emptyObject];
								}
							} else {
								MessageBox.error("Please fill the exisitng rows!"); // throwing error before adding item any empty row is there means
							}
							oData.masterItems.forEach((e) => (e.masterValueState = "None")); // remove value state for master combobox
						}
						oModel.refresh(true);
					}
				},
				onRemoveMaster(oEvent) {
					let oItem = oEvent.getParameter("listItem");
					let index = oEvent.getParameter("listItem").getId()[
						oItem.getId().length - 1
					];
					let oModel = this.getView().getModel("synchronizationMdl");
					if (oModel) {
						let oData = oModel.getData();
						oData.masterItems.splice(index, 1);
						oModel.refresh(true);
					}
				},
				onChangeMaster(oEvent) {
					let oItem = oEvent.getParameter("selectedItem");
					let oSource = oEvent.getSource();
					let oModel = this.getView().getModel("synchronizationMdl");
					if (oItem) {
						let selObject = oItem.getBindingContext("synchronizationMdl").getObject();
						let selRowObject = oSource.getParent().getBindingContext("synchronizationMdl").getObject();
						let masterItems = oModel.getData().masterItems;

						//Duplication master selection validation
						let duplicate = masterItems.filter(
							(e) => e.master == selObject.key && selRowObject.id != e.id,
						);
						if (duplicate.length > 0) {
							oSource.setValueState("Error");
							oSource.setValueStateText("This master already exist!");
						} else {
							oSource.setValueState("None");
						}
					}
				},
				onPressSyncAll() {
					let oTable = this.oMasterTable;
					let oModel = this.getView().getModel("synchronizationMdl");
					if (oModel) {
						let syncData = oModel.getData();
						if (oTable) {
							oTable.setBusy(true);
							syncData.masterItems.forEach((e) => {
								e.lastSync = new Date().toUTCString();
							});
							setTimeout(() => {
								oTable.setBusy(false);

								syncData.masterItems.forEach(e => {
									let isUrlValid = Boolean(e.url);

									// Retrieve master name from the master list
									let masterName = syncData.masterList.find((item) => item.key === e.master,)?.text || null;

									// Prepare log template
									let logEntry = {
										title: null,
										master: masterName,
										description: isUrlValid ? `${masterName} is synchronized.` : "Invalid Master",
										lastSync: new Date().toUTCString(),
										status: isUrlValid ? 1 : 2,
									};

									// Update log entry based on the result
									logEntry.title = isUrlValid ? "Successfully Synchronized!" : "Synchronization Failed!";

									// Append log entry and refresh model
									syncData.logs.push(logEntry);
								});

								oModel.refresh(true);

							}, 3000);
						}
					}
				},
				onPressSyncInidvidual(oEvent) {
					let oTable = this.oMasterTable;
					let oButton = oEvent.getSource();
					let syncModel = this.getView().getModel("synchronizationMdl");

					if (oTable && syncModel) {
						let syncData = syncModel.getData();
						let selectedContext = oButton.getBindingContext("synchronizationMdl");
						let selectedObject = selectedContext.getObject();

						oTable.setBusy(true);
						setTimeout(() => {
							oTable.setBusy(false);
							let isUrlValid = Boolean(selectedObject.url);
							// Retrieve master name from the master list
							let masterName = syncData.masterList.find((item) => item.key === selectedObject.master,)?.text || null;
							// Prepare log template
							let logEntry = {
								title: null,
								master: masterName,
								description: isUrlValid ? `${masterName} is synchronized.` : "Invalid Master",
								lastSync: new Date().toUTCString(),
								status: isUrlValid ? 1 : 2,
							};

							// Update log entry based on the result
							logEntry.title = isUrlValid ? "Successfully Synchronized!" : "Synchronization Failed!";

							// Append log entry and refresh model
							syncData.logs.push(logEntry);
							syncModel.refresh(true);
						}, 3000);
					}
				},
				async onPressCheckConnectionIndividual(oEvent) {
					// Check the row individual connection 
					let oButton = oEvent.getSource();
					let syncModel = this.getView().getModel("synchronizationMdl");
					if (syncModel) {
						let syncData = syncModel.getData();
						let selectedContext = oButton.getBindingContext("synchronizationMdl");
						let selectedObject = selectedContext.getObject();

						// Icons and Colors for connection status
						const ICONS = {
							success: "sap-icon://sys-enter-2",
							failure: "sap-icon://sys-cancel-2",
						};
						const COLORS = {
							success: "green",
							failure: "red",
						};

						// Retrieve master name from the master list
						let masterName =
							syncData.masterList.find((item) => item.key === selectedObject.master,)?.text || null;

						// Set button busy state while processing
						oButton.setBusy(true);

						// Simulate a check operation with a timeout
						setTimeout(async () => {
							oButton.setBusy(false);
							let isUrlValid = await this.checkConnection();

							// Prepare log template
							let logEntry = {
								title: null,
								master: masterName,
								description: isUrlValid ? `${masterName} URL authenticated.` : "Invalid URL",
								lastSync: new Date().toUTCString(),
								status: isUrlValid ? 1 : 2,
							};

							// Update selectedObject based on URL existence
							Object.assign(selectedObject, {
								urlValueState: isUrlValid ? "None" : "Error",
								urlStateIcon: isUrlValid ? ICONS.success : ICONS.failure,
								urlStateColor: isUrlValid ? COLORS.success : COLORS.failure,
							});

							// Update log entry based on the result
							logEntry.title = isUrlValid ? "Successfully Authenticated!" : "Authentication Failed!";

							// Append log entry and refresh model
							syncData.logs.push(logEntry);
							syncModel.refresh(true);
						}, 2000);
					}
				},
				onPressCheckConnectionAll() {
					// Check all the table contained Connection's
					let oModel = this.getView().getModel("synchronizationMdl");
					let syncData = oModel.getData();

					this.oMasterTable.setBusy(true);

					if (oModel) {
						let masterData = syncData.masterItems;
						setTimeout(() => {
							masterData.forEach((e) => {
								let isUrlValid = Boolean(e.url);
								// Retrieve master name from the master list
								let masterName = syncData.masterList.find((item) => item.key === e.master,)?.text || null;
								if (isUrlValid) {
									e.urlValueState = "None";
									e.urlStateIcon = "sap-icon://sys-enter-2";
									e.urlStateColor = "green";
								} else {
									e.urlValueState = "Error";
									e.urlStateIcon = "sap-icon://sys-cancel-2";
									e.urlStateColor = "red";
								}

								// Prepare log template
								let logEntry = {
									title: null,
									master: masterName,
									description: isUrlValid ? `${masterName} URL authenticated.` : "Invalid URL",
									lastSync: new Date().toUTCString(),
									status: isUrlValid ? 1 : 2,
								};

								// Update log entry based on the result
								logEntry.title = isUrlValid ? "Successfully Authenticated!" : "Authentication Failed!";

								// Append log entry and refresh model
								syncData.logs.push(logEntry);
							});

							this.oMasterTable.setBusy(false);

							oModel.refresh(true);

						}, 2000);
					}
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
							view: !vData.view,
						});
						vModel.refresh(true);
						this.setData(this._item);
					}
					this.errorPopoverParams();
				},
				masterStatusFormatter(value) {
					switch (value) {
						case 1:
							return "Synchronized";
							break;
						case 2:
							return "Processing";
							break;
						case 3:
							return "Pending";
							break;
						case 4:
							return "Failed";
							break;
						default:
							return null;
							break;
					}
				},
				masterStatusStateFormatter(value) {
					switch (value) {
						case 1:
							return "Success";
							break;
						case 2:
							return "Warning";
							break;
						case 3:
							return "None";
							break;
						case 4:
							return "Error";
							break;
						default:
							return null;
							break;
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
						this.errorHandling(null);
					}
				},

				onSuccessMessage: function () {
					if (MessageBox) {
						// Check if MessageBox is defined
						MessageBox.success("Updated successfully!", {
							actions: ["OK", MessageBox.Action.CLOSE],
							emphasizedAction: "OK",
						});
					} else {
						console.error("MessageBox is not defined!");
					}
				},

				handleFullScreen() {
					//var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
					this.oRouter.navTo("synchronization_detail", {
						layout: "MidColumnFullScreen",
						id: this._item,
					});
				},
				handleExitFullScreen() {
					//var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
					this.oRouter.navTo("synchronization_detail", {
						layout: "TwoColumnsMidExpanded",
						id: this._item,
					});
				},

				handleClose() {
					// var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
					this.oRouter.navTo("manage_synchronization", { layout: "OneColumn" });
				},

				onExit: function () {
					this.oRouter
						.getRoute("manage_synchronization")
						.detachPatternMatched(this._onRouteMatched, this);
					this.oRouter
						.getRoute("synchronization_detail")
						.detachPatternMatched(this._onRouteMatched, this);
				},
				dummyData() {
					return [
						{
							id: "001",
							name: "Customer",
							system: 1,
							createdAt: "2024-10-29T14:00:05",
							updatedAt: "2024-10-30T09:22:10",
							createdBy: "admin",
							updatedBy: "",
							status: 2,
							masterItems: [
								{
									id: "103",
									master: 2,
									syncType: true,
									lastSync: new Date().toUTCString(),
									url: "northwind/northwind.svc/Customer",
									status: 1,
								},
								{
									id: "102",
									master: 1,
									syncType: false,
									lastSync: new Date().toUTCString(),
									url: "northwind/northwind.svc/Material",
									status: 3,
								},
							],
							logs: [
								{
									title: "Successfully synced!",
									master: "Material",
									description: "Material is synchronized.",
									lastSync: new Date().toUTCString(),
									status: 1,
								},
								{
									title: "Synchronization Failed!",
									master: "Customer",
									description: "Customer master failed.",
									lastSync: new Date().toUTCString(),
									status: 4,
								},
							],
						},
						{
							id: "002",
							name: "Material",
							system: 2,
							createdAt: "2024-10-28T17:18:30",
							updatedAt: "2024-10-30T09:25:40",
							createdBy: "jone",
							updatedBy: "",
							status: 3,
							masterItems: [
								{
									id: "103",
									master: 3,
									syncType: false,
									lastSync: new Date().toUTCString(),
									url: "northwind/northwind.svc/PriceList",
									status: 4,
								},
								{
									id: "104",
									master: 2,
									syncType: true,
									lastSync: new Date().toUTCString(),
									url: "northwind/northwind.svc/Customer",
									status: 1,
								},
								{
									id: "106",
									master: 1,
									syncType: false,
									lastSync: new Date().toUTCString(),
									url: "northwind/northwind.svc/Material",
									status: 2,
								},
							],
							logs: [
								{
									title: "Successfully Synchronized!",
									master: "Material",
									description: "Material is synchronized.",
									lastSync: new Date().toUTCString(),
									status: 1,
								},
								{
									title: "Synchronization Failed!",
									master: "Customer",
									description: "Customer master failed.",
									lastSync: new Date().toUTCString(),
									status: 4,
								},
								{
									title: "Successfully Synchronized!",
									master: "Price List",
									description: "Price List is synchronized.",
									lastSync: new Date().toUTCString(),
									status: 1,
								},
							],
						},
					];
				},

				onSearch: function (oEvent) {
					let oSource = oEvent.getSource();
					let aFilters = [];
					const sQuery = oSource.getValue().toLowerCase();

					if (sQuery) {
						// Prepare filters for main object properties
						aFilters.push(
							new sap.ui.model.Filter({
								filters: [
									new sap.ui.model.Filter(
										"id",
										sap.ui.model.FilterOperator.EQ,
										sQuery,
									),
									new sap.ui.model.Filter(
										"master",
										sap.ui.model.FilterOperator.EQ,
										("material".includes(sQuery) ? 1 : "customer".includes(sQuery) ? 2 : "price list".includes(sQuery) ? 3 : null),
									),
									new sap.ui.model.Filter(
										"syncType",
										sap.ui.model.FilterOperator.EQ,
										("online".includes(sQuery) ? 1 : "offline".includes(sQuery) ? 2 : null),
									),
									new sap.ui.model.Filter(
										"url",
										sap.ui.model.FilterOperator.Contains,
										sQuery,
									),
									new sap.ui.model.Filter( //To Do: Need to implement lastSync filter
										"lastSync",
										sap.ui.model.FilterOperator.Contains,
										sQuery,
									),
								],
								and: false,
							}),
						);
					}

					// Update list binding
					const oBinding = this.oMasterTable.getBinding("items");
					oBinding.filter(aFilters, "Application");
				},
				onSearchStatus: function (oEvent) {
					const selectedKey = oEvent.getSource().getSelectedKey();

					let aFilters = []; // Array to hold filters

					// Apply filter only if a valid status key is selected (1-4)
					if (selectedKey && selectedKey !== "5") {
						const statusFilter = new sap.ui.model.Filter(
							"status",
							sap.ui.model.FilterOperator.EQ,
							parseInt(selectedKey),
						);
						aFilters.push(statusFilter);
					}

					// Get the table and binding
					const oBinding = this.oMasterTable.getBinding("items");
					oBinding.filter(aFilters, "Application");
				},

				//API call for checking connection
				async checkConnection() {
					try {
						const path = URLConstants.URL.sync_check;
						let request = {
							url: "API_PRODUCT_SRV/A_Product"
						}
						let resStatus = await this.restMethodPost(path, request)
						if (resStatus.includes("200")) {
							return true;
						} else {
							return false;
						}
					} catch (ex) {
						this.errorHandling(ex)
					}
				}
			},
		);
	},
);
