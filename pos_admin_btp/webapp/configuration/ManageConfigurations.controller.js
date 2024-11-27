sap.ui.define([
	"com/posadminbtp/initial/BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/m/p13n/Engine',
	'sap/m/p13n/SelectionController',
	'sap/m/p13n/SortController',
	'sap/m/p13n/GroupController',
	'sap/m/p13n/FilterController',
	'sap/m/p13n/MetadataHelper',
	'sap/ui/model/Sorter',
	'sap/m/ColumnListItem',
	'sap/m/Text',
	'sap/ui/core/library',
	'sap/m/table/ColumnWidthController',
	'sap/ui/model/Filter',
	"sap/ui/model/FilterOperator",
	"com/posadminbtp/utils/URLConstants",
	"com/posadminbtp/utils/Formatter"
], function (BaseController, JSONModel, Engine, SelectionController, SortController, GroupController, FilterController, MetadataHelper, Sorter, ColumnListItem, Text, coreLibrary, ColumnWidthController, Filter, FilterOperator, URLConstants, Formatter) {
	"use strict";

	return BaseController.extend("com.posadminbtp.configuration.ManageConfigurations", {

		formatter: Formatter,

		onInit() {
			this.oOwnerComponent = this.getOwnerComponent();

			this.oRouter = this.oOwnerComponent.getRouter();
			this.oModel = this.oOwnerComponent.getModel();

			this.oRouter.getRoute("manage_configurations").attachPatternMatched(this._onRouteMatched, this);
			this.oRouter.getRoute("configuration_detail").attachPatternMatched(this._onRouteMatched, this);

			let oSource = ((sId) => this.getView().byId(sId));


			[this.oTable, this.oFilterBar] = [oSource('tableConfigurations'), oSource('fbConfigurations')];

			this.getView().setModel(new JSONModel(), 'filterMdl');
			this._defaultAFOption = [
				{ "ID": true },
				{ "Name": true },
				{ "Type": true },
				{ "Endpoint": true },
				{ "Username": false },
				{ "Password": false },
				{ "System Type": false },
				{ "Created At": false },
				{ "Created By": false },
				{ "Updated By": false },
				{ "Updated At": false },
				{ "Status": true },
			];


			let oModel = new JSONModel(
				[
					{
						"id": "12345",
						"name": "Sample Service",
						"type": 1,
						"endpoint": "https://api.sample.com",
						"username": "sampleUser",
						"password": "p@ssw0rd!",
						"systemType": 1,
						"createdAt": "2023-10-15T10:30:00Z",
						"updatedAt": "2024-10-16T15:45:00Z",
						"createdBy": "techAdmin1",
						"updatedBy": "techAdmin2",
						"status": 2,
						"system": [
							{
								"id": "MS001",
								"name": "System1",
								"macaddress": "00-09-6B-F2-53-AE",
								"company": "ITFZ_inflexion",
								"salesOrg": "Functional",
								"salesoffice": "Oman",
								"status": "Active",

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
						"systemType": 1,
						"createdAt": "2023-08-01T09:00:00Z",
						"updatedAt": "2024-09-10T14:00:00Z",
						"createdBy": "securityAdmin1",
						"updatedBy": "securityAdmin2",
						"status": 2,
						"system": [
							{
								"id": "MS002",
								"name": "System2",
								"macaddress": "00-09-6B-F2-54-AE",
								"company": "ITFZ_inflexion",
								"salesOrg": "Technical",
								"salesoffice": "Bengaluru",
								"status": "Inactive",

							}
						]
					},
					{
						"id": "34567",
						"name": "Payment Gateway",
						"type": 1,
						"endpoint": "https://api.paymentgateway.com",
						"username": "paymentUser",
						"password": "apikey1234",
						"systemType": 1,
						"createdAt": "2022-12-12T12:12:12Z",
						"updatedAt": "2024-08-25T08:20:00Z",
						"createdBy": "paymentAdmin1",
						"updatedBy": "paymentAdmin2",
						"status": 3
					},
					{
						"id": "45678",
						"name": "Notification Service",
						"type": 2,
						"endpoint": "https://api.notificationservice.com",
						"username": "notifyUser",
						"password": "notifyPass456",
						"systemType": 1,
						"createdAt": "2024-01-05T10:00:00Z",
						"updatedAt": "2024-10-14T17:30:00Z",
						"createdBy": "notificationAdmin1",
						"updatedBy": "notificationAdmin2",
						"status": 1
					},
					{
						"id": "56789",
						"name": "Order Management Service",
						"type": 2,
						"endpoint": "https://api.ordermanagement.com",
						"username": "orderAdmin",
						"password": "orderPass789",
						"systemType": 2,
						"createdAt": "2023-04-20T15:45:00Z",
						"updatedAt": "2024-09-30T11:00:00Z",
						"createdBy": "salesAdmin1",
						"updatedBy": "salesAdmin2",
						"status": 2
					}
				]);

			this.getView().setModel(oModel, "configurationsMdl");

			this._registerForP13n();
		},
		async _onRouteMatched(oEvent) {
			var setDataModel = {
				Status: [
					{ key: "1", text: "Draft" },
					{ key: "2", text: "Active" },
					{ key: "3", text: "Inactive" }
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
			this.onResetAdaptFilter(this.oFilterBar);


		},

		onExit() {
			this.oRouter.getRoute("manage_configurations").detachPatternMatched(this._onRouteMatched, this);
			this.oRouter.getRoute("configuration_detail").detachPatternMatched(this._onRouteMatched, this);
		},
		onCreateConfiguration() {
			this.oRouter.navTo("create_configuration", { layout: "TwoColumnsMidExpanded" });
		},
		onListItemPress(oEvent) {
			let configCtxt = oEvent.getSource().getSelectedItem().getBindingContext('configurationsMdl');
			let config = configCtxt.getObject();
			let oSettingsModel = this.oOwnerComponent.getModel('settings');
			oSettingsModel.setProperty("/navigatedItem", config.id);
			this.oRouter.navTo("configuration_detail", { layout: "TwoColumnsMidExpanded", id: config.id });
		},
		onSearch: function (oEvent) {
			let oModel = this.getView().getModel('filterMdl');
			let oData = oModel.getData();
			const aFilter = [];

			for (let [key, value] of Object.entries(oData)) {
				if (value) {
					if (Array.isArray(value)) {  // For fields with multiple values
						const multiFilters = [];
						value.forEach(e => {
							multiFilters.push(new Filter(key, FilterOperator.EQ, parseInt(e)));
						});
						// Group multiple filters for the same field using OR logic
						aFilter.push(new Filter({ filters: multiFilters, and: false }));
					} else {
						// Single value filter
						aFilter.push(new Filter(key, FilterOperator.Contains, value));
					}
				}
			}

			// Apply the filter to the table binding
			this.oTable.getBinding("items").filter(aFilter, "Application");
			this.oTable.setShowOverlay(false);

		},

		onClear() {
			this.getView().setModel(new JSONModel(), 'filterMdl');
		},

		typeFormatter(value) {
			let data = [{ key: "1", text: "SAP S4/HANA Cloud" },
			{ key: "2", text: "SAP S4/HANA On-premise" },
			{ key: "3", text: "SAP Business ByDesign" },
			{ key: "4", text: "SAP Business One" }]

			return data.find(e => e.key == value)?.text;
		},
		systemTypeFormatter(value) {
			let data = [{ key: "1", text: "Production" },
			{ key: "2", text: "Test" }]

			return data.find(e => e.key == value)?.text;
		},
		_registerForP13n() {
			const oTable = this.oTable;

			this.oMetadataHelper = new MetadataHelper(
				[
					{
						key: "id_col",
						label: "ID",
						path: "id"
					},
					{
						key: "name_col",
						label: "Name",
						path: "name"
					},
					{
						key: "type_col",
						label: "Type",
						path: "type"
					},
					{
						key: "end_point_col",
						label: "Endpoint",
						path: "endpoint"
					},
					{
						key: "username_col",
						label: "Username",
						path: "username"
					},
					{
						key: "password_col",
						label: "Password",
						path: "password"
					},
					{
						key: "system_type_col",
						label: "System Type",
						path: "systemType"
					},
					{
						key: "createdAt_col",
						label: "Created At",
						path: "createdAt"
					},
					{
						key: "createdBy_col",
						label: "Created By",
						path: "createdBy"
					},
					{
						key: "updatedAt_col",
						label: "Updated At",
						path: "updatedAt"
					},
					{
						key: "updatedBy_col",
						label: "Updated By",
						path: "updatedBy"
					},
					{
						key: "status_col",
						label: "Status",
						path: "status"
					}
				]);

			Engine.getInstance().register(oTable, {
				helper: this.oMetadataHelper,
				controller: {
					Columns: new SelectionController({
						targetAggregation: "columns",
						control: oTable
					}),
					Sorter: new SortController({
						control: oTable
					}),
					Groups: new GroupController({
						control: oTable
					}),
					ColumnWidth: new ColumnWidthController({
						control: oTable
					}),
					Filter: new FilterController({
						control: oTable
					})
				}
			});

			Engine.getInstance().attachStateChange(this.handleStateChange.bind(this));
		},
		openPersoDialog: function (oEvt) {
			this._openPersoDialog(["Columns", "Sorter", "Groups"], oEvt.getSource());
		},

		_openPersoDialog: function (aPanels, oSource) {
			var oTable = this.oTable;

			Engine.getInstance().show(oTable, aPanels, {
				contentHeight: aPanels.length > 1 ? "50rem" : "35rem",
				contentWidth: aPanels.length > 1 ? "45rem" : "32rem",
				source: oSource || oTable
			});
		},

		_getKey: function (oControl) {
			return oControl.data("p13nKey");
		},

		handleStateChange: function (oEvt) {
			const oTable = this.oTable;
			const oState = oEvt.getParameter("state");

			if (!oState) {
				return;
			}

			//Update the columns per selection in the state
			this.updateColumns(oState);

			//Create Filters & Sorters

			const aGroups = this.createGroups(oState);
			const aSorter = this.createSorters(oState, aGroups);

			let createCell = ((oColumnState, colPath) => {
				switch (oColumnState.key) {
					case 'status_col':
						return new sap.m.ObjectStatus({
							text: "{= ${" + colPath + "} === 2 ? 'Active' : ${" + colPath + "} === 3?'Inactive':'Draft'}",
							state: "{= ${" + colPath + "} === 2 ? 'Success' : ${" + colPath + "} === 3?'Error':'None'}"
						});
					case 'type_col':
						return new sap.m.Text({
							text: { path: colPath, formatter: this.typeFormatter.bind(this) }
						});
					case 'system_type_col':
						return new sap.m.Text({
							text: { path: colPath, formatter: this.systemTypeFormatter.bind(this) }
						});
					case 'password_col':
						return new sap.m.Text({
							text: "{" + colPath + "}"
						}).addStyleClass("hidePasswordInTextField");
					case 'createdAt_col':
					case 'updatedAt_col':
						return new sap.m.Text({
							text: {
								parts: [{ path: '/userSettings/dateTimeFormatKey' }, { path: colPath }],
								formatter: this.getDateTimeFormats.bind(this)
							}
						});
					default:
						return new sap.m.Text({ text: "{" + colPath + "}" });
				}
			})

			const aCells = oState.Columns.map(function (oColumnState) {
				const colPath = 'configurationsMdl>' + this.oMetadataHelper.getProperty(oColumnState.key).path;
				return createCell(oColumnState, colPath);
			}.bind(this));

			//rebind the table with the updated cell template
			oTable.bindItems({
				templateShareable: false,
				path: 'configurationsMdl>/',
				sorter: aSorter.concat(aGroups),
				template: new ColumnListItem({
					cells: aCells,
					type: 'Navigation'
				})
			});

		},
		createSorters: function (oState, aExistingSorter) {
			const aSorter = aExistingSorter || [];
			oState.Sorter.forEach(function (oSorter) {
				const oExistingSorter = aSorter.find(function (oSort) {
					return oSort.sPath === this.oMetadataHelper.getProperty(oSorter.key).path;
				}.bind(this));

				if (oExistingSorter) {
					oExistingSorter.bDescending = !!oSorter.descending;
				} else {
					aSorter.push(new Sorter(this.oMetadataHelper.getProperty(oSorter.key).path, oSorter.descending));
				}
			}.bind(this));

			oState.Sorter.forEach((oSorter) => {
				const oCol = this.oTable.getColumns().find((oColumn) => oColumn.data("p13nKey") === oSorter.key);
				if (oSorter.sorted !== false) {
					oCol.setSortIndicator(oSorter.descending ? coreLibrary.SortOrder.Descending : coreLibrary.SortOrder.Ascending);
				}
			});

			return aSorter;
		},

		createGroups: function (oState) {
			const aGroupings = [];
			oState.Groups.forEach(function (oGroup) {
				aGroupings.push(new Sorter(this.oMetadataHelper.getProperty(oGroup.key).path, false, true));
			}.bind(this));

			oState.Groups.forEach((oSorter) => {
				const oCol = this.oTable.getColumns().find((oColumn) => oColumn.data("p13nKey") === oSorter.key);
				oCol.data("grouped", true);
			});

			return aGroupings;
		},

		updateColumns: function (oState) {
			const oTable = this.oTable;

			oTable.getColumns().forEach((oColumn, iIndex) => {
				oColumn.setVisible(false);
				oColumn.setWidth(oState.ColumnWidth[this._getKey(oColumn)]);
				oColumn.setSortIndicator(coreLibrary.SortOrder.None);
				oColumn.data("grouped", false);
			});

			oState.Columns.forEach((oProp, iIndex) => {
				const oCol = oTable.getColumns().find((oColumn) => oColumn.data("p13nKey") === oProp.key);
				oCol.setVisible(true);

				oTable.removeColumn(oCol);
				oTable.insertColumn(oCol, iIndex);
			});
		},

		beforeOpenColumnMenu: function (oEvt) {
			const oMenu = this.byId("menu");
			const oColumn = oEvt.getParameter("openBy");
			const oSortItem = oMenu.getQuickActions()[0].getItems()[0];
			const oGroupItem = oMenu.getQuickActions()[1].getItems()[0];

			oSortItem.setKey(this._getKey(oColumn));
			oSortItem.setLabel(oColumn.getHeader().getText());
			oSortItem.setSortOrder(oColumn.getSortIndicator());

			oGroupItem.setKey(this._getKey(oColumn));
			oGroupItem.setLabel(oColumn.getHeader().getText());
			oGroupItem.setGrouped(oColumn.data("grouped"));
		},

		onColumnHeaderItemPress: function (oEvt) {
			const oColumnHeaderItem = oEvt.getSource();
			let sPanel = "Columns";
			if (oColumnHeaderItem.getIcon().indexOf("group") >= 0) {
				sPanel = "Groups";
			} else if (oColumnHeaderItem.getIcon().indexOf("sort") >= 0) {
				sPanel = "Sorter";
			} else if (oColumnHeaderItem.getIcon().indexOf("filter") >= 0) {
				sPanel = "Filter";
			}

			this._openPersoDialog([sPanel]);
		},

		onFilterInfoPress: function (oEvt) {
			this._openPersoDialog(["Filter"], oEvt.getSource());
		},

		onSort: function (oEvt) {
			const oSortItem = oEvt.getParameter("item");
			const oTable = this.oTable;
			const sAffectedProperty = oSortItem.getKey();
			const sSortOrder = oSortItem.getSortOrder();

			//Apply the state programatically on sorting through the column menu
			//1) Retrieve the current personalization state
			Engine.getInstance().retrieveState(oTable).then(function (oState) {

				//2) Modify the existing personalization state --> clear all sorters before
				oState.Sorter.forEach(function (oSorter) {
					oSorter.sorted = false;
				});

				if (sSortOrder !== coreLibrary.SortOrder.None) {
					oState.Sorter.push({
						key: sAffectedProperty,
						descending: sSortOrder === coreLibrary.SortOrder.Descending
					});
				}

				//3) Apply the modified personalization state to persist it in the VariantManagement
				Engine.getInstance().applyState(oTable, oState);
			});
		},

		onGroup: function (oEvt) {
			const oGroupItem = oEvt.getParameter("item");
			const oTable = this.oTable;
			const sAffectedProperty = oGroupItem.getKey();

			//1) Retrieve the current personalization state
			Engine.getInstance().retrieveState(oTable).then(function (oState) {

				//2) Modify the existing personalization state --> clear all groupings before
				oState.Groups.forEach(function (oSorter) {
					oSorter.grouped = false;
				});

				if (oGroupItem.getGrouped()) {
					oState.Groups.push({
						key: sAffectedProperty
					});
				}

				//3) Apply the modified personalization state to persist it in the VariantManagement
				Engine.getInstance().applyState(oTable, oState);
			});
		},

		onColumnMove: function (oEvt) {
			const oDraggedColumn = oEvt.getParameter("draggedControl");
			const oDroppedColumn = oEvt.getParameter("droppedControl");

			if (oDraggedColumn === oDroppedColumn) {
				return;
			}

			const oTable = this.oTable;
			const sDropPosition = oEvt.getParameter("dropPosition");
			const iDraggedIndex = oTable.indexOfColumn(oDraggedColumn);
			const iDroppedIndex = oTable.indexOfColumn(oDroppedColumn);
			const iNewPos = iDroppedIndex + (sDropPosition == "Before" ? 0 : 1) + (iDraggedIndex < iDroppedIndex ? -1 : 0);
			const sKey = this._getKey(oDraggedColumn);

			Engine.getInstance().retrieveState(oTable).then(function (oState) {

				const oCol = oState.Columns.find(function (oColumn) {
					return oColumn.key === sKey;
				}) || {
					key: sKey
				};
				oCol.position = iNewPos;

				Engine.getInstance().applyState(oTable, {
					Columns: [oCol]
				});
			});
		},

		onColumnResize: function (oEvt) {
			const oColumn = oEvt.getParameter("column");
			const sWidth = oEvt.getParameter("width");
			const oTable = this.oTable;

			const oColumnState = {};
			oColumnState[this._getKey(oColumn)] = sWidth;

			Engine.getInstance().applyState(oTable, {
				ColumnWidth: oColumnState
			});
		},

		onClearFilterPress: function (oEvt) {
			const oTable = this.oTable;
			Engine.getInstance().retrieveState(oTable).then(function (oState) {
				for (var sKey in oState.Filter) {
					oState.Filter[sKey].map((condition) => {
						condition.filtered = false;
					});
				}
				Engine.getInstance().applyState(oTable, oState);
			});
		}
	});
});
