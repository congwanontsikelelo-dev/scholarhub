const mongoose = require('mongoose');
const User = require('./User');
const studentSchema = new mongoose.Schema({
  studentID: { type: String, unique: true, sparse: true },
  university: String,
  course: String,
  yearLevel: String,
  outstandingBalance: { type: Number, default: 45000 },
  totalPaid: { type: Number, default: 0 }
});
module.exports = User.discriminator('student', studentSchema);