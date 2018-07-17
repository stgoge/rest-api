const express = require('express');
const bodyParser = require('body-parser');
const router = require('../routes/routes');

const app = express();
const port = 3000;

module.exports = async () => {
  app.use(bodyParser.json());
  app.use(router);
  await app.listen(port);
  console.log(`listening on :${port}`);
  return app;
};
