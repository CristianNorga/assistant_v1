const express = require('express');
const centerManage = require('../../utils/center.manage');
const { companyControllers } = require('./company.controller');
const passport = require('passport');

const router = express.Router();

router.post('/',
passport.authenticate('jwt', { session: false }),
async function (req, res) {
  try {
    let result = await companyControllers.create(req);
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
      const result = await companyControllers.getAll(req);
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
      const result = await companyControllers.getOne(req, res);
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
			const result = await companyControllers.search(req, res);
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
      const result = await companyControllers.update(req, res);
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
      const result = await companyControllers.delete(req, res);
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
