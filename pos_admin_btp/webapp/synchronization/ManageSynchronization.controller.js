sap.ui.define(
	[
		"com/posadminbtp/initial/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/m/p13n/Engine",
		"sap/m/p13n/SelectionController",
		"sap/m/p13n/SortController",
		"sap/m/p13n/GroupController",
		"sap/m/p13n/FilterController",
		"sap/m/p13n/MetadataHelper",
		"sap/ui/model/Sorter",
		"sap/m/ColumnListItem",
		"sap/m/Text",
		"sap/ui/core/library",
		"sap/m/table/ColumnWidthController",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"com/posadminbtp/utils/URLConstants",
		"com/posadminbtp/utils/Formatter",
	],
	function (
		BaseController,
		JSONModel,
		Engine,
		SelectionController,
		SortController,
		GroupController,
		FilterController,
		MetadataHelper,
		Sorter,
		ColumnListItem,
		Text,
		coreLibrary,
		ColumnWidthController,
		Filter,
		FilterOperator,
		URLConstants,
		Formatter,
	) {
		"use strict";

		return BaseController.extend(
			"com.posadminbtp.synchronization.ManageSynchronization",
			{
				formatter: Formatter,

				onInit() {
					this.oOwnerComponent = this.getOwnerComponent();

					this.oRouter = this.oOwnerComponent.getRouter();
					this.oModel = this.oOwnerComponent.getModel();

					this.oRouter
						.getRoute("manage_synchronization")
						.attachPatternMatched(this._onRouteMatched, this);
					//	this.oRouter.getRoute("synchronization_detail").attachPatternMatched(this._onRouteMatched, this);

					let oSource = (sId) => this.getView().byId(sId);

					[this.oTable, this.oFilterBar] = [
						oSource("tableSynchronization"),
						oSource("fbSynchronization"),
					];

					this.getView().setModel(new JSONModel(), "filterMdl");

					this.getView().setModel(new JSONModel(this.dummyData()));

					this._registerForP13n();
					this._defaultAFOption = [
						{ "ID": true },
						{ "Name": true },
						{ "System": true },
						{ "Status": true },
						{ "Created By": false },
						{ "Created At": false },
						{ "Updated By": false },
						{ "Updated At": false },
						
					];
				
					

				},
				_onRouteMatched(oEvent) {
					var setDataModel = {
						system: [
							{ key: "1", text: "SAP S4/HANA Cloud" },
							{ key: "2", text: "SAP S4/HANA On-premise" },
							{ key: "3", text: "SAP Business ByDesign" },
							{ key: "4", text: "SAP Business One" }
						],
						Status: [
							{ key: "1", text: "Draft" },
							{ key: "2", text: "Active" },
							{ key: "3", text: "Inactive" }
						],
					};


					this.getView().setModel(new JSONModel(setDataModel), "masterdataMdl");
					this.onResetAdaptFilter(this.oFilterBar);
				},

				onExit() {
					this.oRouter
						.getRoute("manage_synchronization")
						.detachPatternMatched(this._onRouteMatched, this);
					this.oRouter
						.getRoute("synchronization_detail")
						.detachPatternMatched(this._onRouteMatched, this);
				},
				onCreateConfiguration() {
					this.oRouter.navTo("create_synchronization", {
						layout: "TwoColumnsMidExpanded",
					});
				},
				onListItemPress(oEvent) {
					let configCtxt = oEvent
						.getSource()
						.getSelectedItem()
						.getBindingContext();
					let config = configCtxt.getObject();
					let oSettingsModel = this.oOwnerComponent.getModel("settings");
					oSettingsModel.setProperty("/navigatedItem", config.id);
					this.oRouter.navTo("synchronization_detail", {
						layout: "TwoColumnsMidExpanded",
						id: config.id,
					});
				},
				onSearch(oEvent) {
					let oModel = this.getView().getModel("filterMdl");
					let oData = oModel.getData();
					const aFilter = [];

					for (let [key, value] of Object.entries(oData)) {
						if (value) {
							if (Array.isArray(value)) {
								// For fields with multiple values
								const multiFilters = [];
								value.forEach((e) => {
									multiFilters.push(
										new Filter(key, FilterOperator.EQ, parseInt(e)),
									);
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
									id: "101",
									masterName: "Customer",
									syncType: "Full Sync",
									status: "Synchronized",
								},
								{
									id: "102",
									masterName: "Material",
									syncType: "Incremental Sync",
									status: "Pending",
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
									masterName: "Price List",
									syncType: "Full Sync",
									status: "Failed",
								},
								{
									id: "104",
									masterName: "Vendor",
									syncType: "Incremental Sync",
									status: "Synchronized",
								},
								{
									id: "106",
									masterName: "Customer",
									syncType: "Incremental Sync",
									status: "Pending",
								}
							],
						}
					];
				},
				typeFormatter(value) {
					let data = [{ key: "1", text: "SAP S4/HANA Cloud" },
					{ key: "2", text: "SAP S4/HANA On-premise" },
					{ key: "3", text: "SAP Business ByDesign" },
					{ key: "4", text: "SAP Business One" }]

					return data.find(e => e.key == value)?.text;
				},
				_registerForP13n() {
					const oTable = this.oTable;

					this.oMetadataHelper = new MetadataHelper([
						{
							key: "id_col",
							label: "ID",
							path: "id",
						},
						{
							key: "name_col",
							label: "Name",
							path: "name",
						},
						{
							key: "system_col",
							label: "System",
							path: "system",
						},
						{
							key: "createdAt_col",
							label: "Created At",
							path: "createdAt",
						},
						{
							key: "updatedAt_col",
							label: "Updated At",
							path: "updatedAt",
						},
						{
							key: "createdBy_col",
							label: "Created By",
							path: "createdBy",
						},
						
						{
							key: "updatedBy_col",
							label: "Updated By",
							path: "updatedBy",
						},
						{
							key: "status_col",
							label: "Status",
							path: "status",
						},
					]);

					Engine.getInstance().register(oTable, {
						helper: this.oMetadataHelper,
						controller: {
							Columns: new SelectionController({
								targetAggregation: "columns",
								control: oTable,
							}),
							Sorter: new SortController({
								control: oTable,
							}),
							Groups: new GroupController({
								control: oTable,
							}),
							ColumnWidth: new ColumnWidthController({
								control: oTable,
							}),
							Filter: new FilterController({
								control: oTable,
							}),
						},
					});

					Engine.getInstance().attachStateChange(
						this.handleStateChange.bind(this),
					);
				},
				openPersoDialog(oEvt) {
					this._openPersoDialog(
						["Columns", "Sorter", "Groups"],
						oEvt.getSource(),
					);
				},

				_openPersoDialog(aPanels, oSource) {
					var oTable = this.oTable;

					Engine.getInstance().show(oTable, aPanels, {
						contentHeight: aPanels.length > 1 ? "50rem" : "35rem",
						contentWidth: aPanels.length > 1 ? "45rem" : "32rem",
						source: oSource || oTable,
					});
				},

				_getKey(oControl) {
					return this.getView().getLocalId(oControl.getId());
				},

				handleStateChange(oEvt) {
					const oTable = this.oTable;
					const oState = oEvt.getParameter("state");

					if (!oState) {
						return;
					}

					// Update the columns based on the selection in the state
					this.updateColumns(oState);

					// Create Filters, Sorters, and Groups
					
					const aGroups = this.createGroups(oState);
					const aSorters = this.createSorters(oState, aGroups);

					// Create cells based on column configuration
					const aCells = oState.Columns.map(function (oColumnState) {
						const colPath = this.oMetadataHelper.getProperty(oColumnState.key).path;
						let cell;

						if (oColumnState.key === "status_col") {
							cell = new sap.m.ObjectStatus({
								text: "{= ${" + colPath + "} === 2 ? 'Active' : 'Inactive'}",
								state: "{= ${" + colPath + "} === 2 ? 'Success' : 'Error'}"
							});
						} else if (oColumnState.key === "system_col") {
							cell = new sap.m.Text({
								text: {
									path: colPath,
									formatter: this.typeFormatter.bind(this),
								},
							});
						} else {
							cell = new sap.m.Text({
								text: "{" + colPath + "}"
							});
						}
						return cell;
					}.bind(this));

					// Rebind the table with the updated cell template
					oTable.bindItems({
						templateShareable: false,
						path: "/",
						sorters: aSorters.concat(aGroups),
					
						template: new sap.m.ColumnListItem({
							cells: aCells,
							type: "Navigation",
						}),
					});
				},


				

				createSorters: function(oState, aExistingSorter) {
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
		
					oState.Sorter.forEach(function (oSorter) {
						const oCol = this.byId(oSorter.key);
						if (oSorter.sorted !== false) {
							oCol.setSortIndicator(oSorter.descending ? coreLibrary.SortOrder.Descending : coreLibrary.SortOrder.Ascending);
						}
					}.bind(this));
		
					return aSorter;
				},

				createGroups(oState) {
					const aGroupings = [];
            oState.Groups.forEach(function (oGroup) {
                aGroupings.push(new Sorter(this.oMetadataHelper.getProperty(oGroup.key).path, false, true));
            }.bind(this));

            oState.Groups.forEach(function (oSorter) {
                const oCol = this.byId(oSorter.key);
                oCol.data("grouped", true);
            }.bind(this));

            return aGroupings;
				},

				updateColumns: function (oState) {
					const oTable =  this.oTable;;
					oTable.getColumns().forEach(function (oColumn) {
						oColumn.setVisible(false);
						oColumn.setWidth(oState.ColumnWidth[this._getKey(oColumn)]);
						oColumn.setSortIndicator(coreLibrary.SortOrder.None);
						oColumn.data("grouped", false);
				
						// Set alignment if available
						const colMeta = this.oMetadataHelper.getProperty(this._getKey(oColumn));
						if (colMeta && colMeta.hAlign) {
							oColumn.getHeader().setHAlign(colMeta.hAlign);
						}
					}.bind(this));
				
					oState.Columns.forEach(function (oProp, iIndex) {
						const oCol = this.byId(oProp.key);
						oCol.setVisible(true);
						oTable.removeColumn(oCol);
						oTable.insertColumn(oCol, iIndex);
					}.bind(this));
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
				

				

				onSort(oEvt) {
					const oSortItem = oEvt.getParameter("item");
					const oTable = this.oTable;
					const sAffectedProperty = oSortItem.getKey();
					const sSortOrder = oSortItem.getSortOrder();

					//Apply the state programatically on sorting through the column menu
					//1) Retrieve the current personalization state
					Engine.getInstance()
						.retrieveState(oTable)
						.then(function (oState) {
							//2) Modify the existing personalization state --> clear all sorters before
							oState.Sorter.forEach(function (oSorter) {
								oSorter.sorted = false;
							});

							if (sSortOrder !== coreLibrary.SortOrder.None) {
								oState.Sorter.push({
									key: sAffectedProperty,
									descending: sSortOrder === coreLibrary.SortOrder.Descending,
								});
							}

							//3) Apply the modified personalization state to persist it in the VariantManagement
							Engine.getInstance().applyState(oTable, oState);
						});
				},

				onGroup(oEvt) {
					const oGroupItem = oEvt.getParameter("item");
					const oTable = this.oTable;
					const sAffectedProperty = oGroupItem.getKey();

					//1) Retrieve the current personalization state
					Engine.getInstance()
						.retrieveState(oTable)
						.then(function (oState) {
							//2) Modify the existing personalization state --> clear all groupings before
							oState.Groups.forEach(function (oSorter) {
								oSorter.grouped = false;
							});

							if (oGroupItem.getGrouped()) {
								oState.Groups.push({
									key: sAffectedProperty,
								});
							}

							//3) Apply the modified personalization state to persist it in the VariantManagement
							Engine.getInstance().applyState(oTable, oState);
						});
				},

				onColumnMove(oEvt) {
					const oDraggedColumn = oEvt.getParameter("draggedControl");
					const oDroppedColumn = oEvt.getParameter("droppedControl");

					if (oDraggedColumn === oDroppedColumn) {
						return;
					}

					const oTable = this.oTable;
					const sDropPosition = oEvt.getParameter("dropPosition");
					const iDraggedIndex = oTable.indexOfColumn(oDraggedColumn);
					const iDroppedIndex = oTable.indexOfColumn(oDroppedColumn);
					const iNewPos =
						iDroppedIndex +
						(sDropPosition == "Before" ? 0 : 1) +
						(iDraggedIndex < iDroppedIndex ? -1 : 0);
					const sKey = this._getKey(oDraggedColumn);

					Engine.getInstance()
						.retrieveState(oTable)
						.then(function (oState) {
							const oCol = oState.Columns.find(function (oColumn) {
								return oColumn.key === sKey;
							}) || {
								key: sKey,
							};
							oCol.position = iNewPos;

							Engine.getInstance().applyState(oTable, {
								Columns: [oCol],
							});
						});
				},

				onColumnResize(oEvt) {
					const oColumn = oEvt.getParameter("column");
					const sWidth = oEvt.getParameter("width");
					const oTable = this.oTable;

					const oColumnState = {};
					oColumnState[this._getKey(oColumn)] = sWidth;

					Engine.getInstance().applyState(oTable, {
						ColumnWidth: oColumnState,
					});
				},

				
			},
		);
	},
);
