const { User } = require('../../models/User');
const { Notification } = require('../../models/notification');
const { ContactAttempt } = require('../../models/contactAttepmt');
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
router.post('/sendRequest', async (req, res) => {
  try {
    const io = req.io;
    const receiver = req.body.receiver;
    const sender = req.user.id;
    const socketMap = req?.socketMap;
    const receiverSocket = socketMap.get(receiver);

    // creating the request
    const newContactAttempt = new ContactAttempt({
      sender,
      receiver,
    });
    newContactAttempt.save();
    // creating the notification
    const newNotification = new Notification({
      type: 'invite',
      from: sender,
      to: receiver,
      refrence: {
        ref: newContactAttempt.id,
        refrenceType: 'ContactAttempt',
      },
    });
    newNotification.save();
    await User.findByIdAndUpdate(
      sender,
      {
        $push: {
          requests: newContactAttempt.id,
          notifications: newNotification.id,
        },
        $inc: { unseenNotificationsCount: 1 },
      },
      { new: true }
    );
    const notificationPoulated = await Notification.findById(
      newNotification.id
    ).populate('from', 'img username name');
    if (receiverSocket) {
      receiverSocket.emit('notification', notificationPoulated);
    }
    await User.findByIdAndUpdate(receiver, {
      $addToSet: {
        notifications: newNotification.id,
        invites: newContactAttempt.id,
      },
      $inc: { unseenNotificationsCount: 1, unseenIvitesCount: 1 },
    });
    res.status(200).json({
      success: true,
      msg: 'request sent',
      request: ContactAttempt,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: error, msg });
  }
});
// remove request
router.put('/removeRequest', async (req, res) => {
  const requestId = req.body.requestId;
  const userId = req.user.id;
  try {
    const request = await ContactAttempt.findById(requestId);
    // console.log(request);
    await ContactAttempt.findByIdAndDelete(requestId);
    // remove from sender
    const pullRequest = await User.findByIdAndUpdate(
      userId,
      { $pull: { requests: requestId } },
      { new: true }
    );
    // remove from receiver
    await User.findByIdAndUpdate(request.receiver, {
      $pull: { invites: requestId },
    });
    res.status(200).json({
      success: true,
      msg: 'requests removed',
    });
  } catch (error) {
    console.log(error.msg);
    res.status(500).json({ success: false, msg: error, msg });
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
    await User.findByIdAndUpdate(receiver, {
      $pull: { invites: requestId },
      $push: { contacts: sender },
    });
    await ContactAttempt.findByIdAndDelete(requestId);
    res.status(200).json({
      success: true,
      msg: 'invite accepted',
    });
  } catch (error) {
    console.log(error.msg);
    res.status(500).json({ success: false, msg: error, msg });
  }
});

// delete contact
router.put('/removeContact', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { contacts: req.body.contactId },
    });
    await User.findByIdAndUpdate(req.body.contactId, {
      $pull: { contacts: req.user.id },
    });

    res.status(200).json({
      success: true,
      msg: 'contact removed',
      contacts: contacts.contacts,
    });
  } catch (error) {}
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

module.exports = router;
