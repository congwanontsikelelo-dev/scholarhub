import { Link } from 'react-router-dom';
export default function PaymentCancel() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
        <Link to="/payment-plans" className="bg-indigo-600 text-white px-6 py-2 rounded-lg mt-4 inline-block">Back to Payments</Link>
      </div>
    </div>
  );
}