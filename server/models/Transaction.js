const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paymentPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentPlan' },
  amount: { type: Number, required: true },
  itemName: String,
  status: { type: String, default: 'Pending' },
  paymentMethod: String,
  rawResponse: Object
}, { timestamps: true });
module.exports = mongoose.model('Transaction', transactionSchema);