sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend(
        "asset.lifecycle.reportsui.controller.Reports",
        {

            onInit() {
            },

            onAssetReport() {
                window.location.href =
                "/asset.lifecycle.assetui/index.html";
            },

            onEmployeeReport() {
                window.location.href =
                "/asset.lifecycle.employeeui/index.html";
            },

            onMaintenanceReport() {
                window.location.href =
                "/asset.lifecycle.maintenanceui/index.html";
            },

            onAssignmentReport() {
                window.location.href =
                "/asset.lifecycle.assetassignmentui/index.html";
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

                const lines = [];
                lines.push({ text: title, x: margin, y: 800, size: 18 });
                lines.push({ text: `Generated: ${generatedAt}`, x: margin, y: 778, size: 9 });

                let y = 742;
                columns.forEach((column, index) => {
                    lines.push({
                        text: column,
                        x: margin + (index * columnWidth),
                        y,
                        size: 9
                    });
                });

                y -= rowHeight;
                rows.forEach((row) => {
                    row.forEach((value, index) => {
                        lines.push({
                            text: String(value ?? ""),
                            x: margin + (index * columnWidth),
                            y,
                            size: 8
                        });
                    });
                    y -= rowHeight;
                });

                const content = [
                    "BT",
                    ...lines.map((line) =>
                        `/F1 ${line.size} Tf 1 0 0 1 ${line.x.toFixed(2)} ${line.y.toFixed(2)} Tm (${this._escapePdfText(line.text)}) Tj`
                    ),
                    "ET"
                ].join("\n");

                const objects = [
                    "<< /Type /Catalog /Pages 2 0 R >>",
                    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
                    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>`,
                    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
                    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`
                ];

                let pdf = "%PDF-1.4\n";
                const offsets = [0];
                objects.forEach((object, index) => {
                    offsets[index + 1] = pdf.length;
                    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
                });

                const xrefOffset = pdf.length;
                pdf += `xref\n0 ${objects.length + 1}\n`;
                pdf += "0000000000 65535 f \n";
                for (let i = 1; i <= objects.length; i += 1) {
                    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
                }
                pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

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

            onExportAssets() {
                this._downloadPdf(
                    "Asset Report",
                    ["Asset Tag", "Model", "Status"],
                    [
                        ["LAP001", "Dell Latitude", "AVAILABLE"],
                        ["MOB001", "iPhone 15", "ASSIGNED"],
                        ["MON001", "HP Monitor", "AVAILABLE"]
                    ],
                    "AssetReport.pdf"
                );
            },

            onExportEmployees() {
                this._downloadPdf(
                    "Employee Report",
                    ["Employee Name", "Email", "Location"],
                    [
                        ["John Doe", "john@company.com", "Chennai"],
                        ["Jane Smith", "jane@company.com", "Bangalore"]
                    ],
                    "EmployeeReport.pdf"
                );
            },

            onExportMaintenance() {
                this._downloadPdf(
                    "Maintenance Report",
                    ["Maintenance ID", "Status", "Cost"],
                    [
                        ["M001", "COMPLETED", "5000"],
                        ["M002", "PENDING", "2500"]
                    ],
                    "MaintenanceReport.pdf"
                );
            },

            onExportAssignments() {
                this._downloadPdf(
                    "Assignment Report",
                    ["Assignment ID", "Status", "Remarks"],
                    [
                        ["A001", "ASSIGNED", "Laptop issued"],
                        ["A002", "RETURNED", "Asset returned"]
                    ],
                    "AssignmentReport.pdf"
                );
            }

        }
    );
});
