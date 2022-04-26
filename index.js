//Requires
const express = require('express');
const cors = require('cors');
const routerApi = require('./src/routes/app.router.js');
const centerManage = require('./src/utils/center.manage');
// const { AuthControllers } = require('./src/routes/auth/auth.controller');
const passport = require('passport');

// Inicializar configuracion
const app = express();

// apis autorizadas
// const whitelist = ['http://localhost:3000', 'https://myapp.co'];
// const options = {
// 	origin: (origin, callback) => {
// 		if (whitelist.includes(origin) || !origin) {
// 			callback(null, true);
// 		} else {
// 			callback(new Error('no permitido'));
// 		}
// 	},
// };
// app.use(cors(options));
app.use(cors());

//procesamiento de las peticiones
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());

app.get('/', (req, res) => {
	res.send('Hola, el server se encuentra activo :)');
});

routerApi(app);
centerManage.auth.initStrategies(passport);

//static file
// app.use(express.static(__dirname + '/public'));

// Lanzamiento del servidor

app.set('PORT', process.env.PORT || 3000);
app.set('HOST', process.env.HOST || 'localhost');
app.set('PROTOCOL', process.env.HTTPS ? 'https' : 'http');
app.listen(app.get('PORT'), () => {
	
	centerManage.log.info(
		`Server started on port: ${app.get('PROTOCOL')}://${app.get(
			'HOST'
		)}:${app.get('PORT')}`
	);
});
