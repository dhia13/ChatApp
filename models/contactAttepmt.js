const mongoose = require('mongoose');

const ContactAttemptSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    state: {
      type: String,
      enum: ['rejected', 'seen', 'notSeen', 'accepted', 'canceled'],
      required: true,
      trim: true,
      default: 'notSeen',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);
const ContactAttempt = mongoose.model('ContactAttempt', ContactAttemptSchema);
module.exports = { ContactAttempt };
