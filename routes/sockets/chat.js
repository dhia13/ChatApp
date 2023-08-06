// routes/socketRoutes.js
const socketIO = require('socket.io');
const User = require('../../models/User');

function socketRoutes(server) {
  const io = socketIO(server, {
    cors: {
      origin: 'http://localhost:3000',
    },
  });
  io.on('connect', (socket) => {
    // Handle user connected event
    socket.on('userConnected', async (userId) => {
      try {
        await User.findByIdAndUpdate(userId, {
          socketId: socket.id,
          isOnline: true,
        });
      } catch (error) {
        console.error('Error updating user socketId:', error);
      }
      try {
        // Fetch the user's contacts
        const user = await User.findById(userId).select('contacts');
        const contacts = user.contacts;
        emitOnlineStatusToContacts(contacts, userId, true);
      } catch (error) {
        console.error('Error fetching user contacts:', error);
      }
    });
    // Handle disconnect event

    socket.on('userDisconnected', async (userId) => {
      console.log(userId, 'diconected');
      try {
        await User.findByIdAndUpdate(userId, {
          socketId: null,
          isOnline: false,
        });
      } catch (error) {
        console.error('Error updating user socketId:', error);
      }
      if (userId) {
        const user = await User.findById(userId).select('contacts');
        const contacts = user.contacts;
        emitOnlineStatusToContacts(contacts, userId, false);
      }
    });
    async function emitOnlineStatusToContacts(contacts, userId, isOnline) {
      try {
        const userContacts = await User.find(
          { _id: { $in: contacts } },
          'socketId'
        );

        for (const contact of userContacts) {
          if (contact.socketId) {
            const { socketId } = contact;
            console.log(
              `user with id ${userId} is online sending status to ${contact._id} via ${socketId} socket`
            );
            io.to(socketId).emit('isOnline', { id: userId, online: isOnline });
          }
        }
      } catch (error) {
        console.error('Error fetching user contacts:', error);
      }
    }
  });
}

module.exports = socketRoutes;
