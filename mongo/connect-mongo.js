const mongoose = require('mongoose');
const settings = require('./mongo-settings');

const ConnectionMessage = {
  SUCCESS: 'MongoDB connected',
  ERROR: 'MongoDB connection failed: ',
  DISCONNECTED: 'MongoDB disconnected',
  RECONNECTED: 'MongoDB reconnected',
};
const NO_CONNECTION_MESSAGE = 'no db connection, try again later';
const NO_CONNECTION_ERROR = 503;
const RECONNECT_INTERVAL = 10000;
const CONNECTION_STRING = `mongodb://${settings.PATH}`;
const OPTIONS = {
  user: settings.USER,
  pass: settings.PASSWORD,
  dbName: settings.NAME,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: RECONNECT_INTERVAL,
  useNewUrlParser: true,
};

mongoose.connection.once('open', () => {
  console.log(ConnectionMessage.SUCCESS);

  mongoose.connection.on('disconnected', () => {
    console.log(ConnectionMessage.DISCONNECTED);
  });

  mongoose.connection.on('reconnected', () => {
    console.log(ConnectionMessage.RECONNECTED);
  });

  mongoose.connection.on('error', (err) => {
    console.log(`${ConnectionMessage.ERROR}${err.message}`);
  });
});

const connectMongo = (tryCounter) => {
  tryCounter = (tryCounter !== undefined) ? tryCounter + 1 : 0;
  mongoose.connect(CONNECTION_STRING, OPTIONS)
    .catch(() => {
      console.log(`Trying to connect (${tryCounter})`);
      setTimeout(connectMongo, RECONNECT_INTERVAL, tryCounter);
    });
};

const checkDbConnection = (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(NO_CONNECTION_ERROR).send(NO_CONNECTION_MESSAGE);
  }
};

module.exports = {
  connectMongo,
  checkDbConnection,
};
