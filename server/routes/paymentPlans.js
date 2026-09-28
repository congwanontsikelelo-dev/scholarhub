const express = require('express');
const PaymentPlan = require('../models/PaymentPlan');
const { auth } = require('../middleware/auth');
const router = express.Router();
router.get('/my', auth, async (req, res) => {
  try {
    const plans = await PaymentPlan.find({ student: req.user.id });
    res.json(plans);
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
});
router.post('/', auth, async (req, res) => {
  try {
    const { totalAmount, numberOfInstallments } = req.body;
    const installmentAmount = totalAmount / numberOfInstallments;
    const installments = [];
    const today = new Date();
    for (let i = 1; i <= numberOfInstallments; i++) {
      const due = new Date(today);
      due.setMonth(due.getMonth() + i);
      installments.push({ installmentNumber: i, amount: installmentAmount, dueDate: due, status: 'Upcoming' });
    }
    const plan = new PaymentPlan({ student: req.user.id, totalAmount, numberOfInstallments, installmentAmount, installments });
    await plan.save();
    res.json(plan);
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
});
module.exports = router;