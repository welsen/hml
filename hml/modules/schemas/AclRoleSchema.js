var AclRoleSchema = function AclRoleSchema(mongoose) {
	var tree = require('mongoose-tree');

	var Schema = mongoose.Schema;
	var ObjectId = Schema.ObjectId;

	var AclRoleSchema = new Schema({
		name: {
			type: String,
			unique: true
		},
		description: String,
		created: Number,
		modified: Number,
		deletable: Boolean,
		active: Boolean
	});
	AclRoleSchema.plugin(tree);

	return AclRoleSchema;
};

module.exports = AclRoleSchema;
