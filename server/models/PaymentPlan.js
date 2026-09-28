const mongoose = require('mongoose');
const paymentPlanSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalAmount: { type: Number, required: true },
  numberOfInstallments: { type: Number, required: true },
  installmentAmount: { type: Number, required: true },
  status: { type: String, default: 'Active' },
  installments: [{
    installmentNumber: Number,
    amount: Number,
    dueDate: Date,
    paidDate: Date,
    status: { type: String, default: 'Upcoming' }
  }]
}, { timestamps: true });
module.exports = mongoose.model('PaymentPlan', paymentPlanSchema);