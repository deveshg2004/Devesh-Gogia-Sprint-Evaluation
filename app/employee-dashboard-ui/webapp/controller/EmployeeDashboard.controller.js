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
                    data: { path: "/assets" }
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
                    title: { visible: false },
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
            },

            onMyProfile() {
                this.byId("detailsPanel").setHeaderText("My Profile");
            },

            onMyAssets() {
                this.byId("detailsPanel").setHeaderText("My Assets");
            },

            onMaintenanceHistory() {
                this.byId("detailsPanel").setHeaderText("Maintenance History");
            }
        }
    );
});