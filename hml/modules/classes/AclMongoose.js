var Acl = function (mongoose, usermodel) {
    'use strict';
	var Fiber = require('fibers');
	var tree = require('mongoose-tree');

	var logger = console;

	var Schema = mongoose.Schema;
	var ObjectId = Schema.ObjectId;

	var AclRoleSchema = require('../schemas/AclRoleSchema')(mongoose);
	var AclRole = mongoose.model('AclRole', AclRoleSchema);

	var AclPermissionSchema = require('../schemas/AclPermissionSchema')(mongoose);
	var AclPermission = mongoose.model('AclPermission', AclPermissionSchema);

	var AclRolePermissionSchema = new Schema({
		roleId: ObjectId,
		permissionId: ObjectId,
		created: Number,
		modified: Number,
		active: Boolean
	});
	AclRolePermissionSchema.index({roleId: 1, permissionId: 1}, {unique:true});
	var AclRolePermission = mongoose.model('AclRolePermission', AclRolePermissionSchema);

	var AclUserRoleSchema = new Schema({
		userId: ObjectId,
		roleId: ObjectId,
		created: Number,
		modified: Number,
		active: Boolean
	});
	AclUserRoleSchema.index({userId: 1, roleId: 1}, {unique:true});
	var AclUserRole = mongoose.model('AclUserRole', AclUserRoleSchema);

	var User = usermodel;

    function Acl() {
    }

    Acl.prototype.AddRole = function (name, desc, parent, deletable, callback) {
        var now = (new Date()).getTime();

        var role = new AclRole({
            name: name,
            description: desc,
            created: now,
            modified: now,
            deletable: deletable,
            active: true
        });
        if (parent != null) {
            AclRole.findOne({ name: parent }, function(err, par) {
                if (err) return;
                else if (!par) return;
				else {
					role.parent = par._id;
					role.save(function(err) {
						if (!err) callback();
						else {
							AclRole.findOneAndUpdate({ name: role.name }, { $set: { description: role.description, modified: role.modified } }, function (err) {
								if (err) logger.error(err);
								else callback();
							});
						}
					});
				}
            });
        } else {
            role.save(function (err) {
                if (!err) callback();
                else {
                    AclRole.findOneAndUpdate({ name: role.name }, { $set: { description: role.description, modified: role.modified } }, function (err) {
                        if (err) logger.error(err);
                        else callback();
                    });
                }
            });
        }
    };

    Acl.prototype.UpdateRole = function (id, desc, callback) {
        var now = (new Date()).getTime();

        AclRole.findOneAndUpdate({ _id: id }, { $set: { description: desc, modified: now } }, function (err) {
            if (err) logger.error(err);
            else callback();
        });
    };

    Acl.prototype.DeleteRole = function (id, callback) {
        AclRole.remove({ _id: id }).exec();
        AclRole.remove({ parent: id }).exec();
        callback();
    };

    Acl.prototype.GetRolesUnderByName = function (name, callback) {
        var outRoles = [];
        AclRole.findOne({ name: name }, function (err, role) {
            if (err) logger.error(err);
			else if (!role) logger.error(role);

            else {
                outRoles.push(role);
                role.getChildren(true, function (err, roles) {
                    if (err) logger.error(err);
                    else {
                        roles.forEach(function (item, idx) {
                            outRoles.push(item);
                        });
                        callback(outRoles);
                    }
                });
            }
        });
    };

    Acl.prototype.GetRolesUnderById = function (role, callback) {
        var outRoles = [];
        AclRole.findOne({ _id: role }, function (err, role) {
            if (err) logger.error(err);
			else if (!role) logger.error(role);
            else {
                outRoles.push(role);
                role.getChildren(true, function (err, roles) {
                    if (err) logger.error(err);
                    else {
                        roles.forEach(function (item, idx) {
                            outRoles.push(item);
                        });
                        callback(outRoles);
                    }
                });
            }
        });
    };

    Acl.prototype.GetRoles = function (callback) {
        var outRoles = [];
        AclRole.findOne({ name: 'root' }, function (err, role) {
            if (err) logger.error(err);
            else {
                outRoles.push(role);
                role.getChildren(true, function (err, roles) {
                    if (err) logger.error(err);
                    else {
                        roles.forEach(function (item, idx) {
                            outRoles.push(item);
                        });
                        callback(outRoles);
                    }
                });
            }
        });
    };

    Acl.prototype.AddPermission = function (name, desc, parent, deletable, callback) {
        var now = (new Date()).getTime();

        var permission = new AclPermission({
            name: name,
            description: desc,
            created: now,
            modified: now,
            deletable: deletable,
            active: true
        });
        if (parent != null) {
            AclPermission.findOne({ name: parent }, function(err, par) {
                if (err) return;
                permission.parent = par._id;
                permission.save(function(err) {
                    if (!err) callback();
                    else {
                        AclPermission.findOneAndUpdate({ name: permission.name }, { $set: { description: permission.description, modified: permission.modified } }, function (err) {
                            if (err) logger.error(err);
                            else callback();
                        });
                    }
                });
            });
        } else {
            permission.save(function (err) {
                if (!err) callback();
                else {
                    AclPermission.findOneAndUpdate({ name: permission.name }, { $set: { description: permission.description, modified: permission.modified } }, function (err) {
                        if (err) logger.error(err);
                        else callback();
                    });
                }
            });
        }
    };

    Acl.prototype.UpdatePermission = function (id, desc, callback) {
        var now = (new Date()).getTime();

        AclPermission.findOneAndUpdate({ _id: id }, { $set: { description: desc, modified: now } }, function (err) {
            if (err) logger.error(err);
            else callback();
        });
    };

    Acl.prototype.DeletePermission = function (id, callback) {
        AclPermission.remove({ _id: id }).exec();
        AclPermission.remove({ parent: id }).exec();
        callback();
    };

    Acl.prototype.GetPermissionsUnderByName = function (name, callback) {
        var outPermissions = [];
        AclPermission.findOne({ name: name }, function (err, permission) {
            if (err) logger.error(err);
			else if (!permission) logger.error(permission);
            else {
                outPermissions.push(permission);
                permission.getChildren(true, function (err, permissions) {
                    if (err) logger.error(err);
                    else {
                        permissions.forEach(function (item, idx) {
                            outPermissions.push(item);
                        });
                        callback(outPermissions);
                    }
                });
            }
        });
    };

    Acl.prototype.GetPermissionsUnderById = function (id, callback) {
        var outPermissions = [];
        AclPermission.findOne({ _id: id }, function (err, permission) {
            if (err) logger.error(err);
			else if (!permission) logger.error(permission);
            else {
                outPermissions.push(permission);
                permission.getChildren(true, function (err, permissions) {
                    if (err) logger.error(err);
                    else {
                        permissions.forEach(function (item, idx) {
                            outPermissions.push(item);
                        });
                        callback(outPermissions);
                    }
                });
            }
        });
    };

    Acl.prototype.GetPermissions = function (callback) {
        var outPermissions = [];
        AclPermission.findOne({ name: 'all' }, function (err, permission) {
            if (err) logger.error(err);
            else if (!permission) logger.error(err);
            else {
                outPermissions.push(permission);
                permission.getChildren(true, function (err, permissions) {
                    if (err) logger.error(err);
                    else {
                        permissions.forEach(function (item, idx) {
                            outPermissions.push(item);
                        });
                        callback(outPermissions);
                    }
                });
            }
        });
    };

    Acl.prototype.LinkPermissionRoleByName = function (permissionName, roleName, callback) {
        var now = (new Date()).getTime();

		AclPermission.findOne({ name: permissionName }, function(err, permission) {
			if (err) logger.error(err);
			else {
				AclRole.findOne({ name: roleName }, function(err, role) {
					if (err) logger.error(err);
					else if (!role) logger.error(err);
					else {
						var rolepermission = new AclRolePermission({
							roleId: role._id,
							permissionId: permission._id,
							created: now,
							modified: now,
							active: true
						});
						rolepermission.save(function (err) {
							if (!err) callback();
							else {
								AclRolePermission.findOneAndUpdate({ roleId: rolepermission.roleId, permissionId: rolepermission.permissionId }, { $set: { modified: rolepermission.modified, active: true } }, function (err) {
									if (err) logger.error(err);
									else callback();
								});
							}
						});
					}
				});
			}
		});
    };

    Acl.prototype.LinkPermissionRoleById = function (permissionId, roleId, callback) {
        var now = (new Date()).getTime();

        var rolepermission = new AclRolePermission({
            roleId: roleId,
			permissionId: permissionId,
			created: now,
            modified: now,
            active: true
        });
		rolepermission.save(function (err) {
			if (!err) callback();
			else {
				AclRolePermission.findOneAndUpdate({ roleId: rolepermission.roleId, permissionId: rolepermission.permissionId }, { $set: { modified: rolepermission.modified, active: true } }, function (err) {
					if (err) logger.error(err);
					else callback();
				});
			}
		});
    };

    Acl.prototype.UnLinkPermissionRole = function (permissionId, roleId, callback) {
		AclRolePermission.remove({ roleId: roleId, permissionId: permissionId });
		callback();
    };

    Acl.prototype.LinkRoleUserByRoleName = function (roleName, userId, callback) {
        var now = (new Date()).getTime();

		AclRole.findOne({ name: roleName }, function(err, role) {
			if (err) logger.error(err);
			else if (!role) logger.error(role);
			else {
				var userrole = new AclUserRole({
					userId: userId,
					roleId: role._id,
					created: now,
					modified: now,
					active: true
				});
				userrole.save(function (err) {
					if (!err) callback();
					else {
						AclUserRole.findOneAndUpdate({ userId: userrole.userId, roleId: userrole.roleId }, { $set: { modified: userrole.modified, active: true } }, function (err) {
							if (err) logger.error(err);
							else callback();
						});
					}
				});
			}
		});
    };

    Acl.prototype.LinkRoleUserByName = function (roleName, userName, identifier, callback) {
        var now = (new Date()).getTime();

		AclRole.findOne({ name: roleName }, function(err, role) {
			if (err) logger.error(err);
			else if (!role) logger.error(role);
			else {
				User.findOne( (new Function("return {'" + identifier + "': '" + userName + "'};"))(), function(err, user) {
					if (err) logger.error(err);
					else if (!user) logger.error(user);
					else {
						var userrole = new AclUserRole({
							userId: user._id,
							roleId: role._id,
							created: now,
							modified: now,
							active: true
						});
						userrole.save(function (err) {
							if (!err) callback();
							else {
								AclUserRole.findOneAndUpdate({ userId: userrole.userId, roleId: userrole.roleId }, { $set: { modified: userrole.modified, active: true } }, function (err) {
									if (err) logger.error(err);
									else callback();
								});
							}
						});
					}
				});
			}
		});
    };

    Acl.prototype.LinkRoleUserById = function (roleId, userId, callback) {
        var now = (new Date()).getTime();

        var userrole = new AclUserRole({
            userId: userId,
			roleId: roleId,
			created: now,
            modified: now,
            active: true
        });
		userrole.save(function (err) {
			if (!err) callback();
			else {
				AclUserRole.findOneAndUpdate({ userId: userrole.userId, roleId: userrole.roleId }, { $set: { modified: userrole.modified, active: true } }, function (err) {
					if (err) logger.error(err);
					else callback();
				});
			}
		});
    };

    Acl.prototype.UnLinkRoleUser = function (roleId, userId, callback) {
		AclUserRole.remove({ userId: userId, roleId: roleId });
		callback();
    };

    Acl.prototype.GetPermissionsForRole = function (name, callback) {
		Fiber(function() {
			var outPermissions = [];
			var Server = require('mongo-sync').Server;
			var mongoSync = new Server(AclRolePermission.db.host);
			var Db = mongoSync.db(AclRolePermission.db.name);
			var rolesCollection = Db.getCollection('aclroles');
			var rolepermissionsCollection = Db.getCollection('aclrolepermissions');
			var permissionsCollection = Db.getCollection('aclpermissions');
			var baseRole = rolesCollection.findOne( { name: name } );
			if (baseRole) {
				var rolesUnderRole = rolesCollection.find( { path: new RegExp(baseRole._id, 'ig') } ).toArray();
				rolesUnderRole.forEach(function(roles, idx) {
					var rolepermissions = rolepermissionsCollection.find( { roleId: roles._id } ).toArray();
					rolepermissions.forEach(function(rolepermission, idx) {
						var permissions = permissionsCollection.find( { path: new RegExp(rolepermission.permissionId, 'ig') } ).toArray();
						permissions.forEach(function (item, idx) {
							if (!~outPermissions.indexOf(item.name)) outPermissions.push(item.name);
						});
					});
				});
				callback(outPermissions);
			}
		}).run();
    };

    Acl.prototype.GetRolesForUser = function (name, identifier, callback) {
		Fiber(function() {
			var outRoles = [];
			var Server = require('mongo-sync').Server;
			var mongoSync = new Server(User.db.host);
			var Db = mongoSync.db(User.db.name);
			var usersCollection = Db.getCollection('users');
			var userrolesCollection = Db.getCollection('acluserroles');
			var rolesCollection = Db.getCollection('aclroles');
			var user = usersCollection.findOne( (new Function("return {'" + identifier + "': '" + name + "'};"))() );
			if (user) {
				var userroles = userrolesCollection.find( { userId: user._id} ).toArray();
				userroles.forEach(function(userrole, idx) {
					var roles = rolesCollection.find({ path: new RegExp(userrole.roleId, 'ig') }).toArray();
					roles.forEach(function (item, idx) {
						if (!~outRoles.indexOf(item.name)) outRoles.push(item.name);
					});
				});
				callback(outRoles);
			}
		}).run();
    };

    return Acl;
};

module.exports = Acl;
