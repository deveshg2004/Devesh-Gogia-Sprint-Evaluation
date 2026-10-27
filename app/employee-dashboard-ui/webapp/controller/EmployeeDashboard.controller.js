sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/viz/ui5/data/FlattenedDataset",
    "sap/viz/ui5/controls/common/feeds/FeedItem"
], (
    Controller,
    JSONModel,
    FlattenedDataset,
    FeedItem
) => {
    "use strict";

    return Controller.extend(
        "asset.lifecycle.employeedashboardui.controller.EmployeeDashboard",
        {

            onInit() {
                const oData = {
                    assets: [
                        { AssetType: "Laptop", Count: 1 },
                        { AssetType: "Monitor", Count: 1 },
                        { AssetType: "Mobile", Count: 1 }
                    ]
                };

                const oModel = new JSONModel(oData);
                this.getView().setModel(oModel);

                const oVizFrame = this.byId("employeeAssetChart");

                const oDataset = new FlattenedDataset({
                    dimensions: [{
                        name: "Asset Type",
                        value: "{AssetType}"
                    }],
                    measures: [{
                        name: "Assigned",
                        value: "{Count}"
                    }],
                    data: {
                        path: "/assets"
                    }
                });

                oVizFrame.setDataset(oDataset);
                oVizFrame.setModel(oModel);

                oVizFrame.addFeed(new FeedItem({
                    uid: "size",
                    type: "Measure",
                    values: ["Assigned"]
                }));

                oVizFrame.addFeed(new FeedItem({
                    uid: "color",
                    type: "Dimension",
                    values: ["Asset Type"]
                }));

                oVizFrame.setVizProperties({
                    title: {
                        visible: false
                    },
                    legend: {
                        visible: true,
                        alignment: "right"
                    },
                    plotArea: {
                        dataLabel: {
                            visible: true,
                            type: "value"
                        }
                    },
                    interaction: {
                        selectability: {
                            mode: "single"
                        }
                    }
                });

                this._showSection("profile");
            },

            _showSection(sSection) {

                const oProfile = this.byId("profileDetailsRow");
                const oAssets = this.byId("assetsDetailsList");
                const oMaintenance = this.byId("maintenanceDetailsList");

                oProfile.setVisible(sSection === "profile");
                oAssets.setVisible(sSection === "assets");
                oMaintenance.setVisible(sSection === "maintenance");

                const oProfileBtn = this.byId("profileBtn");
                const oAssetsBtn = this.byId("assetsBtn");
                const oMaintenanceBtn = this.byId("maintenanceBtn");

                oProfileBtn.setType(
                    sSection === "profile" ? "Emphasized" : "Default"
                );

                oAssetsBtn.setType(
                    sSection === "assets" ? "Emphasized" : "Default"
                );

                oMaintenanceBtn.setType(
                    sSection === "maintenance" ? "Emphasized" : "Default"
                );
            },

            onMyProfile() {
                this.byId("detailsPanel").setHeaderText("My Profile");
                this._showSection("profile");
            },

            onMyAssets() {
                this.byId("detailsPanel").setHeaderText("My Assets");
                this._showSection("assets");
            },

            onMaintenanceHistory() {
                this.byId("detailsPanel").setHeaderText("Maintenance History");
                this._showSection("maintenance");
            }
        }
    );
});