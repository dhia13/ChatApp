const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, trim: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    seen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
