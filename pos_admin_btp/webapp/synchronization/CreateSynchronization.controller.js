sap.ui.define(
	[
		"com/posadminbtp/initial/BaseController",
		"sap/ui/model/json/JSONModel",
		"com/posadminbtp/utils/URLConstants",
		"com/posadminbtp/utils/ErrorMessage",
		"sap/m/MessageBox",
		"sap/m/MessageToast",
	],
	function (
		BaseController,
		JSONModel,
		URLConstants,
		ErrorMessage,
		MessageBox,
		MessageToast,
	) {
		"use strict";

		return BaseController.extend(
			"com.posadminbtp.synchronization.CreateSynchronization",
			{
				onInit: function () {
					this.oOwnerComponent = this.getOwnerComponent();

					this.oRouter = this.oOwnerComponent.getRouter();
					this.oModel = this.oOwnerComponent.getModel();

					this.oRouter
						.getRoute("manage_synchronization")
						.attachPatternMatched(this._onRouteMatched, this);
					this.oRouter
						.getRoute("create_synchronization")
						.attachPatternMatched(this._onRouteMatched, this);

					let oSource = (sId) => this.getView().byId(sId);
					[this.formId, this.pageId, this.popoverBtn, this.oMasterTable] = [
						oSource("sfGeneral"),
						oSource("oplCreateSynchPage"),
						oSource("errorBtnCreateSync"),
						oSource("tableMasterData"),
					];
				},
				_onRouteMatched: function (oEvent) {
					this._product = oEvent.getParameter("arguments").id || 0;

					let settingsMdl = this.oOwnerComponent.getModel("settings");
					let settingData = settingsMdl.getData();
					settingData.genericTitle = "Synchronization";
					settingsMdl.refresh();

					this.setData();
					var setDataModel = {
						system: [
							{ key: "1", text: "SAP S4/HANA Cloud" },
							{ key: "2", text: "SAP S4/HANA On-premise" },
							{ key: "3", text: "SAP Business ByDesign" },
							{ key: "4", text: "SAP Business One" },
						],
						Status: [
							{ key: "1", text: "Draft" },
							{ key: "2", text: "Active" },
							{ key: "3", text: "Inactive" },
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
				setData() {
					let data = {
						name: null,
						system: null,
						createdAt: null,
						updatedAt: null,
						status: 2,
						masterItems: [],
						masterList: [
							{
								key: 1,
								text: "Material",
							},
							{
								key: 2,
								text: "Customer",
							},
							{
								key: 3,
								text: "Price List",
							},
						],
						masterStatus: [
							{
								key: 1,
								text: "Synchronized",
							},
							{
								key: 2,
								text: "Processing",
							},
							{
								key: 3,
								text: "Pending",
							},
							{
								key: 4,
								text: "Failed",
							},
						],
					};
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
						let selObject = oItem
							.getBindingContext("synchronizationMdl")
							.getObject();
						let selRowObject = oSource
							.getParent()
							.getBindingContext("synchronizationMdl")
							.getObject();

						let masterItems = oModel.getData().masterItems;
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
				onPressCheckConnectionIndividual(oEvent) {
					// Check the selected row contained URL
					let oSource = oEvent.getSource();
					let oSelBindingCtx = oSource.getBindingContext("synchronizationMdl");
					let oCtxModel = oSelBindingCtx.getModel();
					let oSelObj = oSelBindingCtx.getObject();
					let failedIcon = "sap-icon://sys-cancel-2";
					let successIcon = "sap-icon://sys-enter-2";
					oSource.setBusy(true);
					setTimeout(() => {
						oSource.setBusy(false);
						if (oSelObj.url) {
							oSelObj.urlValueState = "None";
							oSelObj.urlStateIcon = successIcon;
							oSelObj.urlStateColor = "green";
						} else {
							oSelObj.urlValueState = "Error";
							oSelObj.urlStateIcon = failedIcon;
							oSelObj.urlStateColor = "red";
						}
						oCtxModel.refresh();
					}, 2000);
				},
				onPressCheckConnectionAll() {
					// Check all the table contained URL's
					let oModel = this.getView().getModel("synchronizationMdl");
					this.oMasterTable.setBusy(true);
					if (oModel) {
						let masterData = oModel.getData().masterItems;
						setTimeout(() => {
							masterData.forEach((e) => {
								if (e.url && e.url.length > 0) {
									e.urlValueState = "None";
									e.urlStateIcon = "sap-icon://sys-enter-2";
									e.urlStateColor = "green";
								} else {
									e.urlValueState = "Error";
									e.urlStateIcon = "sap-icon://sys-cancel-2";
									e.urlStateColor = "red";
								}
							});
							this.oMasterTable.setBusy(false);
							oModel.refresh();
						}, 2000);
					}
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
				onSuccessMessage() {
					if (MessageBox) {
						// Check if MessageBox is defined
						MessageBox.success("Saved successfully!", {
							actions: ["OK", MessageBox.Action.CLOSE],
							emphasizedAction: "OK",
						});
					} else {
						console.error("MessageBox is not defined!");
					}
				},
				onPressCancel: function () {
					this.oRouter.navTo("manage_synchronization", { layout: "OneColumn" });
				},
				handleFullScreen: function () {
					//var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
					this.oRouter.navTo("create_synchronization", {
						layout: "MidColumnFullScreen",
					});
				},

				handleExitFullScreen: function () {
					//var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
					this.oRouter.navTo("create_synchronization", {
						layout: "TwoColumnsMidExpanded",
					});
				},

				handleClose: function () {
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
			},
		);
	},
);
