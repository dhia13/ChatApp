const { User } = require('../models/User');
const { verifyToken } = require('../utils/jwt');
const { logger } = require('../utils/logger');

async function AuthMiddleware(req, res, next) {
  try {
    // Check if the request contains a refreshToken cookie
    if (req?.cookies?.refreshToken) {
      const refreshToken = req.cookies.refreshToken;
      const decoded = verifyToken(refreshToken, 'refresh');

      if (decoded) {
        const user = await User.findById(decoded);
        req.user = user;
      }
    }
    // Route that requires Authentication
    const requiresAuth = [
      '/api/v1/findChatRoom',
      '/api/v1/getMessages',
      '/api/v1/initData',
      '/api/v1/newMessage',
      '/api/v1/rooms',
      '/api/v1/contactsList',
      '/api/v1/invitesList',
      '/api/v1/requestsList',
      '/api/v1/request',
      '/api/v1/cancelRequest/:id',
      '/api/v1/ignoreRequest/:id',
      '/api/v1/invitesSeen',
      '/api/v1/acceptInvite',
      '/api/v1/contact/:id',
      '/api/v1/contacts',
      '/api/v1/contact',
      '/api/v1/clearNotifications',
      '/api/v1/readNotifications',
      '/api/v1/notificationsList',
    ];

    // If the route requires authentication but the user is not authenticated, return unauthorized
    console.log(req.url);
    if (requiresAuth.includes(req.url) && !req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
  } catch (error) {
    logger.Logger.error(error.msg);
    res.status(500).json({ msg: 'auth problem' });
  }
}

module.exports = AuthMiddleware;
