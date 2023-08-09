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
      console.log('msg');
      SocketController.transferMessage(socket, data, socketMap);
    });
    socket.on('test', () => {
      socket.broadcast.emit('test');
    });
    // call handler
    socket.on('callUser', (data) => {
      const calle = socketMap.get(data.to.id);
      console.log(data);
      console.log('sending ring to ', data.to.id);
      if (calle) {
        console.log('got here');
        try {
          calle.emit('ringUser', data);
        } catch (error) {
          console.error('Error emitting callUser:', error);
        }
      } else {
        console.log('user not connected');
      }
    });
    socket.on('ringing', (data) => {
      console.log('ringing', data);
      const to = socketMap.get(data);
      if (to) {
        to.emit('isRinging');
      }
    });
    socket.on('answerCall', (data) => {
      const SEND = socketMap.get(data.to.id);
      if (SEND) {
        SEND.emit('callAccepted', data.signal);
      }
    });
    socket.on('endCall', ({ id }) => {
      const send = socketMap.get(id);
      if (send) {
        send.emit('end-call');
      }
      console.log('end-call');
    });
    //
    socket.on('disconnect', async () => {
      SocketController.disconnect(socket, socketMap);
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
