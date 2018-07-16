const Record = require('../models/record');

const SUCCESS_MESSAGE = 'Done!';
const ERROR_MESSAGE = 'Error!';
const RECORD_ID_NAME = '_id';

const getParameters = (req) => {
  const params = {};
  if (!req.user.admin) params.userID = req.user.id;
  if (req.query.priority) params.priority = req.query.priority;
  if (req.query.status) params.status = req.query.status;
  if (req.body.recordID) params[RECORD_ID_NAME] = req.body.recordID;
  return params;
};

module.exports = {
  create: (req, res) => {
    req.body.userID = req.user.id;
    Record.create(req.body)
      .then(() => res.send(SUCCESS_MESSAGE))
      .catch(err => res.send(err));
  },

  read: (req, res) => {
    Record.find(getParameters(req))
      .then(records => res.send(records))
      .catch(err => res.send(err));
  },

  update: (req, res) => {
    Record.findOneAndUpdate(getParameters(req), req.body)
      .then(() => res.send(SUCCESS_MESSAGE))
      .catch(() => res.send(ERROR_MESSAGE));
  },

  delete: (req, res) => {
    Record.findOneAndRemove(getParameters(req))
      .then(() => res.send(SUCCESS_MESSAGE))
      .catch(() => res.send(ERROR_MESSAGE));
  },
};
