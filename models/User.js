const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    confirmedEmail: {
      type: Boolean,
      default: false,
    },
    username: {
      type: String,
      unique: true,
    },
    gender: {
      type: String,
    },
    birthday: {
      type: String,
    },
    img: {
      type: String,
      default: '',
    },
    socketId: {
      type: String,
      default: null,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ContactAttempt' }],
    invites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ContactAttempt' }],
    notifications: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Notification' },
    ],
    unseenNotificationsCount: { type: Number, default: 0 },
    unseenIvitesCount: { type: Number, default: 0 },
    contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', UserSchema);
module.exports = { User };
