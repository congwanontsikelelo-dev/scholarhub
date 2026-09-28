import { useEffect } from 'react';
import { Link } from 'react-router-dom';
export default function PaymentSuccess() {
  useEffect(() => { setTimeout(() => window.location.href = '/payment-plans', 3000); }, []);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-4">Redirecting...</p>
        <Link to="/payment-plans" className="text-indigo-600">Click here if not redirected</Link>
      </div>
    </div>
  );
}