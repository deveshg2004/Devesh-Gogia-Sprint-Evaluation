using { asset.lifecycle as common } from './common';

namespace asset.lifecycle;

// Stores information about company departments
entity Department {
    key dept_id      : UUID;
        name         : String(80);
        cost_center  : String(20);
        employees    : Association to many Employee on employees.department = $self;
}

// Stores employee details and their department
entity Employee {
    key employee_id : UUID;
        full_name   : String(100);
        email       : String(100);
        phone       : String(10);
        location    : String(100);
        status      : common.EmployeeStatus;
        department  : Association to Department;
}
// Defines different categories of IT assets
entity AssetCategory {
    key asset_category_id : UUID;
        name              : String(50);
        lifespan_months   : Integer;
        assets            : Association to many Asset on assets.assetCategory = $self;
}
// Stores vendor information
entity Vendor {
    key vendor_id : UUID;
        name      : String(100);
        email     : String(100);
        assets    : Association to many Asset on assets.vendor = $self;
}

// Stores IT asset information
entity Asset {
    key asset_id                 : UUID;
        asset_tag                : String(20);
        serial_number            : String(50);
        assetCategory            : Association to AssetCategory;
        vendor                   : Association to Vendor;
        model                    : String(100);
        purchase_date            : Date;
        purchase_cost            : Decimal(10,2);
        warranty_expiry          : Date;
        first_distribution_date  : Date;
        status                   : common.AssetStatus;
        current_holder           : Association to Employee;
}

// Tracks assignment of assets
entity AssetAssignment {
    key assignment_id            : UUID;
        asset                    : Association to Asset;
        employee                 : Association to Employee;
        assigned_by              : Association to Employee;
        assigned_date            : Timestamp;
        expected_return_date     : Date;
        actual_return_date       : Date;
        assignment_status        : common.AssignmentStatus;
        remarks                  : String(500);
}

// Maintains the history of ownership/asset transfers
entity OwnershipLedger {
    key ledger_id                : UUID;
        asset                    : Association to Asset;
        from_employee            : Association to Employee;
        to_employee              : Association to Employee;
        action                   : common.LedgerAction;
        transition_date          : Date;
        recorded_by              : Association to Employee;
        notes                    : String(500);
        created_at               : Timestamp;
}

// Stores maintenance and service history of assets
entity MaintenanceRecord {
    key maintenance_id           : UUID;
        asset                    : Association to Asset;
        type                     : String(50);
        reported_by              : Association to Employee;
        service_vendor           : Association to Vendor;
        reported_date            : Date;
        completed_date           : Date;
        status                   : common.MaintenanceStatus;
        outcome                  : String(255);
        cost                     : Decimal(10,2);
        covered_by_warranty      : Boolean;
        next_due_date            : Date;
        description              : String(1000);
}


// Stores retired/archived asset information
entity ArchiveRecord {
    key archive_id               : UUID;
        asset                    : Association to Asset;
        archived_at              : Timestamp;
        archived_by              : Association to Employee;
        reason                   : String(255);
        disposal_method          : String(50);
        disposal_cert_no         : String(40);
}