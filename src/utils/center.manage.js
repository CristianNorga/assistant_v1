const boom = require('@hapi/boom');
const { config } = require('../server/config');
// const mails = require('./mails/mail');
const { ObjectId } = require('mongodb');
const Joi = require('joi');
// const routerStrategies = require('./auth/index.js');
const notifications = require('./notification/notification.utils');
const auth = require('./auth/auth.utils');

const centerManage = {
	schema: {
		attempt(schema, object) {
			try {
				const result = Joi.attempt(object, schema);
				return result;
			} catch (error) {
				throw boom.preconditionFailed('Precondition Failed');
			}
		},
		validate(schema, object) {
			const { error } = schema.validate(object, { abortEarly: false });
			if (error) {
				throw boom.preconditionFailed('Precondition Failed');
			}
		},
	},
	boom: {
		create(type, message) {
			const error = new Error(message);
			throw boom.boomify(error, { statusCode: type });
		},
		handler(err, res) {
			try {
				const { output } = err;
				res.status(output.statusCode).json(output.payload);
			} catch (error) {
				centerManage.log.error(error);
			}
		},
	},
	log: {
		error(err) {
			// eslint-disable-next-line no-console
			console.error('🔻🔻 ##Error## 🔻🔻\n' + err + '\n--- ##Error Finish## ---');
		},
		info(inf) {
			// eslint-disable-next-line no-console
			console.info('👇👇 ·· info ·· 👇👇\n' + inf + '\n--- ·· info finish ·· ---');
		},
	},
	check: {
		apiKey(req, res, next) {
			const apiKey = req.headers['api'];
			if (apiKey === config.apiKey) {
				next();
			} else {
				next(boom.unauthorized());
			}
		},
		roles(permissions, codesUser) {
			let check = permissions.some((permission) => {
				return codesUser.includes(permission);
			});

			if (!check) {
				throw boom.unauthorized('Unauthorized');
			}
		},
	},
	validateTypes: {
		anyId(params, schema) {
			let filter, type;
			if (isNaN(params.id)) {
				params = centerManage.shema.attempt(schema.getById, params);
				filter = { _id: new ObjectId(params.id) };
				type = 'id';
			} else {
				params = centerManage.shema.attempt(schema.getByShortId, params);
				filter = { shortId: params.id };
				type = 'shortId';
			}

			return { filter: filter, type: type };
		},
	},
	auth: auth,
	notifications: notifications,
	// async sendMail(to, subject, type, message) {
	// 	let template = mails[type](subject, message);
	// 	const mail = {
	// 		from: config.smtpEmail,
	// 		to: `${to}`,
	// 		subject: `${subject}`,
	// 		html: `${template}`,
	// 	};
	// 	const transporter = nodemailer.createTransport({
	// 		host: 'smtp.gmail.com',
	// 		secure: true,
	// 		port: 465,
	// 		auth: {
	// 			user: config.smtpEmail,
	// 			pass: config.smtpPassword,
	// 		},
	// 	});
	// 	await transporter.sendMail(email);
	// 	return { result: 'mail sent' };
	// },
};

// exports.userControllers = userControllers;
module.exports = centerManage;