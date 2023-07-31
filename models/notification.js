const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: {
      type: String,
      enum: [
        'alert',
        'message',
        'invite',
        'inviteAccepted',
        'announcement',
        'groupInvite',
      ],
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    refrence: {
      refrenceType: {
        type: String,
        enum: ['ContactAttempt'],
        required: true,
        trim: true,
      },
      ref: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'refrence.refrenceType',
      },
    },
    state: {
      type: String,
      default: 'notSeen',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = { Notification };
