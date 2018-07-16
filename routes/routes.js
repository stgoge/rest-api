const express = require('express');
const passport = require('passport');
const UsersController = require('../controllers/user');
const RecordsController = require('../controllers/record');
const { validateData, schemas } = require('./route-helpers');
const { checkDbConnection } = require('../mongo/connect-mongo');
require('../js/passport');

const passportLocal = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });
const validateUserData = validateData(schemas.authSchema);
const validateRecordData = validateData(schemas.recordSchema);

const router = express.Router();

router.route('/signup')
  .post(checkDbConnection, validateUserData, UsersController.signUp);

router.route('/signin')
  .post(checkDbConnection, validateUserData, passportLocal, UsersController.signIn);

router.route('/records')
  .post(checkDbConnection, validateRecordData, passportJWT, RecordsController.create);

router.route('/records')
  .get(checkDbConnection, passportJWT, RecordsController.read);

router.route('/records')
  .put(checkDbConnection, validateRecordData, passportJWT, RecordsController.update);

router.route('/records')
  .delete(checkDbConnection, passportJWT, RecordsController.delete);

module.exports = router;
