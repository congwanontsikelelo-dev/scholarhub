const express = require('express');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Scholarship = require('../models/Scholarship');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { sendEmail, templates } = require('../utils/email');
const { sendSMS } = require('../utils/sms');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { scholarshipId, personalInfo, motivationalLetter } = req.body;
    const application = new Application({ student: req.user.id, scholarship: scholarshipId, personalInfo, motivationalLetter, status: 'Submitted', submittedAt: new Date() });
    await application.save();
    const student = await User.findById(req.user.id);
    const scholarship = await Scholarship.findById(scholarshipId);
    const emailData = templates.applicationSubmitted(student.firstName, scholarship.name);
    sendEmail(student.email, emailData.subject, emailData.html);
    await Notification.create({ recipient: req.user.id, title: 'Application Submitted', message: `Your application for ${scholarship.name} submitted.`, type: 'Application' });
    res.json(application);
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
});

router.post('/:id/documents', auth, upload.array('documents', 5), async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    const newDocs = req.files.map(file => ({ name: file.originalname, fileUrl: file.path, status: 'Pending' }));
    application.documents.push(...newDocs);
    await application.save();
    res.json({ msg: 'Documents uploaded', documents: application.documents });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

router.get('/my', auth, async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id }).populate('scholarship', 'name amount deadline').sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
});

router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admin only' });
    const applications = await Application.find().populate('student', 'firstName lastName email').populate('scholarship', 'name amount');
    res.json(applications);
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
});

router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status, feedback } = req.body;
    const application = await Application.findByIdAndUpdate(req.params.id, { status, adminFeedback: feedback, reviewedAt: new Date() }, { new: true }).populate('student').populate('scholarship');
    const emailTemplate = status === 'Approved' ? templates.applicationApproved(application.student.firstName, application.scholarship.name) : templates.applicationRejected(application.student.firstName, application.scholarship.name);
    sendEmail(application.student.email, emailTemplate.subject, emailTemplate.html);
    if (application.student.phone) {
      const smsBody = status === 'Approved' ? `Hi ${application.student.firstName}, your application for ${application.scholarship.name} has been APPROVED! 🎉` : `Hi ${application.student.firstName}, your application for ${application.scholarship.name} was not successful.`;
      sendSMS(application.student.phone, smsBody);
    }
    await Notification.create({ recipient: application.student._id, title: `Application ${status}`, message: `Your application is now ${status}.`, type: 'Application' });
    res.json(application);
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
});
module.exports = router;