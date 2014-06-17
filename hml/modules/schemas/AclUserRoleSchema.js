var AclUserRoleSchema = function AclUserRoleSchema(mongoose) {
    var Schema = mongoose.Schema;
    var ObjectId = Schema.ObjectId;

    var AclUserRoleSchema = new Schema({
        userId: ObjectId,
        roleId: ObjectId,
        created: Number,
        modified: Number,
        active: Boolean
    });
    AclUserRoleSchema.index({userId: 1, roleId: 1}, {unique:true});

    return AclUserRoleSchema;
};

module.exports = AclUserRoleSchema;
