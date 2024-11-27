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
    "com/posadminbtp/utils/URLConstants",
    "com/posadminbtp/utils/Formatter",
    'sap/ui/model/FilterOperator',
], function (BaseController, JSONModel, Engine, SelectionController, SortController, GroupController, FilterController, MetadataHelper, Sorter, ColumnListItem, Text, coreLibrary, ColumnWidthController, Filter, URLConstants, Formatter, FilterOperator) {
    "use strict";

    return BaseController.extend("com.posadminbtp.licence_key_control.ManageLicenceKeyControl", {
        formatter: Formatter,
        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("manage_licence_key_control").attachPatternMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("licence_key_control_detail").attachPatternMatched(this._onRouteMatched, this);
            // this.getFiltersWithValues = this.getFiltersWithValues.bind(this);
            this.oFilterBar = this.byId("filter_Licence");
            this.oTable = this.byId("table_Licence");

            let oSource = ((sId) => this.getView().byId(sId));

            [this.oTable, this.oFilterBar] = [oSource('table_Licence'), oSource('filter_Licence')];

            this.getView().setModel(new JSONModel(), 'filterMdl');
            this._defaultAFOption = [
                { "ID": true },
                { "Name": true },
                { "Description": true },
                { "LicenseKey": true },
                { "Expiration Date": true },
                { "System": true },
                { "Created By": false },
                { "Created At": false },
                { "Updated By": false },
                { "Updated At": false },
                { "Status": true },
            ];
            let oModel = new JSONModel(
                [
                    {
                        "id": "LKC001",
                        "name": "Test1 Licence",
                        "description": "licence key control",
                        "licenseKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
                        "expirationDate": "23-09-2013",
                        "createdAt": "28-09-2013 09:57:19",
                        "updatedAt": "29-09-2013 09:57:19",
                        "createdBy": "admin",
                        "updatedBy": "",
                        "SystemID": 1,
                        "StatusID": 2,


                    },
                    {
                        "id": "LKC002",
                        "name": "Test2 Licence",
                        "description": "TESTblicence key control",
                        "licenseKey": "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ",
                        "expirationDate": "24-09-2013",
                        "createdAt": "28-09-2013 09:57:19",
                        "updatedAt": "29-09-2013 09:57:19",
                        "createdBy": "jone",
                        "updatedBy": "",
                        "SystemID": 2,
                        "StatusID": 3,


                    }


                ]);

            this.getView().setModel(oModel);

            this._registerForP13n();


        },
        async _onRouteMatched(oEvent) {

            var setDataModel = {
                Status: [
                    { key: "1", text: "Draft" },
                    { key: "2", text: "Active" },
                    { key: "3", text: "Inactive" }
                ],
                system: [
                    { key: "1", text: "System1" },
                    { key: "2", text: "System2" }
                ],

            };


            this.getView().setModel(new JSONModel(setDataModel), "masterdataMdl");
            this.onResetAdaptFilter(this.oFilterBar);
        },

        onCreateSystem: function () {
            this.oRouter.navTo("create_licence_key_control", { layout: "TwoColumnsMidExpanded" });
        },
        onExit: function () {
            this.oRouter.getRoute("manage_licence_key_control").detachPatternMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("licence_key_control_detail").detachPatternMatched(this._onRouteMatched, this);
        },
        onListItemPress(oEvent) {
            let licenceCtxt = oEvent.getSource().getSelectedItem().getBindingContext();
            let licence = licenceCtxt.getObject();
            let oSettingsModel = this.oOwnerComponent.getModel('settings');
            oSettingsModel.setProperty("/navigatedItem", licence.id);
            this.oRouter.navTo("licence_key_control_detail", { layout: "TwoColumnsMidExpanded", id: licence.id });
        },
        systemFormatter(value) {
            let data = [{ key: "1", text: "System1" },
            { key: "2", text: "System2" }]
            return data.find(e => e.key == value)?.text;
        },
        _registerForP13n: function () {
            let oTable = this.byId("table_Licence");

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
                        key: "LicenseKey_col",
                        label: "LicenseKey",
                        path: "licenseKey"
                    },
                    {
                        key: "Date_col",
                        label: "ExpirationDate",
                        path: "expirationDate"
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
                        path: "createdBy",
                    },
                    
                    {
                        key: "updatedBy_col",
                        label: "Updated By",
                        path: "updatedBy",
                    },
                    {
                        key: "statusID_col",
                        label: "Status ID",
                        path: "StatusID"
                    },
                    {
                        key: "SystemID_col",
                        label: "System ID",
                        path: "SystemID"
                    },

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
            var oTable = this.byId("table_Licence");

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
            const oTable = this.byId("table_Licence");
            const oState = oEvt.getParameter("state");

            if (!oState) {
                return;
            }

            // Update the columns per selection in the state
            this.updateColumns(oState);

            // Create Filters & Sorters
         
            const aGroups = this.createGroups(oState);
            const aSorter = this.createSorters(oState, aGroups);

            // Create the cell template for each column
            const aCells = oState.Columns.map(function (oColumnState) {
                let colPath = this.oMetadataHelper.getProperty(oColumnState.key).path;
                let cell;

                // Check if the column is 'statusID_col'
                if (oColumnState.key === 'statusID_col') {
                    return new sap.m.ObjectStatus({
                        text: "{= ${" + colPath + "} === 2 ? 'Active' : 'Inactive'}",
                        state: "{= ${" + colPath + "} === 2 ? 'Success' : 'Error'}"
                    });
                } else if (oColumnState.key === 'SystemID_col') {
                    cell = new sap.m.Text({
                        text: { path: colPath, formatter: this.systemFormatter.bind(this) }
                    });
                    return cell; // Return the SystemID cell
                } else if (oColumnState.key === 'id_col') {
                    cell = new sap.m.ObjectIdentifier({
                        title: { path: colPath }
                    });
                    return cell; // Return the SystemID cell
                } else {
                    // For other columns, create a simple Text control
                    return new sap.m.Text({
                        text: "{" + colPath + "}"
                    });
                }
            }.bind(this));

            // Rebind the table with the updated cell template
            oTable.bindItems({
                templateShareable: false,
                path: '/',
                sorter: aSorter.concat(aGroups),
        
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
            const oTable = this.byId("table_Licence");

            oTable.getColumns().forEach(function (oColumn, iIndex) {
                oColumn.setVisible(false);
                oColumn.setWidth(oState.ColumnWidth[this._getKey(oColumn)]);
                oColumn.setSortIndicator(coreLibrary.SortOrder.None);
                oColumn.data("grouped", false);
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

       

        onFilterInfoPress: function (oEvt) {
            this._openPersoDialog(["Filter"], oEvt.getSource());
        },

        onSort: function (oEvt) {
            const oSortItem = oEvt.getParameter("item");
            const oTable = this.byId("table_Licence");
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
            const oTable = this.byId("table_Licence");
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
            const oTable = this.byId("table_Licence");

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
