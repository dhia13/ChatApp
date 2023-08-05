const Message = require('../../models/message');
const Room = require('../../models/room');

const router = require('express').Router();
//register
router.put('/findChatRoom', async (req, res) => {
  const user = req.user.id;
  const target = req.body.target;
  try {
    const chatRoom = await Room.findOne({
      users: { $all: [user, target] },
    });
    if (chatRoom) {
      res.status(201).json({ msg: 'chatRoom Created', id: chatRoom._id });
    } else {
      const newChatRoom = new Room({
        users: [user, target],
      });
      newChatRoom.save();
      res.status(201).json({ msg: 'chatRoom Created', id: newChatRoom._id });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
router.put('/getMessages', async (req, res) => {
  const user = req.user.id;
  const roomId = req.body.roomId;
  try {
    const messages = await Message.find({ room: roomId });
    const secondUser = await Room.findById(roomId).populate({
      path: 'users',
      match: { _id: { $ne: user } },
      select: 'img username name',
    });
    res.status(201).json({
      msg: 'chatRoom Created',
      messages: messages,
      target: secondUser.users[0],
    });
  } catch (error) {
    res.status(500).json(error);
  }
});
router.post('/newMessage', async (req, res) => {
  //   const user = req.user.id;
  const message = req.body.message;
  const io = req.io;
  const receiver = req.body.receiver;
  const socketMap = req?.socketMap;
  const receiverSocket = socketMap.get(receiver);

  try {
    const newMessage = new Message({
      owner: message.owner,
      room: message.room,
      content: message.content,
      seen: false,
    });
    newMessage.save();
    await Room.findByIdAndUpdate(message.room, {
      $push: { messages: newMessage._id },
    });
    if (receiverSocket) {
      receiverSocket.emit('msg', newMessage);
    }
    res.status(200).json({ success: true, msg: newMessage });
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get('/rooms', async (req, res) => {
  if (req.user.id) {
    const user = req.user.id;
    try {
      const rooms = await Room.find({
        users: { $in: [user] },
      })
        .populate({
          path: 'users',
          match: { _id: { $ne: user } },
          select: 'img username name',
        })
        .populate({
          path: 'messages',
          options: { sort: { createdAt: -1 }, limit: 1 },
        })
        .sort({ updatedAt: -1 });
      res.status(200).json({ success: true, rooms });
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(400).json({ msg: 'bad request' });
  }
});
router.put('/sawMessages', async (req, res) => {
  if (req.user.id) {
    const io = req.io;
    const receiver = req.body.receiver;
    const socketMap = req?.socketMap;
    const receiverSocket = socketMap.get(receiver);
    try {
      const messages = req.body.messages;
      for (const m of messages) {
        await Message.findByIdAndUpdate(m, {
          $set: { seen: true },
        });
      }
      if (receiverSocket) {
        receiverSocket.emit('seen', { messages, roomId: req.body.roomId });
      }
      res.status(200).json({ msg: 'seen' });
    } catch (error) {
      console.log(error);
    }
  } else {
    res.status(400).json({ msg: 'bad request' });
  }
});
module.exports = router;
