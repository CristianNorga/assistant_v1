const { Strategy } = require('passport-local');
const bcrypt = require('bcrypt');
const { userModel } = require('../../../routes/users/user.model');
const boom = require('@hapi/boom');

// const { AuthControllers } = require('./../../../routes/auth/auth.controller');

const validateUser = async(email, password) => {
  const user = await userModel.getOne({ email: email });
  if (!user) throw boom.unauthorized();

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw boom.unauthorized();

  if (!user.isActived || !user.isValid) throw boom.unauthorized();
  // delete user.dataValues.password;

  return user;
}

const LocalStrategy = new Strategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      const user = await validateUser(email, password);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);

module.exports = LocalStrategy;
