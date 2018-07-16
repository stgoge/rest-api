const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const JWT = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const User = require('../models/user');

const JWT_FIELD = 'authorization';
const JWT_SECRET = 'somesecreeeet';
const JWT_EXPIRATION_HOURS = 240;

module.exports = user => JWT.sign({
  id: user.id,
  admin: user.admin,
  exp: (Math.floor(new Date().getTime() / 1000) + (JWT_EXPIRATION_HOURS * 60 * 60)),
}, JWT_SECRET);

passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromHeader(JWT_FIELD),
    secretOrKey: JWT_SECRET,
  },
  (payload, done) => {
    User.findById(payload.id)
      .then(user => done(null, user));
  },
));

passport.use(new LocalStrategy({}, (username, password, done) => {
  User.findOne({ username }).maxTime(1)
    .then((user) => {
      done(null, (bcrypt.compareSync(password, user.password)) ? user : false);
    });
}));
