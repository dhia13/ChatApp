const jwt = require("jsonwebtoken");
const { verifyToken, generateToken } = require("./Jwt");
// Middleware function to protect routes
const checkToken = (req, res, next) => {
  // Get the access token from the request cookies
  const accessToken = req.cookies.accessToken;

  // If there is no access token, return an error
  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    // Verify the access token
    const decoded = verifyToken(accessToken, "access");
    // Attach the decoded user information to the request object
    req.user = decoded;
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If the access token is invalid or expired, return an error
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = checkToken;
