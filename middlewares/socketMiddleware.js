// socketMiddleware.js

const socketIo = require('socket.io');
const { User } = require('../models/User');
const { emitOnlineStatusToContacts } = require('../utils/socketsTools');
// Function to create and set up the WebSocket server
function setupSocketServer(server) {
  const socketMap = new Map();
  const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:3000',
    },
  });
  io.on('connection', async (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      socketMap.set(userId, socket);
      console.log(`User with ID ${userId} connected.`);
      try {
        await User.findByIdAndUpdate(userId, {
          isOnline: true,
        });
        const user = await User.findById(userId).select('contacts');
        const contacts = user.contacts;
        emitOnlineStatusToContacts(socketMap, contacts, userId, true);
      } catch (error) {
        console.error('Error updating user socketId:', error);
      }
    }
    // Handle disconnections and remove the socket from the map
    socket.on('disconnect', async () => {
      if (userId) {
        socketMap.delete(userId);
        console.log(`User with ID ${userId} disconnected.`);
        try {
          await User.findByIdAndUpdate(userId, {
            isOnline: false,
          });
        } catch (error) {
          console.error('Error updating user socketId:', error);
        }
        const user = await User.findById(userId).select('contacts');
        const contacts = user.contacts;
        emitOnlineStatusToContacts(socketMap, contacts, userId, false);
      }
    });
  });
  // Custom middleware to pass the io object to routes
  function socketMiddleware(req, res, next) {
    req.io = io;
    req.socketMap = socketMap;
    next();
  }

  return socketMiddleware;
}

module.exports = setupSocketServer;
