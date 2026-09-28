const mongoose = require('mongoose');
const workStudySchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: String,
  description: String,
  hoursPerWeek: Number,
  payRate: Number,
  slotsAvailable: { type: Number, default: 1 },
  deadline: Date,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
const workStudyApplicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  program: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkStudy' },
  status: { type: String, default: 'Pending' }
});
module.exports = {
  WorkStudy: mongoose.model('WorkStudy', workStudySchema),
  WorkStudyApplication: mongoose.model('WorkStudyApplication', workStudyApplicationSchema)
};