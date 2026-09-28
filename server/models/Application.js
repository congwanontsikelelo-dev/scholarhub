const mongoose = require('mongoose');
const applicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scholarship: { type: mongoose.Schema.Types.ObjectId, ref: 'Scholarship', required: true },
  status: { type: String, enum: ['Submitted', 'Under Review', 'Approved', 'Rejected'], default: 'Submitted' },
  personalInfo: { fullName: String, surname: String, email: String, phone: String, studentID: String, university: String, course: String, yearLevel: String },
  motivationalLetter: String,
  documents: [{ name: String, fileUrl: String, status: { type: String, default: 'Pending' } }],
  adminFeedback: String,
  submittedAt: Date
}, { timestamps: true });
module.exports = mongoose.model('Application', applicationSchema);