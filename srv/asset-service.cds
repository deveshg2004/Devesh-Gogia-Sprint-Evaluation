using { asset.lifecycle as db } from '../db/schema';

@(requires: 'authenticated-user')
service AssetLifecycleService {

    type CurrentUserContext {
        role   : String;
        userId : String;
    }

    function getCurrentUserContext() returns CurrentUserContext;

    @(requires: 'Admin')
    entity DepartmentsSrv as projection on db.Department;

    @(requires: ['Admin','Manager'])
    entity EmployeesSrv as projection on db.Employee;

    @restrict: [
        { grant: 'READ', to: ['Admin', 'Manager'] },
        { grant: ['CREATE', 'UPDATE', 'DELETE'], to: 'Admin' }
    ]
    entity VendorsSrv as projection on db.Vendor;

    // Vendor CRUD

    @(requires: 'Admin')
    action createVendor(
        @title: 'Vendor ID'
        vendor_id : UUID,

        @title: 'Vendor Name'
        name : String,

        @title: 'Email'
        email : String
    ) returns array of VendorsSrv;

    @(requires: 'Admin')
    action updateVendor(
        @title: 'Vendor ID'
        vendor_id : UUID,

        @title: 'Vendor Name'
        name : String,

        @title: 'Email'
        email : String
    ) returns String;

    @(requires: 'Admin')
    action deleteVendor(
        @title: 'Vendor ID'
        vendor_id : UUID
    ) returns String;

    @(requires: ['Admin','Manager'])
    entity AssetCategoriesSrv as projection on db.AssetCategory;

    @restrict: [
        { grant: 'READ', to: ['Admin', 'Manager'] },
        { grant: ['CREATE', 'UPDATE', 'DELETE'], to: 'Admin' }
    ]
    entity AssetsSrv as projection on db.Asset;

    @(requires: ['Admin','Manager'])
    entity AssetAssignmentsSrv as projection on db.AssetAssignment;

    @(requires: 'Admin')
    entity OwnershipLedgersSrv as projection on db.OwnershipLedger;

    @(requires: ['Admin','Manager'])
    entity MaintenanceRecordsSrv as projection on db.MaintenanceRecord;

    @(requires: 'Admin')
    entity ArchiveRecordsSrv as projection on db.ArchiveRecord;

    // Business Actions

    @(requires: ['Admin','Manager'])
    action AssignAsset(
        @title: 'Asset ID'
        assetId : UUID,

        @title: 'Employee ID'
        employeeId : UUID
    ) returns String;

    @(requires: ['Admin','Manager'])
    action TransferAsset(
        @title: 'Asset ID'
        assetId : UUID,

        @title: 'From Employee ID'
        fromEmployeeId : UUID,

        @title: 'To Employee ID'
        toEmployeeId : UUID
    ) returns String;

    @(requires: ['Admin','Manager'])
    action ReturnAsset(
        @title: 'Asset ID'
        assetId : UUID
    ) returns String;

    @(requires: ['Admin','Manager'])
    action RetireAsset(
        @title: 'Asset ID'
        assetId : UUID,

        @title: 'Reason'
        reason : String
    ) returns String;

    @(requires: 'Admin')
    action ArchiveAsset(
        @title: 'Asset ID'
        assetId : UUID,

        @title: 'Reason'
        reason : String
    ) returns String;

    // Manager raises requests to Admin

    @(requires: ['Admin','Manager'])
    action RequestAsset(
        @title: 'Employee ID'
        employeeId : UUID,

        @title: 'Asset ID'
        assetId : UUID
    ) returns String;

    @(requires: 'Admin')
    action ApproveAssetRequest(
        @title: 'Assignment ID'
        assignmentId : UUID
    ) returns String;

    @(requires: ['Admin','Manager'])
    action CompleteMaintenance(
        @title: 'Maintenance ID'
        maintenanceId : UUID
    ) returns String;

    // Employee CRUD

    @(requires: ['Admin','Manager'])
    action createEmployee(
        @title: 'Employee ID'
        employee_id : UUID,

        @title: 'Employee Name'
        full_name : String,

        @title: 'Email'
        email : String,

        @title: 'Phone Number'
        phone : String,

        @title: 'Location'
        location : String,

        @title: 'Status'
        status : String
    ) returns array of EmployeesSrv;

    @(requires: ['Admin','Manager'])
    action updateEmployee(
        @title: 'Employee ID'
        employee_id : UUID,

        @title: 'Email'
        email : String,

        @title: 'Phone Number'
        phone : String,

        @title: 'Location'
        location : String,

        @title: 'Status'
        status : String
    ) returns String;

    @(requires: 'Admin')
    action deleteEmployee(
        @title: 'Employee ID'
        employee_id : UUID
    ) returns String;

    // Asset CRUD

    @(requires: 'Admin')
    action createAsset(
        @title: 'Asset ID'
        asset_id : UUID,

        @title: 'Asset Tag'
        asset_tag : String,

        @title: 'Serial Number'
        serial_number : String,

        @title: 'Model'
        model : String,

        @title: 'Purchase Cost'
        purchase_cost : Decimal(10,2)
    ) returns array of AssetsSrv;

    @(requires: 'Admin')
    action updateAsset(
        @title: 'Asset ID'
        asset_id : UUID,

        @title: 'Status'
        status : String
    ) returns String;

    @(requires: 'Admin')
    action deleteAsset(
        @title: 'Asset ID'
        asset_id : UUID
    ) returns String;

    // Maintenance CRUD

    @(requires: ['Admin','Manager'])
    action createMaintenanceRecord(
        @title: 'Maintenance ID'
        maintenance_id : UUID,

        @title: 'Maintenance Type'
        type : String,

        @title: 'Status'
        status : String,

        @title: 'Cost'
        cost : Decimal(10,2)
    ) returns array of MaintenanceRecordsSrv;

    @(requires: ['Admin','Manager'])
    action updateMaintenanceRecord(
        @title: 'Maintenance ID'
        maintenance_id : UUID,

        @title: 'Status'
        status : String
    ) returns String;

    @(requires: 'Admin')
    action deleteMaintenanceRecord(
        @title: 'Maintenance ID'
        maintenance_id : UUID
    ) returns String;

    // Asset Assignment CRUD

    @(requires: ['Admin','Manager'])
    action createAssetAssignment(
        @title: 'Assignment ID'
        assignment_id : UUID,

        @title: 'Asset Tag'
        asset_tag : String,

        @title: 'Employee Email'
        employee_email : String,

        @title: 'Assigned Date'
        assigned_date : DateTime,

        @title: 'Expected Return Date'
        expected_return_date : DateTime,

        @title: 'Assignment Status'
        assignment_status : String,

        @title: 'Remarks'
        remarks : String
    ) returns array of AssetAssignmentsSrv;

    @(requires: ['Admin','Manager'])
    action updateAssetAssignment(
        @title: 'Assignment ID'
        assignment_id : UUID,

        @title: 'Assignment Status'
        assignment_status : String,

        @title: 'Remarks'
        remarks : String
    ) returns String;

    @(requires: 'Admin')
    action deleteAssetAssignment(
        @title: 'Assignment ID'
        assignment_id : UUID
    ) returns String;

    // Department CRUD

    @(requires: 'Admin')
    action createDepartment(
        @title: 'Department ID'
        dept_id : UUID,

        @title: 'Department Name'
        name : String,

        @title: 'Cost Center'
        cost_center : String
    ) returns array of DepartmentsSrv;

    @(requires: 'Admin')
    action updateDepartment(
        @title: 'Department ID'
        dept_id : UUID,

        @title: 'Department Name'
        name : String,

        @title: 'Cost Center'
        cost_center : String
    ) returns String;

    @(requires: 'Admin')
    action deleteDepartment(
        @title: 'Department ID'
        dept_id : UUID
    ) returns String;

    // Archive CRUD

    @(requires: 'Admin')
    action createArchiveRecord(
        @title: 'Archive ID'
        archive_id : UUID,

        @title: 'Archived At'
        archived_at : Timestamp,

        @title: 'Reason'
        reason : String,

        @title: 'Disposal Method'
        disposal_method : String,

        @title: 'Disposal Certificate Number'
        disposal_cert_no : String
    ) returns array of ArchiveRecordsSrv;

    @(requires: 'Admin')
    action updateArchiveRecord(
        @title: 'Archive ID'
        archive_id : UUID,

        @title: 'Reason'
        reason : String,

        @title: 'Disposal Method'
        disposal_method : String,

        @title: 'Disposal Certificate Number'
        disposal_cert_no : String
    ) returns String;

    @(requires: 'Admin')
    action deleteArchiveRecord(
        @title: 'Archive ID'
        archive_id : UUID
    ) returns String;
}