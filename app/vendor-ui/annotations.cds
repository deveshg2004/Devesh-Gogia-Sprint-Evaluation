using AssetLifecycleService as service from '../../srv/asset-service';

annotate service.VendorsSrv with @(
    UI.HeaderInfo : {
        TypeName : 'Vendor',
        TypeNamePlural : 'Vendors',
        Title : {
            $Type : 'UI.DataField',
            Value : name,
        },
        Description : {
            $Type : 'UI.DataField',
            Value : email,
        },
    },
    UI.FieldGroup #General : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'Name',
                Value : name,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Email',
                Value : email,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneralInformation',
            Label : 'General Information',
            Target : '@UI.FieldGroup#General',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'Vendor Name',
            Value : name,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Email',
            Value : email,
        },
    ],
);
