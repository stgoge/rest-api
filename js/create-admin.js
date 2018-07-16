const User = require('../models/user');

module.exports = () => {
  User.findOne({ admin: true })
    .then((found) => {
      if (!found) {
        const admin = new User({ username: 'admin', password: 'admin', admin: true });
        admin.save();
      }
    });
};
