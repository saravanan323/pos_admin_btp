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

    return BaseController.extend("com.posadminbtp.system.ManageSystem", {

        formatter: Formatter,

        onInit() {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("manage_system").attachPatternMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("system_detail").attachPatternMatched(this._onRouteMatched, this);
            let oSource = ((sId) => this.getView().byId(sId));
            this.oFilterBar = this.byId("filter_system");
            this.oTable = this.byId("table_System");

            [this.oTable, this.oFilterBar] = [oSource('table_System'), oSource('filter_system')];
            this.getView().setModel(new JSONModel(), 'filterMdl');
            this._defaultAFOption = [
                { "ID": true },
                { "Name": true },
                { "Description": true },
                { "MAC Address": true },
                { "Configuration": true },
                { "Company": false },
                { "Sales Office": false },
                { "Sales Org": false },
                { "Created By": false },
                { "Created At": false },
                { "Updated By": false },
                { "Updated At": false },
                { "Status": true },
            ];
            let oModel = new JSONModel(
                [
                    {
                        "id": "MS001",
                        "name": "System1",
                        "description": "Manage System",
                        "macAddress": "00-09-6B-F2-53-AE",
                        "company": 1,
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
                                "userType": 1,
                                "status": "Active"
                            },
                            {
                                "id": "200US",
                                "name": "Jane Smith",
                                "email": "jane@example.com",
                                "username": "janesmith",
                                "userType": 1,
                                "status": "Inactive"
                            }

                        ]


                    },
                    {
                        "id": "MS002",
                        "name": "System2",
                        "description": "Test Manage System",
                        "macAddress": "00-09-6B-F2-54-AE",
                        "company": 1,
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
                                "userType": 1,
                                "status": "Inactive"
                            }
                        ]

                    }




                ]);

            this.getView().setModel(oModel,"systemMdl");

            this._registerForP13n();
        },
        async _onRouteMatched(oEvent) {
           

            var setDataModel = {
                status: [
                    { key: "1", text: "Draft" },
                    { key: "2", text: "Active" },
                    { key: "3", text: "Inactive" }
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
                  this.onResetAdaptFilter(this.oFilterBar);
        },

        onCreateSystem: function () {
            this.oRouter.navTo("create_system", { layout: "TwoColumnsMidExpanded" });
        },
        onExit: function () {
            this.oRouter.getRoute("manage_system").detachPatternMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("system_detail").detachPatternMatched(this._onRouteMatched, this);
        },
        onListItemPress(oEvent) {
            let systemCtxt = oEvent.getSource().getSelectedItem().getBindingContext('systemMdl');
            let system = systemCtxt.getObject();
            let oSettingsModel = this.oOwnerComponent.getModel('settings');
            oSettingsModel.setProperty("/navigatedItem", system.id);
            this.oRouter.navTo("system_detail", { layout: "TwoColumnsMidExpanded", id: system.id });
        },
        configurationFormatter(value) {
            let data = [{ key: "1", text: "Sample Service" },
            { key: "2", text: "User Management Service" },
            { key: "3", text: "Order Management Service" }]

            return data.find(e => e.key == value)?.text;
        },
        salesOrgFormatter(value) {
            let data = [{ key: "1", text: "Functional" },
            { key: "2", text: "Technical" },
            { key: "3", text: "Sales" }]

            return data.find(e => e.key == value)?.text;
        },
        salesofficeFormatter(value) {
            let data = [{ key: "1", text: "Oman" },
            { key: "2", text: "Bengaluru" },
            { key: "3", text: "Abu Dhabi" }]

            return data.find(e => e.key == value)?.text;
        },
        companyFormatter(value) {
            let data = [{ key: "1", text: "ITFZ_inflexion" }]

            return data.find(e => e.key == value)?.text;
        },
        _registerForP13n: function () {
            let oTable = this.byId("table_System");

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
                        key: "description_col",
                        label: "Description",
                        path: "description"
                    },
                    {
                        key: "mac_col",
                        label: "MAC address",
                        path: "macAddress"
                    },
                    {
                        key: "comp_col",
                        label: "Company",
                        path: "company"
                    },
                    {
                        key: "conf_col",
                        label: "Configuration",
                        path: "configuration"
                    },
                    {
                        key: "org_col",
                        label: "Sales Org",
                        path: "salesOrg"
                    },
                    {
                        key: "office_col",
                        label: "Sales Office",
                        path: "salesoffice"
                    },
                    {
                        key: "createdAt_col",
                        label: "Created At",
                        path: "createdAt"
                    },
                    {
                        key: "updatedAt_col",
                        label: "Updated At",
                        path: "updatedAt"
                    },
                    {
                        key: "createdBy_col",
                        label: "Created By",
                        path: "createdBy"
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
            var oTable = this.byId("table_System");

            Engine.getInstance().show(oTable, aPanels, {
                contentHeight: aPanels.length > 1 ? "50rem" : "35rem",
                contentWidth: aPanels.length > 1 ? "45rem" : "32rem",
                source: oSource || oTable
            });
        },
        _getKey: function (oControl) {
            return this.getView().getLocalId(oControl.getId());
        },

        handleStateChange: function (oEvt) {
            const oTable = this.byId("table_System");
            const oState = oEvt.getParameter("state");
        
            if (!oState) {
                return;
            }
        
            // Update the columns per selection in the state
            this.updateColumns(oState);
        
            // Create Filters & Sorters
            //  const aFilter = this.createFilters(oState);
            const aGroups = this.createGroups(oState);
            const aSorter = this.createSorters(oState, aGroups);
        
            // Function to create cell templates
            const createCell = function (oColumnState, colPath) {
                switch (oColumnState.key) {
                    case 'status_col':
                        return new sap.m.ObjectStatus({
                            text: "{= ${" + colPath + "} === 2 ? 'Active' : 'Inactive'}",
                            state: "{= ${" + colPath + "} === 2 ? 'Success' : 'Error'}"
                        });
                    case 'comp_col':
                        return new sap.m.Text({
                            text: { path: colPath, formatter: this.companyFormatter.bind(this) }
                        });
                    case 'conf_col':
                        return new sap.m.Text({
                            text: { path: colPath, formatter: this.configurationFormatter.bind(this) }
                        });
                    case 'org_col':
                        return new sap.m.Text({
                            text: { path: colPath, formatter: this.salesOrgFormatter.bind(this) }
                        });
                    case 'office_col':
                        return new sap.m.Text({
                            text: { path: colPath, formatter: this.salesofficeFormatter.bind(this) }
                        });
                    case 'password_col':
                        return new sap.m.Text({
                            text: "{" + colPath + "}"
                        }).addStyleClass("hidePasswordInTextField");
                   
                    default:
                        return new sap.m.Text({
                            text: "{" + colPath + "}"
                        });
                }
            }.bind(this);
        
            // Create cell templates for each column
            const aCells = oState.Columns.map(function (oColumnState) {
                const colPath = 'systemMdl>' + this.oMetadataHelper.getProperty(oColumnState.key).path;
                return createCell(oColumnState, colPath);
            }.bind(this));
        
            // Rebind the table with the updated cell template
            oTable.bindItems({
                templateShareable: false,
                path: 'systemMdl>/',
                sorter: aSorter.concat(aGroups),
                // filters: aFilter,
                template: new sap.m.ColumnListItem({
                    type: "Navigation",
                    cells: aCells
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

            oState.Sorter.forEach(function (oSorter) {
                const oCol = this.byId(oSorter.key);
                if (oSorter.sorted !== false) {
                    oCol.setSortIndicator(oSorter.descending ? coreLibrary.SortOrder.Descending : coreLibrary.SortOrder.Ascending);
                }
            }.bind(this));

            return aSorter;
        },

        createGroups: function (oState) {
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
    const oTable = this.byId("table_System");
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

        onSort: function (oEvt) {
            const oSortItem = oEvt.getParameter("item");
            const oTable = this.byId("table_System");
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
            const oTable = this.byId("table_System");
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

        onColumnResize: function (oEvt) {
            const oColumn = oEvt.getParameter("column");
            const sWidth = oEvt.getParameter("width");
            const oTable = this.byId("table_System");

            const oColumnState = {};
            oColumnState[this._getKey(oColumn)] = sWidth;

            Engine.getInstance().applyState(oTable, {
                ColumnWidth: oColumnState
            });
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
    });
});
