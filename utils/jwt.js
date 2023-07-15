const jwt = require("jsonwebtoken");

// Function to generate an access token
const generateToken = (id, type) => {
  let secret;
  let time;
  switch (type) {
    case "refresh":
      secret = process.env.REFRESH_TOKEN_SECRET;
      time = "7d";
      break;
    case "access":
      secret = process.env.ACCESS_TOKEN_SECRET;
      time = "15m";
      break;
    case "email":
      secret = process.env.EMAIL_TOKEN_SECRET;
      time = "20m";
      break;
    case "password":
      secret = process.env.PASSWORD_RESET_TOKEN_SECRET;
      time = "20m";
      break;
    default:
      // Handle unsupported token types
      throw new Error("Unsupported token type");
  }
  const token = jwt.sign({ id }, secret, {
    expiresIn: time,
  });
  return token;
};
const verifyToken = (token, type) => {
  let secret;
  switch (type) {
    case "refresh":
      secret = process.env.REFRESH_TOKEN_SECRET;
      break;
    case "access":
      secret = process.env.ACCESS_TOKEN_SECRET;
      break;
    case "email":
      secret = process.env.EMAIL_TOKEN_SECRET;
      break;
    case "password":
      secret = process.env.PASSWORD_RESET_TOKEN_SECRET;
      break;
    default:
      // Handle unsupported token types
      throw new Error("Unsupported token type");
  }
  try {
    const data = jwt.verify(token, secret);
    return data.id;
  } catch (error) {
    throw new Error('Invalid token')
  }
};
module.exports = { generateToken, verifyToken };
