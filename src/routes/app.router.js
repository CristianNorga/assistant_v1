const express = require('express');

const auth = require('./auth/auth.route');
const usersRoute = require('./users/user.route');
const individualsRoute = require('./individuals/individual.route');
const companiesRoute = require('./companies/company.route');
const worksRoute = require('./works/work.route');
// const tasksRoute = require('./tasks/task.route');
// const servicesRoute = require('./servicesc/service.route');
// const toDo = require('./toDo/toDo.route');

function routerApi(app) {
	const router = express.Router();
	app.use('/api/v1', router);
	router.use('/auth', auth);
	router.use('/users', usersRoute);
	router.use('/individuals', individualsRoute);
	router.use('/companies', companiesRoute);
	router.use('/works', worksRoute);
	// router.use('/tasks', tasksRoute);
	// router.use('/services', servicesRoute);
	// router.use('/todo', toDo);
}

module.exports = routerApi;
