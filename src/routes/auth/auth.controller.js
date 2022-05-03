const boom = require('@hapi/boom');
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const axios = require('axios').default;

const { ObjectId } = require('mongodb');

const { config } = require('../../server/config');
const { userModel } = require('../users/user.model');
const { individualModel } = require('../individuals/individual.model');
const centerManage = require('../../utils/center.manage');


const AuthControllers = {
	user: {
		async search(filter) {
			const user = await userModel.getOne(filter);
			return user;
		},
		signToken(user) {
			const payload = {
				_id: user._id,
				role: user.role,
				permissions: user.permissions,
				// company: user._idCompany || null,
			};
			const token = jwt.sign(payload, config.jwtSecret);
			return {
				token,
			};
		},
	},
	device: {
		// async test() {
		// 	try {
		// 		console.log('test iniT');
		// 		let route = '/api/v1/auth/verify-device';
		// 		let url = 'http://localhost:3000' + route;
		// 		let payload = {
		// 			email: 'test@correo.com',
		// 			deviceId: '123456789',
		// 			alexaPassword: config.alexaPassword,
		// 		};
		// 		let result = await axios.get(url, {data: payload});
	
		// 		console.log('result', result);
		// 	} catch (error) {
		// 		console.log('error', error);				
		// 	}

		// },
		async search(req) {
			const individual = await individualModel.getOne({ email: req.body.email });
			if (!individual) throw boom.unauthorized('No autorizado');

			let devices = individual.devices;

			if (!devices) throw boom.notFound('No se encontró ningun dispositivo');

			devices = devices.find((device) => device.id === req.body.deviceId);

			if (!devices) throw boom.notFound('No existe el dispositivo');

			if (!devices.isActived) throw boom.preconditionFailed('El dispositivo no esta activo');

		},
		authenticate(req) {
			if (!req.body.alexaPassword) throw boom.unauthorized('No autorizado');
			if (!(config.alexaPassword == req.body.alexaPassword))
				throw boom.unauthorized('No autorizado');
		},
		// async register(req) {
		// 	const individual = await individualModel.getOne({ email: req.body.email });
		// 	individual.devices.push({
		// 		id: req.body.deviceId,
		// 		isValid: false,
		// 	});
		// 	await individualModel.update(individual);
		// },
		async active(token) {
			try {

				const payload = jwt.verify(token, config.jwtSecret);

				const individual = await individualModel.getOne({
					_id: new ObjectId(payload.sub),
				});

				if (individual.token !== token) throw boom.unauthorized();

				let device = {
					_id: payload.deviceId,
					isActived: true,
					alias: payload.alias,
				};

				
				individual.devices.push(device);
				
				let body = {
					devices: individual.devices,
				};
				// req.body = {
				// 	devices: individual.devices,
				// };
				let update = { $set: body };

				await individualModel.update({ _id: individual._id }, update);

				return 'Dispositivo activado';
			} catch (error) {
				throw boom.unauthorized();
			}
		},
	},
	notify: {
		async activeDevice(req) {
			try {
				const individual = await individualModel.getOne({ email: req.body.email });

				const payload = { sub: individual._id, deviceId: req.body.deviceId, alias: req.body.alias };
				const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '15min' });
				const link = `http://myfrontend.com/recovery?token=${token}`; //cambiar

				individual.token = token;

				req.body = {
					token: token,
				};

				const update = { $set: req.body };
				await individualModel.update({ _id: individual._id }, update);

				individual.link = link;

				await centerManage.notifications.send(individual, true);

				return 'Se ha enviado una notificación con el link para activar el dispositivo';
			} catch (error) {
				throw boom.badRequest();
			}
		},
	},

	// async sendRecovery(email) {
	//   const user = await service.findByEmail(email);
	//   if (!user) {
	//     throw boom.unauthorized();
	//   }
	//   const payload = { sub: user.id };
	//   const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '15min' });
	//   const link = `http://myfrontend.com/recovery?token=${token}`;
	//   await service.update(user.id, { recoveryToken: token });
	//   const email = {
	//     from: config.smtpEmail,
	//     to: `${user.email}`,
	//     subject: 'email para recuperar contraseña',
	//     html: `<b>Ingresa a este link => ${link}</b>`,
	//   };
	//   const rta = await this.sendMail(email);
	//   return rta;
	// },

	// async changePassword(token, newPassword) {
	//   try {
	//     const payload = jwt.verify(token, config.jwtSecret);
	//     const user = await service.findOne(payload.sub);
	//     if (user.recoveryToken !== token) {
	//       throw boom.unauthorized();
	//     }
	//     const hash = await bcrypt.hash(newPassword, 10);
	//     await service.update(user.id, { recoveryToken: null, password: hash });
	//     return { message: 'password changed' };
	//   } catch (error) {
	//     throw boom.unauthorized();
	//   }
	// },

	// async sendMail(infoMail) {
	//   const transporter = nodemailer.createTransport({
	//     host: 'smtp.gmail.com',
	//     secure: true,
	//     port: 465,
	//     auth: {
	//       user: config.smtpEmail,
	//       pass: config.smtpPassword,
	//     },
	//   });
	//   await transporter.sendMail(infoMail);
	//   return { message: 'mail sent' };
	// }
};

exports.AuthControllers = AuthControllers;

// module.exports = AuthService;
