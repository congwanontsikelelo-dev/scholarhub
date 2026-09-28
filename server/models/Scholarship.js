const mongoose = require('mongoose');
const scholarshipSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  amount: { type: Number, required: true },
  type: String,
  eligibilityCriteria: [String],
  requiredDocuments: [String],
  deadline: { type: Date, required: true },
  slotsAvailable: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
  sponsor: String
}, { timestamps: true });
module.exports = mongoose.model('Scholarship', scholarshipSchema);