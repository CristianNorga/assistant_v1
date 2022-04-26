const express = require('express');
const passport = require('passport');
const centerManage  = require('../../utils/center.manage');

const { AuthControllers } = require('./auth.controller');
// const { userControllers } = require('../users/user.controller');

const router = express.Router();
// const service = new AuthService();

router.post(
  '/login',
  passport.authenticate('local',
  { session: false, failureRedirect: '/' }),
  async (req, res) => {
    try {
      const user = req.user;
      res.json(AuthControllers.user.signToken(user));
    } catch (error) {
      centerManage.boom.handler(error, res);
    }
  }
);

router.get(
	'/verify-device',
	async (req, res) => {
		try {
      AuthControllers.device.authenticate(req);
      await AuthControllers.device.search(req);
			const user = await AuthControllers.user.search({ email: req.email });
      delete user.password;
			res.status(200);
			res.send({
				response: 'ok',
				message: AuthControllers.user.signToken(user),
			});
		} catch (error) {
			centerManage.boom.handler(error, res);
		}
	}
);

router.post(
  '/register-device',
  async (req, res) => {
    try {
      
      AuthControllers.device.authenticate(req);

      let msg;
      if(req.query.token) {
        msg = await AuthControllers.device.active(req.query.token);
      } else {
        msg = await AuthControllers.notify.activeDevice(req);
      }

      res.status(200);
      res.send({
        response: 'ok',
        message: msg,
      });
    } catch (error) {
      centerManage.boom.handler(error, res);
    }
  }
);

// router.post('/register-device?', async (req, res) => {
// 	try {
// 		AuthControllers.device.authenticate(req);
// 		let msg = await AuthControllers.send.activeDevice(req);
// 		res.status(200);
// 		res.send({
// 			response: 'ok',
// 			message: msg,
// 		});
// 	} catch (error) {
// 		centerManage.boom.handler(error, res);
// 	}
// });

router.post('/recovery',
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const rta = await AuthControllers.sendRecovery(email);
      res.json(rta);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/change-password',
  async (req, res, next) => {
    try {
      const { token, newPassword } = req.body;
      const rta = await AuthControllers.changePassword(token, newPassword);
      res.json(rta);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
