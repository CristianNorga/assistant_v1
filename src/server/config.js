/* eslint-disable no-console */
require('dotenv').config();

const mode = process.env.MODE || 'development';
const config = {
  uri: undefined,
  user: undefined,
  password: undefined,
  cluster: undefined,
  database: undefined,
  jwtSecret: undefined,
  smtpEmail: undefined,
  smtpPassword: undefined,
}

function getURI(user, password, cluster, database) {
  const encodeUser = encodeURIComponent(user);
  const encodePassword = encodeURIComponent(password);
    return `mongodb+srv://${encodeUser}:${encodePassword}@${cluster}.ctsee.mongodb.net/${database}?retryWrites=true&w=majority`;
}

if (mode === 'development') {
  config.user = process.env.DEV_MA_USER;
  config.password = process.env.DEV_MA_PASSWORD;
  config.cluster = process.env.DEV_MA_CLUSTER;
  config.database = process.env.DEV_MA_DATABASE;
  config.jwtSecret = process.env.DEV_JWT_SECRET;
  config.smtpEmail = process.env.DEV_SMTP_EMAIL;
  config.smtpPassword = process.env.DEV_SMTP_PASSWORD;
  config.alexaPassword = process.env.DEV_ALEXA_PASSWORD;
  config.uri = getURI(
    process.env.DEV_MA_USER,
    process.env.DEV_MA_PASSWORD,
    process.env.DEV_MA_CLUSTER,
    process.env.DEV_MA_DATABASE
  );
  console.info('Using development mode');
} else if (mode === 'production') {
  config.user = process.env.PRO_MA_USER;
  config.password = process.env.PRO_MA_PASSWORD;
  config.cluster = process.env.PRO_MA_CLUSTER;
  config.database = process.env.PRO_MA_DATABASE;
  config.jwtSecret = process.env.PRO_JWT_SECRET;
  config.smtpEmail = process.env.PRO_SMTP_EMAIL;
  config.smtpPassword = process.env.PRO_SMTP_PASSWORD;
  config.alexaPassword = process.env.PRO_ALEXA_PASSWORD;
  config.uri = getURI(
    process.env.PRO_MA_USER,
    process.env.PRO_MA_PASSWORD,
    process.env.PRO_MA_CLUSTER,
    process.env.PRO_MA_DATABASE
  );
  console.info('Using production mode');
} else {
  console.error('please especified a valid MODE');
}

module.exports = { config };
