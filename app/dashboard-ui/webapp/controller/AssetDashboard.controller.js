sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/viz/ui5/data/FlattenedDataset",
    "sap/viz/ui5/controls/common/feeds/FeedItem"
], function (
    Controller,
    JSONModel,
    MessageBox,
    FlattenedDataset,
    FeedItem
) {
    "use strict";

    return Controller.extend(
        "asset.lifecycle.dashboardui.controller.AssetDashboard",
        {
            onInit: function () {
                const oDashboardModel = new JSONModel({
                    kpis: {
                        total: 0,
                        assigned: 0,
                        available: 0,
                        maintenance: 0,
                        retired: 0,
                        archived: 0
                    },
                    categories: [],
                    statuses: [],
                    lastUpdated: "Loading..."
                });

                this.getView().setModel(oDashboardModel, "dashboard");
                this._configureCharts();
                this._loadDashboardData();
            },

            _configureCharts: function () {
                this._configureCategoryChart();
                this._configureStatusChart();
            },

            _configureCategoryChart: function () {
                const oVizFrame = this.byId("assetCategoryChart");
                const oDataset = new FlattenedDataset({
                    dimensions: [{ name: "Category", value: "{dashboard>Category}" }],
                    measures: [{ name: "Assets", value: "{dashboard>Count}" }],
                    data: { path: "dashboard>/categories" }
                });

                oVizFrame.setDataset(oDataset);
                oVizFrame.addFeed(new FeedItem({ uid: "size", type: "Measure", values: ["Assets"] }));
                oVizFrame.addFeed(new FeedItem({ uid: "color", type: "Dimension", values: ["Category"] }));
                oVizFrame.setVizProperties({
                    title: { visible: false },
                    legend: { visible: true, position: "right" },
                    plotArea: {
                        dataLabel: { visible: true, type: "value" },
                        drawingEffect: "glossy"
                    }
                });
            },

            _configureStatusChart: function () {
                const oVizFrame = this.byId("assetStatusChart");
                const oDataset = new FlattenedDataset({
                    dimensions: [{ name: "Status", value: "{dashboard>Status}" }],
                    measures: [{ name: "Assets", value: "{dashboard>Count}" }],
                    data: { path: "dashboard>/statuses" }
                });

                oVizFrame.setDataset(oDataset);
                oVizFrame.addFeed(new FeedItem({ uid: "size", type: "Measure", values: ["Assets"] }));
                oVizFrame.addFeed(new FeedItem({ uid: "color", type: "Dimension", values: ["Status"] }));
                oVizFrame.setVizProperties({
                    title: { visible: false },
                    legend: { visible: true, position: "right" },
                    plotArea: {
                        dataLabel: { visible: true, type: "value" },
                        drawingEffect: "glossy"
                    }
                });
            },

            _loadDashboardData: function () {
                const oODataModel = this.getView().getModel();
                const oDashboardModel = this.getView().getModel("dashboard");
                const oPage = this.byId("dashboardPage");

                oPage.setBusy(true);

                const oAssetsBinding = oODataModel.bindList(
                    "/AssetsSrv",
                    null,
                    null,
                    null,
                    {
                        $expand: "assetCategory($select=name)",
                        $select: "asset_id,status,assetCategory"
                    }
                );

                oAssetsBinding.requestContexts().then(function (aContexts) {
                    const aAssets = aContexts.map(function (oContext) {
                        return oContext.getObject();
                    });

                    const oKpis = {
                        total: aAssets.length,
                        assigned: this._countBy(aAssets, "status", "ASSIGNED"),
                        available: this._countBy(aAssets, "status", "AVAILABLE"),
                        maintenance: this._countBy(aAssets, "status", "MAINTENANCE"),
                        retired: this._countBy(aAssets, "status", "RETIRED"),
                        archived: this._countBy(aAssets, "status", "ARCHIVED")
                    };

                    const oCategoryCounts = {};
                    const oStatusCounts = {};

                    aAssets.forEach(function (oAsset) {
                        const sCategory = oAsset.assetCategory && oAsset.assetCategory.name
                            ? oAsset.assetCategory.name
                            : "Uncategorized";
                        const sStatus = oAsset.status || "Unknown";

                        oCategoryCounts[sCategory] = (oCategoryCounts[sCategory] || 0) + 1;
                        oStatusCounts[sStatus] = (oStatusCounts[sStatus] || 0) + 1;
                    });

                    const aCategories = Object.keys(oCategoryCounts).map(function (sCategory) {
                        return { Category: sCategory, Count: oCategoryCounts[sCategory] };
                    }).sort(function (a, b) {
                        return b.Count - a.Count;
                    });

                    const aStatuses = Object.keys(oStatusCounts).map(function (sStatus) {
                        return {
                            Status: sStatus.replace(/_/g, " "),
                            Count: oStatusCounts[sStatus]
                        };
                    }).sort(function (a, b) {
                        return b.Count - a.Count;
                    });

                    oDashboardModel.setProperty("/kpis", oKpis);
                    oDashboardModel.setProperty("/categories", aCategories);
                    oDashboardModel.setProperty("/statuses", aStatuses);
                    oDashboardModel.setProperty("/lastUpdated", new Date().toLocaleString());
                }.bind(this)).catch(function (oError) {
                    MessageBox.error("Unable to load live dashboard data. Please refresh and try again.");
                    oDashboardModel.setProperty("/lastUpdated", "Data unavailable");
                    console.error(oError);
                }).finally(function () {
                    oPage.setBusy(false);
                });
            },

            _countBy: function (aItems, sProperty, sValue) {
                return aItems.filter(function (oItem) {
                    return oItem[sProperty] === sValue;
                }).length;
            },

            onRefresh: function () {
                this._loadDashboardData();
            },

            onAssetManagement: function () {
                window.location.href = "/asset.lifecycle.assetui/index.html";
            },

            onEmployeeManagement: function () {
                window.location.href = "/asset.lifecycle.employeeui/index.html";
            },

            onAssignmentManagement: function () {
                window.location.href = "/asset.lifecycle.assetassignmentui/index.html";
            },

            onMaintenanceManagement: function () {
                window.location.href = "/asset.lifecycle.maintenanceui/index.html";
            },

            onOwnershipLedger: function () {
                window.location.href = "/asset.lifecycle.ownershipledgerui/index.html";
            },

            onArchiveManagement: function () {
                window.location.href = "/asset.lifecycle.archiveui/index.html";
            },

            onReports: function () {
                window.location.href = "/asset.lifecycle.reportsui/index.html";
            },

            onManagerDashboard: function () {
                window.location.href = "/asset.lifecycle.managerdashboardui/index.html";
            },

            onEmployeeDashboard: function () {
                window.location.href = "/asset.lifecycle.employeedashboardui/index.html";
            }
        }
    );
});
