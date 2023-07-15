const { User } = require("../models/User");
const sendMail = require("../utils/mailer.js");
const { CLIENT_URL } = process.env;
const { generateToken, verifyToken } = require("../utils/Jwt.js");
const jwt = require("jsonwebtoken");

const userCtrl = {
  
};

module.exports = userCtrl;
