const { User } = require('../../models/User');
const { Notification } = require('../../models/notification');
const { ContactAttempt } = require('../../models/contactAttepmt');
const { default: mongoose } = require('mongoose');
const router = require('express').Router();
// contacts crud
// list of user contacts
router.get('/contactsList', async (req, res) => {
  try {
    const contacts = await User.findById(req.user.id).populate({
      path: 'contacts',
      select: 'username img email name isOnline',
    });
    let onlineUsers = [];
    contacts.contacts.forEach((contact) => {
      if (contact.isOnline) {
        onlineUsers.push(contact.id);
      }
    });
    res.status(200).json({
      success: true,
      msg: 'contacts list',
      contacts: contacts.contacts,
      onlineUsers: onlineUsers,
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error, msg });
  }
});
router.get('/invitesList', async (req, res) => {
  try {
    const invites = await User.findById(req.user.id).populate({
      path: 'invites',
      populate: {
        path: 'sender',
        select: 'name id img username',
      },
    });

    res.status(200).json({
      success: true,
      msg: 'invites list',
      invites: invites.invites,
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error, msg });
  }
});
router.get('/requestsList', async (req, res) => {
  try {
    const requests = await User.findById(req.user.id).populate({
      path: 'requests',
      populate: {
        path: 'receiver',
        select: 'name id img username',
      },
    });

    res.status(200).json({
      success: true,
      msg: 'requests list',
      requests: requests.requests,
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error, msg });
  }
});
// send request
router.post('/request', async (req, res) => {
  try {
    const sender = req.user.id;
    const receiver = req.body.receiver;
    const socketMap = req?.socketMap;
    const receiverSocket = socketMap.get(receiver);

    // creating the request
    const newContactAttempt = new ContactAttempt({
      sender,
      receiver,
    });
    newContactAttempt.save();
    await User.findByIdAndUpdate(
      sender,
      {
        $addToSet: {
          requests: newContactAttempt.id,
        },
      },
      { new: true }
    );

    await User.findByIdAndUpdate(
      receiver,
      {
        $inc: {
          unseenIvitesCount: 1,
        },
        $addToSet: {
          invites: newContactAttempt.id,
        },
      },
      { new: true }
    );
    if (receiverSocket) {
      receiverSocket.emit('invite');
    }
    res.status(201).json({
      success: true,
      msg: 'request sent',
      request: ContactAttempt,
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error, msg });
  }
});
// cancel request
router.delete('/cancelRequest/:id', async (req, res) => {
  const requestId = req.params.id;
  const userId = req.user.id;
  try {
    const request = await ContactAttempt.findById(requestId);
    await User.findByIdAndUpdate(
      userId,
      { $pull: { requests: requestId } },
      { new: true }
    );
    // remove from receiver
    await User.findByIdAndUpdate(request.receiver, {
      $pull: { invites: requestId },
    });

    await ContactAttempt.findByIdAndDelete(requestId);

    res.status(200).json({
      success: true,
      msg: 'requests removed',
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error, msg });
  }
});
// ignore request
router.delete('/ignoreRequest/:id', async (req, res) => {
  const requestId = req.params.id;
  try {
    const request = await ContactAttempt.findById(requestId);
    await User.findByIdAndUpdate(
      request.sender,
      { $pull: { requests: requestId } },
      { new: true }
    );
    // remove from receiver
    await User.findByIdAndUpdate(request.receiver, {
      $pull: { invites: requestId },
    });

    await ContactAttempt.findByIdAndDelete(requestId);

    res.status(200).json({
      success: true,
      msg: 'requests removed',
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error, msg });
  }
});
// mark requests as seen
router.put('/invitesSeen', async (req, res) => {
  try {
    const user = req.user.id;
    await User.findByIdAndUpdate(
      user,
      { $set: { unseenIvitesCount: 0 } },
      { new: true }
    );
    res
      .status(200)
      .json({ message: 'Unseen invites count updated successfully.' });
  } catch (error) {
    console.error('Error updating unseen invites count:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});
// accept invite
router.put('/acceptInvite', async (req, res) => {
  const requestId = req.body.requestId;
  try {
    const request = await ContactAttempt.findById(requestId);
    const { sender, receiver } = request;
    await User.findByIdAndUpdate(sender, {
      $pull: { requests: requestId },
      $push: { contacts: receiver },
    });

    const newNoti = new Notification({
      to: receiver,
      from: sender,
      type: 'inviteAccepted',
    });
    newNoti.save();
    const notification = await Notification.findById(newNoti._id).populate({
      path: 'from',
      select: 'img username id',
    });
    await User.findByIdAndUpdate(receiver, {
      $pull: { invites: requestId },
      $push: { contacts: sender },
      $inc: { unseenNotificationsCount: 1 },
      $addToSet: { notifications: notification._id },
    });
    const socketMap = req?.socketMap;
    const senderString = sender ? sender.toString() : null;

    if (socketMap && senderString) {
      const receiverSocket = socketMap.get(senderString);
      if (receiverSocket) {
        receiverSocket.emit('notification', notification);
      }
    }
    await ContactAttempt.findByIdAndDelete(requestId);

    res.status(200).json({
      success: true,
      msg: 'invite accepted',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: error, msg });
  }
});

// delete contact
router.delete('/contact/:id', async (req, res) => {
  try {
    const requester = req.user.id;
    const other = req.params.id;
    const v1 = await User.findByIdAndUpdate(
      other,
      {
        $pull: { contacts: requester },
      },
      { new: true }
    );
    const v2 = await User.findByIdAndUpdate(
      requester,
      {
        $pull: { contacts: other },
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      msg: 'contact removed',
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});
// searsh for contacts
router.get('/contacts', async (req, res) => {
  const queryKeyword = req.query.keyword;
  try {
    const user = await User.findById(req.user.id).populate([
      {
        path: 'contacts',
        select: 'id',
      },
      {
        path: 'invites',
        select: 'id',
        populate: {
          path: 'sender',
          select: 'id', // You can include more fields from the sender if needed
        },
      },
      {
        path: 'requests',
        select: 'id',
        populate: {
          path: 'receiver',
          select: 'id', // You can include more fields from the receiver if needed
        },
      },
    ]);
    const getExcludeList = (user) => {
      const exclude = [user._id];

      user.invites.forEach((invite) => {
        exclude.push(invite.sender._id);
      });

      user.requests.forEach((request) => {
        exclude.push(request.receiver._id);
      });

      user.contacts.forEach((contact) => {
        exclude.push(contact._id);
      });

      return exclude;
    };
    if (queryKeyword && queryKeyword !== '') {
      const regexPattern = new RegExp(queryKeyword, 'i');
      const excludeList = getExcludeList(user);

      const list = await User.aggregate([
        {
          $match: {
            _id: { $nin: excludeList },
            $or: [
              { username: regexPattern },
              { email: regexPattern },
              { name: regexPattern },
            ],
          },
        },
        {
          $project: { username: 1, email: 1, name: 1, img: 1 },
        },
      ]);
      res
        .status(200)
        .json({ success: true, msg: 'search result', contacts: list });
    } else {
      res
        .status(200)
        .json({ success: true, msg: 'search result', contacts: [] });
    }
  } catch (error) {
    res.status(500).json({ success: false, msg: error });
  }
});

//notifications
router.get('/readNotifications', async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user.id,
      { unseenNotificationsCount: 0 },
      { new: true }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, msg: error, msg });
  }
});
router.get('/notificationsList', async (req, res) => {
  try {
    const notifications = await User.findById(req.user.id)
      .select('notifications') // Select only the notifications field from the User document
      .populate({
        path: 'notifications',
        populate: [
          { path: 'from', select: 'img username user name' }, // Populate 'to' field with 'img', 'username', and 'user'
        ],
      });
    res
      .status(200)
      .json({ success: true, notifications: notifications.notifications });
  } catch (error) {
    res.status(500).json({ success: false, msg: error, msg });
  }
});
router.get('/clearNotifications', async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user.id,
      { unseenNotificationsCount: 0, notifications: [] },
      { new: true }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, msg: error, msg });
  }
});

module.exports = router;
