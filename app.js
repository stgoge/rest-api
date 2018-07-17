const initServer = require('./js/init-server');
const { connectMongo } = require('./mongo/connect-mongo');
const createAdmin = require('./js/create-admin');

const startServer = async () => {
  console.log('0');
  const server = await initServer();
  console.log('1');
  const mongoose = await connectMongo();
  console.log('2');
  await createAdmin();
  return { server, mongoose };
};

module.exports = startServer;
