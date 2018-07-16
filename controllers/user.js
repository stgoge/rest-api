const User = require('../models/user');
const signToken = require('../js/passport');

const NameExistsError = {
  CODE: 403,
  TEXT: 'Username is already exists',
};

module.exports = {
  signUp: (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username })
      .then((userName) => {
        if (userName) {
          res.status(NameExistsError.CODE).json({ error: NameExistsError.TEXT });
        } else {
          const newUser = new User({ username, password, admin: false });
          newUser.save()
            .then(() => res.json({ token: signToken(newUser) }))
            .catch(error => res.status(process.env.INTERNAL_ERROR_CODE).json(error));
        }
      });
  },
  signIn: (req, res) => {
    const token = signToken(req.user);
    res.json({ token });
  },
};
