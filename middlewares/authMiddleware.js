const { User } = require('../models/User');
const { verifyToken } = require('../utils/jwt');
const { logger } = require('../utils/logger');

async function AuthMiddleware(req, res, next) {
  try {
    if (req.cookies?.refreshToken) {
      const refreshToken = req.cookies.refreshToken;
      const decoded = verifyToken(refreshToken, 'refresh');
      if (decoded) {
        const user = await User.findById(decoded);
        req.user = user;
        next();
      }
    }
    next();
  } catch (error) {
    logger.Logger.error(error.msg);

    next();
  }
}
module.exports = AuthMiddleware;
