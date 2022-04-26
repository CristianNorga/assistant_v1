const { userModel } = require('./user.model');
const { ObjectId } = require('mongodb');
const { schema } = require('./user.schema');
const bcrypt = require('bcrypt');
const centerManage = require('../../utils/center.manage');

const userControllers = {
	access: {
		create: ['1200A', '1200O', '1200', '0010', '0011'],
		read: ['1200A', '1200O', '1200', '1111', '0010', '0012'],
		update: ['1200A', '1200O', '1200', '0010', '0013'],
		delete: ['1200A', '1200O', '1200', '0010', '0014'],
	},
	async create(req) {
		centerManage.check.roles(this.access.create, req.user.permissions);
		req.body = centerManage.schema.attempt(schema.create, req.body);

		// req.body.permissions = req.body.permissions.split(',');

		let today = new Date().toISOString();
		req.body.createdAt = today;
		req.body.updatedAt = today;

		req.body.password = await bcrypt.hash(req.body.password, 10);

		const result = await userModel.create(req.body);

		return result;
	},
	async getAll(req) {
		centerManage.check.roles(this.access.read, req.user.permissions);
		const result = await userModel.getAll({});
		return result;
	},
	async getOne(req, nested = false) {
		if (!nested) {
			centerManage.check.roles(this.access.read, req.user.permissions);
		}
		req.params = centerManage.schema.attempt(schema.get, req.params);

		const result = await userModel.getOne({
			_id: new ObjectId(req.params.id),
		});
		return result;
	},

	async search(req, nested = false) {
		if (!nested) {
			centerManage.check.roles(this.access.read, req.user.permissions);
		}
		req.body = centerManage.schema.attempt(schema.search, req.body);
		const result = await userModel.getAll(req.body);
		return result;
	},

	async update(req) {
		centerManage.check.roles(this.access.update, req.user.permissions);

		req.params = centerManage.schema.attempt(schema.get, req.params);

		req.body = centerManage.schema.attempt(schema.update, req.body);

		let today = new Date().toISOString();
		req.body.updatedAt = today;

		const update = { $set: req.body };
		const filter = { _id: new ObjectId(req.params.id) };
		const result = await userModel.update(filter, update);
		return result;
	},
	async delete(req) {
		centerManage.check.roles(this.access.delete, req.user.permissions);
		req.params = centerManage.schema.attempt(schema.get, req.params);

		const result = await userModel.delete({
			_id: new ObjectId(req.params.id),
		});
		return result;
	},
};

exports.userControllers = userControllers;
