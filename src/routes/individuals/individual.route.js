const express = require('express');
const centerManage = require('../../utils/center.manage');
const { individualControllers } = require('./individual.controller');
const passport = require('passport');

const router = express.Router();

router.post('/',
passport.authenticate('jwt', { session: false }),
async function (req, res) {
  try {
    let result = await individualControllers.create(req);
    res.status = 200;
    res.send({
      response: 'ok',
      message: result,
    });
  } catch (error) {
    centerManage.boom.handler(error, res);
  }
});

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const result = await individualControllers.getAll(req);
      res.status(200);
      res.send({
        response: 'ok',
        message: result,
      });
    } catch (error) {
      centerManage.boom.handler(error, res);
    }
  }
);

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const result = await individualControllers.getOne(req, res);
      res.status(200);
      res.send({
        response: 'ok',
        message: result,
      });
    } catch (error) {
      centerManage.boom.handler(error, res);
    }
  }
);

router.get(
	'/search',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		try {
			const result = await individualControllers.search(req, res);
			res.status(200);
			res.send({
				response: 'ok',
				message: result,
			});
		} catch (error) {
			centerManage.boom.handler(error, res);
		}
	}
);

router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const result = await individualControllers.update(req, res);
      res.status(200);
      res.send({
        response: 'ok',
        message: result,
      });
    } catch (error) {
      centerManage.boom.handler(error, res);
    }
  }
);

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const result = await individualControllers.delete(req, res);
      res.status(200);
      res.send({
        response: 'ok',
        message: result,
      });
    } catch (error) {
      centerManage.boom.handler(error, res);
    }
  }
);

module.exports = router;
