const express = require('express');
const socketRoutes = express.Router();
const socketController = require('../../controllers/socket');

const attachSocketRoutes = (io) => {
  socketController(io);

  // Additional routes for Socket.IO can be defined here if needed
};

module.exports = attachSocketRoutes;
