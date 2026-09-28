import { useEffect, useState } from 'react';
import api from '../services/api';
export default function PaymentPlans() {
  const [plans, setPlans] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [paying, setPaying] = useState(false);
  useEffect(() => {
    Promise.all([api.get('/payment-plans/my'), api.get('/payments/history')]).then(([p, t]) => { setPlans(p.data); setTransactions(t.data); });
  }, []);
  const handlePay = async (plan, installment) => {
    try {
      setPaying(true);
      const res = await api.post('/payments/initiate', { paymentPlanId: plan._id, amount: installment.amount, itemName: `Installment ${installment.installmentNumber}` });
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = res.data.url;
      form.target = '_blank';
      Object.entries(res.data.payload).forEach(([key, value]) => { const input = document.createElement('input'); input.type = 'hidden'; input.name = key; input.value = value; form.appendChild(input); });
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } catch (err) { alert('Payment failed'); }
    finally { setPaying(false); }
  };
  const activePlan = plans[0];
  const totalFees = activePlan?.totalAmount || 45000;
  const totalPaid = transactions.filter(t => t.status === 'Complete').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalFees - totalPaid;
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Payment Plans</h1>
      <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
        <h3 className="font-bold mb-4">Outstanding Fees</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div><p className="text-gray-500 text-sm">Total</p><p className="text-xl font-bold">R{totalFees.toLocaleString()}</p></div>
          <div><p className="text-gray-500 text-sm">Paid</p><p className="text-xl font-bold text-green-600">R{totalPaid.toLocaleString()}</p></div>
          <div><p className="text-gray-500 text-sm">Balance</p><p className="text-xl font-bold text-yellow-600">R{balance.toLocaleString()}</p></div>
        </div>
      </div>
      {activePlan && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h3 className="font-bold mb-4">Payment Schedule</h3>
          <div className="space-y-3">
            {activePlan.installments?.map(inst => (
              <div key={inst.installmentNumber} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {inst.status === 'Paid' ? <span className="text-green-500 text-xl">✓</span> : <span className="text-gray-400 text-xl">⏱</span>}
                  <div><p className="font-medium">Installment {inst.installmentNumber}</p><p className="text-xs text-gray-500">Due: {new Date(inst.dueDate).toLocaleDateString()}</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold">R{inst.amount?.toLocaleString()}</span>
                  {inst.status === 'Paid' ? <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Paid</span> : <button onClick={() => handlePay(activePlan, inst)} disabled={paying} className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg disabled:opacity-50">{paying ? 'Processing...' : 'Pay Now'}</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}