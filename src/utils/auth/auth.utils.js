const LocalStrategy = require('./strategies/local.strategy');
const JwtStrategy = require('./strategies/jwt.strategy');

const auth = {
  initStrategies(passport) {
    passport.use(LocalStrategy);
    passport.use(JwtStrategy);
  },
}

module.exports = auth;



