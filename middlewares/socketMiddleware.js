// socketMiddleware.js
const SocketController = require('../controllers/SocketController');
const socketIo = require('socket.io');
// Function to create and set up the WebSocket server
function setupSocketServer(server) {
  const socketMap = new Map();
  const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:3000',
    },
  });
  io.on('connection', async (socket) => {
    SocketController.handShake(socket, socketMap);
    socket.on('sendMsg', async (data) => {
      SocketController.transferMessage(socket, data, socketMap);
    });
    socket.on('disconnect', async () => {
      SocketController.disconnect(socket, socketMap);
    });
  });
}

// Custom middleware to pass the io object to routes
function socketMiddleware(req, res, next) {
  req.io = io;
  req.socketMap = socketMap;
  next();
}

return socketMiddleware;

module.exports = setupSocketServer;
