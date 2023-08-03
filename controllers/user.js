const { User } = require('../models/User');
const sendMail = require('../utils/mailer.js');
const { CLIENT_URL } = process.env;
const { generateToken, verifyToken } = require('../utils/jwt.js');
const jwt = require('jsonwebtoken');

const userCtrl = {
  initData: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.name,
        confirmedEmail: user.confirmedEmail,
        username: user.username,
        gender: user.gender,
        img: user.img,
        birthday: user.birthday,
        unseenNotificationsCount: user.unseenNotificationsCount,
        unseenIvitesCount: user.unseenIvitesCount,
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  },
};

module.exports = userCtrl;
