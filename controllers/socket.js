const socketController = (io) => {
    io.on('connection', (socket) => {
      console.log('A user connected');
  
      socket.on('message', (data) => {
        console.log('Received message:', data);
        // Broadcast the message to all connected clients except the sender
        socket.broadcast.emit('message', data);
      });
  
      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });
  };
  
  module.exports = socketController;
  