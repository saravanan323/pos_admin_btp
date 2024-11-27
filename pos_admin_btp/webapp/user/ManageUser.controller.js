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
    "sap/ui/model/FilterOperator",
], function (BaseController, JSONModel, Engine, SelectionController, SortController, GroupController, FilterController, MetadataHelper, Sorter, ColumnListItem, Text, coreLibrary, ColumnWidthController, Filter, URLConstants, Formatter, FilterOperator) {
    "use strict";

    return BaseController.extend("com.posadminbtp.user.ManageUser", {

        formatter: Formatter,


        onInit() {
            this.oOwnerComponent = this.getOwnerComponent();
            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();
            this.oRouter.getRoute("manage_user").attachPatternMatched(this._onRouteMatched, this);
            this.oTable = this.byId("userTable");
            let oSource = ((sId) => this.getView().byId(sId));
            [this.oTable, this.oFilterBar] = [oSource('userTable'), oSource('filterbar')];
            this.getView().setModel(new JSONModel(), 'filterMdl');
            this._defaultAFOption = [
                { "ID": true },
                { "Name": true },
                { "E-mail": true },
                { "Description": false },
                { "Initial Password": false },
                { "Password": false },
                { "System": false },
                { "User Type": false },
                { "Username": false },
                { "Valid From": false },
                { "Valid To": false },
                { "Created By": false },
                { "Created At": false },
                { "Updated By": false },
                { "Updated At": false },
                { "Status": true },
            ];
            let oModel = new JSONModel(
                [
                    {
                        id: "100US",
                        name: "John Doe",
                        email: "john@example.com",
                        status: 2,
                        description: "User description for John",
                        username: "johndoe",
                        password: "3241",
                        initialPassword: true,
                        validFrom: "01-01-2024",
                        validTo: "01-01-2024",
                        system: 1,
                        userType: 1,
                        createdAt: "01-01-2024 09:57:19",
                        updatedAt: "01-01-2024 09:57:19",
                        createdBy: "21-11-2024",
                        updatedBy: "21-11-2024"


                    },
                    {
                        id: "200US",
                        name: "Jane Smith",
                        email: "jane@example.com",
                        status: 3,
                        description: "User description for Jane",
                        username: "janesmith",
                        password: "456",
                        initialPassword: false,
                        validFrom: "01-01-2025",
                        validTo: "01-01-2025",
                        system: 2,
                        userType: 1,
                        createdAt: "01-01-2025 09:57:19",
                        updatedAt: "01-01-2025 09:57:19",
                        createdBy: "21-11-2024",
                        updatedBy: "21-11-2024"

                    }


                ]);

            this.getView().setModel(oModel);

            this._registerForP13n();
        },
        async _onRouteMatched(oEvent) {
            var setDataModel = {
                initialPassword: [
                    { key: "1", text: "Yes" },
                    { key: "2", text: "No" },

                ],
                system: [
                    { key: "1", text: "System1" },
                    { key: "2", text: "System2" }
                ],
                userType: [
                    { key: "1", text: "Admin" },
                    { key: "2", text: "Editor" },
                    { key: "3", text: "Viewer" },

                ],
                status: [
                    { key: "1", text: "Draft" },
                    { key: "2", text: "Active" },
                    { key: "3", text: "Inactive" },

                ]
            };


            this.getView().setModel(new JSONModel(setDataModel), "masterdataMdl");
            this.onResetAdaptFilter(this.oFilterBar);
        },
        onExit() {
            this.oRouter.getRoute("manage_user").detachPatternMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("user_detail").detachPatternMatched(this._onRouteMatched, this);
        },
        //createbutton
        onCreateButtonPress() {
            this.oRouter.navTo("create_user", { layout: "TwoColumnsMidExpanded" });
        },
        //listitem table
        onListItemPress(oEvent) {
            let userCtxt = oEvent.getSource().getSelectedItem().getBindingContext();
            let user = userCtxt.getObject();
            let oSettingsModel = this.oOwnerComponent.getModel('settings');
            oSettingsModel.setProperty("/navigatedItem", user.id);
            this.oRouter.navTo("user_detail", { layout: "TwoColumnsMidExpanded", id: user.id });
        },
        systemFormatter(value) {
            let data = [{ key: "1", text: "System1" },
            { key: "2", text: "System2" }]
            return data.find(e => e.key == value)?.text;
        },
        userTypeFormatter(value) {
            let data = [{ key: "1", text: "Admin" },
            { key: "2", text: "View" },
            { key: "3", text: "Edit" }
            ]
            return data.find(e => e.key == value)?.text;
        },

        _registerForP13n: function () {
            const oTable = this.byId("userTable");

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
                        key: "email_col",
                        label: "Email",
                        path: "email"
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
                        key: "initail_password_col",
                        label: "Initial Password",
                        path: "initialPassword"
                    },
                    {
                        key: "valid_from_col",
                        label: "Valid From",
                        path: "validFrom"
                    },
                    {
                        key: "valid_to_col",
                        label: "Valid To",
                        path: "validTo"
                    },
                    {
                        key: "system_col",
                        label: "System",
                        path: "system"
                    },
                    {
                        key: "user_type_col",
                        label: "User Type",
                        path: "userType"
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
        //settings
        openPersoDialog: function (oEvt) {
            this._openPersoDialog(["Columns", "Sorter", "Groups"], oEvt.getSource());
        },

        _openPersoDialog: function (aPanels, oSource) {
            var oTable = this.byId("userTable");

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
            const oTable = this.byId("userTable");
            const oState = oEvt.getParameter("state");

            if (!oState) {
                return;
            }

            // Update the columns per selection in the state
            this.updateColumns(oState);

            // Create Filters & Sorters
          
            const aGroups = this.createGroups(oState);
            const aSorter = this.createSorters(oState, aGroups);


            const aCells = oState.Columns.map(function (oColumnState) {
                let colPath = this.oMetadataHelper.getProperty(oColumnState.key).path;
                let cell;

                // Check if the column is 'status_col'
                if (oColumnState.key === 'status_col') {
                    cell = new sap.m.ObjectStatus({
                        text: "{= ${" + colPath + "} === 2 ? 'Active' : 'Inactive'}",
                        state: "{= ${" + colPath + "} === 2 ? 'Success' : 'Error'}"
                    });
                } else if (oColumnState.key === 'system_col') {
                    cell = new sap.m.Text({
                        text: { path: colPath, formatter: this.systemFormatter.bind(this) }
                    });
                } else if (oColumnState.key === 'user_type_col') {
                    cell = new sap.m.Text({
                        text: { path: colPath, formatter: this.userTypeFormatter.bind(this) }
                    });
                }
                else if (oColumnState.key.includes('initail_password_col')) {
                    return new sap.m.CheckBox({
                        selected: "{" + this.oMetadataHelper.getProperty(oColumnState.key).path + "}",
                        enabled: false
                    });
                } else if (oColumnState.key === 'password_col') {
                    cell = new sap.m.Text({
                        text: "{" + colPath + "}"
                    }).addStyleClass("hidePasswordInTextField");
                }
                else {
                    // For other columns, create a simple Text control
                    cell = new sap.m.Text({
                        text: "{" + colPath + "}"
                    });
                }
                return cell;
            }.bind(this));

            // Rebind the table with the updated cell template
            oTable.bindItems({
                templateShareable: false,
                path: '/',
                sorter: aSorter.concat(aGroups),
                template: new sap.m.ColumnListItem({
                    type: "Navigation",
                    cells: aCells,
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
            const oTable = this.byId("userTable");

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
        //columnmenu
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
     
        //sort
        onSort: function (oEvt) {
            const oSortItem = oEvt.getParameter("item");
            const oTable = this.byId("userTable");
            const sAffectedProperty = oSortItem.getKey();
            const sSortOrder = oSortItem.getSortOrder();
            Engine.getInstance().retrieveState(oTable).then(function (oState) {

                oState.Sorter.forEach(function (oSorter) {
                    oSorter.sorted = false;
                });

                if (sSortOrder !== coreLibrary.SortOrder.None) {
                    oState.Sorter.push({
                        key: sAffectedProperty,
                        descending: sSortOrder === coreLibrary.SortOrder.Descending
                    });
                }
                Engine.getInstance().applyState(oTable, oState);
            });
        },
        //group
        onGroup: function (oEvt) {
            const oGroupItem = oEvt.getParameter("item");
            const oTable = this.byId("userTable");
            const sAffectedProperty = oGroupItem.getKey();

            Engine.getInstance().retrieveState(oTable).then(function (oState) {
                oState.Groups.forEach(function (oSorter) {
                    oSorter.grouped = false;
                });

                if (oGroupItem.getGrouped()) {
                    oState.Groups.push({
                        key: sAffectedProperty
                    });
                }


                Engine.getInstance().applyState(oTable, oState);
            });
        },
        //columnsize
        onColumnResize: function (oEvt) {
            const oColumn = oEvt.getParameter("column");
            const sWidth = oEvt.getParameter("width");
            const oTable = this.byId("userTable");

            const oColumnState = {};
            oColumnState[this._getKey(oColumn)] = sWidth;

            Engine.getInstance().applyState(oTable, {
                ColumnWidth: oColumnState
            });
        },
       
        //search 

        onSearch: function (oEvent) {
            let oModel = this.getView().getModel('filterMdl');
            let oData = oModel.getData();
            const aFilter = [];

            for (let [key, value] of Object.entries(oData)) {
                if (value) {
                    if (Array.isArray(value)) {
                        const multiFilters = [];
                        value.forEach(e => {
                            multiFilters.push(new Filter(key, FilterOperator.EQ, parseInt(e)));
                        });

                        aFilter.push(new Filter({ filters: multiFilters, and: false }));
                    } else {

                        aFilter.push(new Filter(key, FilterOperator.Contains, value));
                    }
                }
            }
            this.oTable.getBinding("items").filter(aFilter, "Application");
            this.oTable.setShowOverlay(false);

        },

        //onclear
        onClear() {
            this.getView().setModel(new JSONModel(), 'filterMdl');
        }


    });
});


