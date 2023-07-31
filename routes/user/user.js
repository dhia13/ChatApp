const { User } = require('../../models/User');
const { Notification } = require('../../models/notification');

const router = require('express').Router();
//register
router.post('/user', (req, res) => {
  res.status(200).json({ success: true });
});
// contacts crud
// list of user contacts
router.get('/contacts', (req, res) => {
  try {
    res.status(200).json({ success: true, contacts: 'hello' });
  } catch (error) {
    res.status(500).json({ success: false, msg: error, msg });
  }
});
// add contact
router.post('/contact', (req, res) => {
  try {
    res.status(200).json({ success: true, contacts: ',contact added' });
  } catch (error) {
    res.status(500).json({ success: false, msg: error, msg });
  }
});
// delete contact
router.delete('/contact', (req, res) => {
  try {
    res.status(200).json({ success: true, contacts: 'contact deleted' });
  } catch (error) {}
});
// searsh for contacts
router.get('/contacts', (req, res) => {
  try {
    res.status(200).json({ success: true, contacts: 'hello' });
  } catch (error) {
    res.status(500).json({ success: false, msg: error, msg });
  }
});
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
          { path: 'from', select: 'img username user' }, // Populate 'to' field with 'img', 'username', and 'user'
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
