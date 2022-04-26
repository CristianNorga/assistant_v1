const { companyModel } = require('./company.model');
const { ObjectId } = require('mongodb');
const { schema } = require('./company.schema');
const centerManage = require('../../utils/center.manage');

const companyControllers = {
	access: {
		create: ['1200A', '1200O', '1200', '0030', '0031'],
		read: ['1200A', '1200O', '1200', '1111', '0030', '0032'],
		update: ['1200A', '1200O', '1200', '0030', '0033'],
		delete: ['1200A', '1200O', '1200', '0030', '0034'],
	},
	async create(req) {
		centerManage.check.roles(this.access.create, req.user.permissions);

		req.body = centerManage.schema.attempt(schema.create, req.body);

		let today = new Date().toISOString();
		req.body.createdAt = today;
		req.body.updatedAt = today;

		const result = await companyModel.create(req.body);
		return result;
	},
	async getAll(req) {
		centerManage.check.roles(this.access.read, req.user.permissions);
		const result = await companyModel.getAll({});
		return result;
	},
	async getOne(req) {
		centerManage.check.roles(this.access.read, req.user.permissions);
		req.params = centerManage.schema.attempt(schema.get, req.params);

		const result = await companyModel.getOne({
			_id: new ObjectId(req.params.id),
		});
		return result;
	},
	async search(req) {
		centerManage.check.roles(this.access.read, req.user.permissions);
		req.body = centerManage.schema.attempt(schema.search, req.body);

		const result = await companyModel.getAll(req.body);
		return result;
	},
	async update(req, res) {
		centerManage.check.roles(this.access.update, req.user.permissions);

		req.params = centerManage.schema.attempt(schema.get, req.params);

		req.body = centerManage.schema.attempt(schema.update, req.body, res);

		let today = new Date().toISOString();
		req.body.updatedAt = today;

		const update = { $set: req.body };
		const filter = { _id: new ObjectId(req.params.id) };
		const result = await companyModel.update(filter, update);
		return result;
	},
	async delete(req) {
		centerManage.check.roles(this.access.delete, req.user.permissions);
		req.params = centerManage.schema.attempt(schema.get, req.params);

		const result = await companyModel.delete({
			_id: new ObjectId(req.params.id),
		});
		return result;
	},
};

exports.companyControllers = companyControllers;
