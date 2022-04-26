const Joi = require('joi');

const _id = Joi.string().hex().min(12).max(24);
const email = Joi.string().email();
const password = Joi.string()
  .pattern(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  )
  .min(8)
  .max(25);

const role = Joi.string().valid('owner', 'Dev', 'Admin', 'employee', 'supplier', 'client');
const permissions = Joi.array().items(Joi.string());
const isActive = Joi.boolean();
const isValid = Joi.boolean();
// const createdAt = Joi.date().iso();
// const updatedAt = Joi.date().iso();

const schema = {
	create: Joi.object({
		email: email.required(),
		password: password.required(),
		role: role,
		permissions: permissions,
		isActive: isActive,
		isValid: isValid,
	}),
	update: Joi.object({
		email: email,
		password: password,
		role: role,
		permissions: permissions,
		isActive: isActive,
		isValid: isValid,
	}),
	get: Joi.object({
		id: _id.required(),
	}),
	changePassword: Joi.object({
		id: _id.required(),
		password: password.required(),
	}),
	search: Joi.object({
		email: email,
	}),
};

module.exports = {
  schema,
};
