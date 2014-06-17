var AclRolePermissionSchema = function AclRolePermissionSchema(mongoose) {
    var Schema = mongoose.Schema;
    var ObjectId = Schema.ObjectId;

    var AclRolePermissionSchema = new Schema({
        roleId: ObjectId,
        permissionId: ObjectId,
        created: Number,
        modified: Number,
        active: Boolean
    });
    AclRolePermissionSchema.index({roleId: 1, permissionId: 1}, {unique:true});

    return AclRolePermissionSchema;
};

module.exports = AclRolePermissionSchema;
