const Joi = require('joi');

const _id = Joi.string().hex().min(12).max(24);
const firstName = Joi.string().min(3).max(25);
const lastName = Joi.string().min(3).max(25);
const alias = Joi.string().min(3).max(25);
const typeId = Joi.string().valid('cedula', 'pasaporte', 'tarjeta de identidad', 'cedula de extranjeria', 'permiso de residencia');
const numberId = Joi.string().min(5).max(25);
const mobile = Joi.number().integer().min(3000000000).max(3999999999);
const email = Joi.string().email();
const notifications = Joi.object({
  isAccepted: Joi.boolean().default(false),
  via: Joi.string().valid('email', 'sms', 'whatsapp').default('email'),});
const _idCompany = Joi.string().hex().min(12).max(24);
const maxStress = Joi.number().integer().min(0).max(1000);
const currentStress = Joi.number().integer().min(0).max(1000);
// const createdAt = Joi.date().iso();
// const updatedAt = Joi.date().iso();

const schema = {
	create: Joi.object({
		firstName: firstName,
		lastName: lastName,
		alias: alias,
		typeId: typeId,
		numberId: numberId,
		mobile: mobile.required(),
		email: email.required(),
		notifications: notifications,
		_idCompany: _idCompany,
		maxStress: maxStress,
		currentStress: currentStress,
	}),
	update: Joi.object({
		firstName: firstName,
		lastName: lastName,
		alias: alias,
		typeId: typeId,
		numberId: numberId,
		mobile: mobile,
		email: email,
		notifications: notifications,
		_idCompany: _idCompany,
		maxStress: maxStress,
		currentStress: currentStress,
	}),
	get: Joi.object({
		id: _id.required(),
	}),
	search: Joi.object({
		firstName: firstName,
		lastName: lastName,
		alias: alias,
		typeId: typeId,
		numberId: numberId,
		mobile: mobile,
		email: email,
		notifications: notifications,
		_idCompany: _idCompany,
		maxStress: maxStress,
		currentStress: currentStress,
	}),
};

module.exports = {
  schema,
};
