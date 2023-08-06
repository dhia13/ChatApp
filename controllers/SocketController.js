const Room = require('../models/room');
const Message = require('../models/message');
const User = require('../models/User');
const SocketController = {
  handShake: async (socket, socketMap) => {
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
  },
  disconnect: async (socket, socketMap) => {
    const userId = socket.handshake.query.userId;
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
  },
  transferMessage: async (socket, data, socketMap) => {
    const newMessage = new Message({
      owner: data.message.owner,
      room: data.message.room,
      content: data.message.content,
      seen: false,
    });
    newMessage.save();
    const roomUpdate = await Room.findByIdAndUpdate(
      data.message.room,
      {
        $push: { messages: newMessage._id },
      },
      { new: true }
    );
    console.log(roomUpdate);
    const receiverSocket = socketMap.get(data.receiver);
    if (receiverSocket) {
      receiverSocket.emit('newMsg', newMessage);
      console.log('msg sent');
    }
    const senderSocket = socket;
    console.log(senderSocket);
    senderSocket.emit('msgReceived', newMessage);
  },
};
const emitOnlineStatusToContacts = async (
  socketMap,
  contacts,
  userId,
  isOnline
) => {
  try {
    for (const contactId of contacts) {
      const contactIdString = contactId.toString();
      const contactSocket = socketMap.get(contactIdString);
      if (contactSocket) {
        console.log(
          `user with id ${userId} is online sending status to ${contactId} via ${contactSocket.id} socket`
        );
        contactSocket.emit('isOnline', { id: userId, online: isOnline });
      }
    }
  } catch (error) {
    console.error('Error emitting online status to contacts:', error);
  }
};
module.exports = SocketController;
