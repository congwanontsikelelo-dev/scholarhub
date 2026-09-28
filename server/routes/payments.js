const express = require('express');
const { auth } = require('../middleware/auth');
const { PAYFAST_CONFIG, generateSignature, verifySignature } = require('../config/payfast');
const Transaction = require('../models/Transaction');
const PaymentPlan = require('../models/PaymentPlan');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');
const { sendSMS } = require('../utils/sms');
const router = express.Router();

router.post('/initiate', auth, async (req, res) => {
  try {
    const { paymentPlanId, amount, itemName } = req.body;
    const student = await User.findById(req.user.id);
    await Transaction.create({ student: req.user.id, paymentPlan: paymentPlanId, amount, itemName, status: 'Pending' });
    const data = {
      merchant_id: PAYFAST_CONFIG.merchantId,
      merchant_key: PAYFAST_CONFIG.merchantKey,
      return_url: `${process.env.CLIENT_URL}/payment/success`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
      notify_url: `${process.env.CLIENT_URL?.replace('/api', '')}/api/payments/itn`,
      name_first: student.firstName,
      name_last: student.lastName,
      email_address: student.email,
      m_payment_id: 'PAY-' + Date.now(),
      amount: amount.toFixed(2),
      item_name: itemName
    };
    const signature = generateSignature(data, PAYFAST_CONFIG.passphrase);
    res.json({ url: PAYFAST_CONFIG.getUrl(), payload: { ...data, signature } });
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
});

router.post('/itn', express.urlencoded({ extended: true }), async (req, res) => {
  try {
    const pfData = req.body;
    if (pfData.payment_status === 'COMPLETE') {
      const transaction = await Transaction.findOne({ amount: parseFloat(pfData.amount_gross), status: 'Pending' }).sort({ createdAt: -1 });
      if (transaction) {
        transaction.status = 'Complete';
        transaction.rawResponse = pfData;
        await transaction.save();
        const student = await User.findById(transaction.student);
        student.totalPaid = (student.totalPaid || 0) + parseFloat(pfData.amount_gross);
        student.outstandingBalance = Math.max(0, (student.outstandingBalance || 0) - parseFloat(pfData.amount_gross));
        await student.save();
        sendEmail(student.email, 'Payment Received', `<h2>Hi ${student.firstName},</h2><p>Payment of <strong>R ${parseFloat(pfData.amount_gross).toFixed(2)}</strong> received.</p>`);
        if (student.phone) sendSMS(student.phone, `ScholarHub: Payment of R${parseFloat(pfData.amount_gross).toFixed(2)} received. Balance: R${student.outstandingBalance.toFixed(2)}.`);
      }
    }
    res.status(200).send('OK');
  } catch (err) { res.status(200).send('OK'); }
});

router.get('/history', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ student: req.user.id }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
});
module.exports = router;