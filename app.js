const initServer = require('./js/init-server');
const { connectMongo } = require('./mongo/connect-mongo');
const createAdmin = require('./js/create-admin');

initServer();
connectMongo();
createAdmin();
