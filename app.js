const initServer = require('./js/init-server');
const { connectMongo } = require('./mongo/connect-mongo');
const createAdmin = require('./js/create-admin');

const startServer = async () => {
  const server = await initServer();
  const mongoose = await connectMongo();
  await createAdmin();
  return { server, mongoose };
};

module.exports = startServer;
