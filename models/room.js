const mongoose = require('mongoose');

const RoomModel = mongoose.Schema(
  {
    isGroupRoom: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  },
  { timestamps: true }
);

const Room = mongoose.model('Room', RoomModel);

module.exports = Room;
