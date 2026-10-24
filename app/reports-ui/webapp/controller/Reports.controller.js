sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller, MessageToast) => {
    "use strict";

    return Controller.extend(
        "asset.lifecycle.reportsui.controller.Reports",
        {
            onInit() {},

            onAssetReport() { window.location.href = "/asset.lifecycle.assetui/index.html"; },
            onEmployeeReport() { window.location.href = "/asset.lifecycle.employeeui/index.html"; },
            onMaintenanceReport() { window.location.href = "/asset.lifecycle.maintenanceui/index.html"; },
            onAssignmentReport() { window.location.href = "/asset.lifecycle.assetassignmentui/index.html"; },

            async _fetchReportData(entity, select, orderby) {
                const params = new URLSearchParams();
                params.set("$select", select);
                if (orderby) params.set("$orderby", orderby);

                const response = await fetch(
                    `/odata/v4/asset-lifecycle/${entity}?${params.toString()}`,
                    {
                        method: "GET",
                        credentials: "include",
                        headers: { "Accept": "application/json" },
                        cache: "no-store"
                    }
                );

                if (!response.ok) {
                    let detail = `Unable to load ${entity} (${response.status}).`;
                    try {
                        const body = await response.json();
                        detail = body?.error?.message || detail;
                    } catch (error) {
                        // Keep the HTTP status message.
                    }
                    throw new Error(detail);
                }

                const payload = await response.json();
                return payload.value || [];
            },

            _formatValue(value) {
                if (value === null || value === undefined || value === "") return "";
                if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}(T|$)/.test(value)) {
                    return value.substring(0, 10);
                }
                return String(value);
            },

            _escapePdfText(text) {
                return String(text ?? "")
                    .replace(/\\/g, "\\\\")
                    .replace(/\(/g, "\\(")
                    .replace(/\)/g, "\\)");
            },

            _downloadPdf(title, columns, rows, filename) {
                const pageWidth = 595;
                const pageHeight = 842;
                const margin = 40;
                const rowHeight = 24;
                const usableWidth = pageWidth - (margin * 2);
                const columnWidth = usableWidth / columns.length;
                const generatedAt = new Date().toLocaleString();
                const rowsPerPage = 27;
                const pageCount = Math.max(1, Math.ceil(rows.length / rowsPerPage));
                const pageContents = [];

                for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
                    const pageRows = rows.slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage);
                    const lines = [
                        { text: title, x: margin, y: 800, size: 18 },
                        { text: `Generated: ${generatedAt}`, x: margin, y: 778, size: 9 },
                        { text: `Page ${pageIndex + 1} of ${pageCount}`, x: pageWidth - 110, y: 778, size: 8 }
                    ];

                    let y = 742;
                    columns.forEach((column, index) => {
                        lines.push({ text: column, x: margin + (index * columnWidth), y, size: 9 });
                    });

                    y -= rowHeight;
                    pageRows.forEach((row) => {
                        row.forEach((value, index) => {
                            lines.push({
                                text: this._formatValue(value),
                                x: margin + (index * columnWidth),
                                y,
                                size: 8
                            });
                        });
                        y -= rowHeight;
                    });

                    pageContents.push([
                        "BT",
                        ...lines.map((line) =>
                            `/F1 ${line.size} Tf 1 0 0 1 ${line.x.toFixed(2)} ${line.y.toFixed(2)} Tm (${this._escapePdfText(line.text)}) Tj`
                        ),
                        "ET"
                    ].join("\n"));
                }

                const objects = [];
                const pageObjectNumbers = [];
                const contentObjectNumbers = [];
                const pagesObjectNumber = 2;
                const fontObjectNumber = 3;
                let nextObjectNumber = 4;

                pageContents.forEach(() => {
                    pageObjectNumbers.push(nextObjectNumber++);
                    contentObjectNumbers.push(nextObjectNumber++);
                });

                objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
                objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";

                pageContents.forEach((content, index) => {
                    objects[pageObjectNumbers[index]] =
                        `<< /Type /Page /Parent ${pagesObjectNumber} 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${fontObjectNumber} 0 R >> >> /Contents ${contentObjectNumbers[index]} 0 R >>`;
                    objects[contentObjectNumbers[index]] =
                        `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
                });

                objects[pagesObjectNumber] =
                    `<< /Type /Pages /Kids [${pageObjectNumbers.map((number) => `${number} 0 R`).join(" ")}] /Count ${pageCount} >>`;

                let pdf = "%PDF-1.4\n";
                const offsets = [0];
                const objectCount = nextObjectNumber - 1;

                for (let index = 1; index <= objectCount; index += 1) {
                    offsets[index] = pdf.length;
                    pdf += `${index} 0 obj\n${objects[index]}\nendobj\n`;
                }

                const xrefOffset = pdf.length;
                pdf += `xref\n0 ${objectCount + 1}\n`;
                pdf += "0000000000 65535 f \n";
                for (let index = 1; index <= objectCount; index += 1) {
                    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
                }
                pdf += `trailer\n<< /Size ${objectCount + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

                const blob = new Blob([pdf], { type: "application/pdf" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            },

            async _exportReport(config) {
                try {
                    MessageToast.show(`Loading ${config.title}...`);
                    const records = await this._fetchReportData(config.entity, config.select, config.orderby);
                    const rows = records.map(config.mapRow);
                    this._downloadPdf(config.title, config.columns, rows, config.filename);
                    MessageToast.show(`${config.title} downloaded (${rows.length} record${rows.length === 1 ? "" : "s"}).`);
                } catch (error) {
                    console.error(error);
                    MessageToast.show(`Report download failed: ${error.message}`);
                }
            },

            onExportAssets() {
                return this._exportReport({
                    title: "Asset Report",
                    entity: "AssetsSrv",
                    select: "asset_tag,serial_number,model,purchase_date,purchase_cost,status",
                    orderby: "asset_tag",
                    columns: ["Asset Tag", "Serial Number", "Model", "Purchase Date", "Cost", "Status"],
                    mapRow: (asset) => [asset.asset_tag, asset.serial_number, asset.model, asset.purchase_date, asset.purchase_cost, asset.status],
                    filename: "AssetReport.pdf"
                });
            },

            onExportEmployees() {
                return this._exportReport({
                    title: "Employee Report",
                    entity: "EmployeesSrv",
                    select: "full_name,email,phone,location,status",
                    orderby: "full_name",
                    columns: ["Employee Name", "Email", "Phone", "Location", "Status"],
                    mapRow: (employee) => [employee.full_name, employee.email, employee.phone, employee.location, employee.status],
                    filename: "EmployeeReport.pdf"
                });
            },

            onExportMaintenance() {
                return this._exportReport({
                    title: "Maintenance Report",
                    entity: "MaintenanceRecordsSrv",
                    select: "maintenance_id,type,reported_date,completed_date,status,cost,outcome",
                    orderby: "reported_date desc",
                    columns: ["Maintenance ID", "Type", "Reported", "Completed", "Status", "Cost", "Outcome"],
                    mapRow: (maintenance) => [maintenance.maintenance_id, maintenance.type, maintenance.reported_date, maintenance.completed_date, maintenance.status, maintenance.cost, maintenance.outcome],
                    filename: "MaintenanceReport.pdf"
                });
            },

            onExportAssignments() {
                return this._exportReport({
                    title: "Assignment Report",
                    entity: "AssetAssignmentsSrv",
                    select: "assignment_id,assigned_date,expected_return_date,actual_return_date,assignment_status,remarks",
                    orderby: "assigned_date desc",
                    columns: ["Assignment ID", "Assigned", "Expected Return", "Actual Return", "Status", "Remarks"],
                    mapRow: (assignment) => [assignment.assignment_id, assignment.assigned_date, assignment.expected_return_date, assignment.actual_return_date, assignment.assignment_status, assignment.remarks],
                    filename: "AssignmentReport.pdf"
                });
            }
        }
    );
});
