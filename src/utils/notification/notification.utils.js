const nodemailer = require('nodemailer');
const { config } = require('../../server/config');

const notifications = {
	async send (individual = {}, priority = false) {
		if (!priority) {
			//evalua si el usuario tiene el permiso
		}

		let via = individual.notifications.via;
		switch (via) {
			case 'email':
				await this.viaEmail(individual);
				break;

			default:
				break;
		}
	},

 	async viaEmail(req) {
		const email = {
			from: config.smtpEmail,
			to: `${req.email}`,
			subject: 'email para registrar dispositivo',
			html: `<b>Ingresa a este link => ${req.link}</b>`,
		};

		const transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			secure: true,
			port: 465,
			auth: {
				user: config.smtpEmail,
				pass: config.smtpPassword,
			},
		});
		let result = await transporter.sendMail(email);
		if (result.rejected.length > 0) {
			throw new Error('Error al enviar el correo');
		}
	},
};

module.exports = notifications;
