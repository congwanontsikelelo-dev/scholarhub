const express = require('express');
const { WorkStudy, WorkStudyApplication } = require('../models/WorkStudy');
const { auth } = require('../middleware/auth');
const router = express.Router();
router.get('/', auth, async (req, res) => {
  try {
    const programs = await WorkStudy.find({ isActive: true });
    res.json(programs);
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
});
router.post('/apply/:id', auth, async (req, res) => {
  try {
    const existing = await WorkStudyApplication.findOne({ student: req.user.id, program: req.params.id });
    if (existing) return res.status(400).json({ msg: 'Already applied' });
    await WorkStudyApplication.create({ student: req.user.id, program: req.params.id });
    await WorkStudy.findByIdAndUpdate(req.params.id, { $inc: { slotsAvailable: -1 } });
    res.json({ msg: 'Applied' });
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
});
module.exports = router;