const express = require('express');
const Scholarship = require('../models/Scholarship');
const { auth } = require('../middleware/auth');
const router = express.Router();
router.get('/', auth, async (req, res) => {
  try {
    const scholarships = await Scholarship.find({ isActive: true, deadline: { $gte: new Date() } }).sort({ deadline: 1 });
    res.json(scholarships);
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
});
router.get('/:id', auth, async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) return res.status(404).json({ msg: 'Not found' });
    res.json(scholarship);
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
});
module.exports = router;