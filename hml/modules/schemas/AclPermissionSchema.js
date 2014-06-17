var AclPermissionSchema = function AclPermissionSchema(mongoose) {
    var tree = require('mongoose-tree');

    var Schema = mongoose.Schema;
    var ObjectId = Schema.ObjectId;

    var AclPermissionSchema = new Schema({
        name: { type: String, unique: true },
        description: String,
        created: Number,
        modified: Number,
        deletable: Boolean,
        active: Boolean
    });
    AclPermissionSchema.plugin(tree);

    return AclPermissionSchema;
};

module.exports = AclPermissionSchema;
