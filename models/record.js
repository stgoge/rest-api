const mongoose = require('mongoose');

const { Schema } = mongoose;

const recordSchema = new Schema({
  userID: String,
  record: String,
  date: Date,
  priority: {
    type: Number,
    default: 0,
  },
  status: {
    type: Number,
    default: 0,
  },
});

const Record = mongoose.model('record', recordSchema);

module.exports = Record;
