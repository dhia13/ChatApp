const { User } = require('../models/User');
const sendMail = require('../utils/mailer.js');
const { CLIENT_URL } = process.env;
const { generateToken, verifyToken } = require('../utils/jwt.js');
const jwt = require('jsonwebtoken');

const userCtrl = {
  initData: async (req, res) => {
    try {
      if (req?.user?.data) {
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
      } else {
        res.status(400).json({ msg: 'bad request' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  },
};

module.exports = userCtrl;
