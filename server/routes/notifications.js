const express = require('express');
const Notification = require('../models/Notification');
const { auth } = require('../middleware/auth');
const router = express.Router();
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id }).sort({ createdAt: -1 }).limit(20);
    res.json(notifications);
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
});
router.put('/:id/read', auth, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ msg: 'Marked as read' });
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
});
module.exports = router;