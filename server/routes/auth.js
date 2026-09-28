const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const { auth } = require('../middleware/auth');
const { sendEmail, templates } = require('../utils/email');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phone, studentID, university, course, yearLevel } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    if (role === 'admin') {
      user = new User({ firstName, lastName, email, password: hashedPassword, role: 'admin', phone });
    } else {
      user = new Student({ firstName, lastName, email, password: hashedPassword, role: 'student', phone, studentID, university, course, yearLevel });
    }
    await user.save();
    sendEmail(email, ...Object.values(templates.welcome(firstName)));
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, firstName, lastName, email, role: user.role } });
  } catch (err) { console.error(err); res.status(500).json({ msg: 'Server error' }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email, role: user.role } });
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
});
module.exports = router;