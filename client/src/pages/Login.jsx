import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.token, res.data.user);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) { alert(err.response?.data?.msg || 'Login failed'); }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">🎓 ScholarHub</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-3 bg-gray-100 rounded-lg" onChange={e => setForm({...form, email: e.target.value})} required />
          <input type="password" placeholder="Password" className="w-full p-3 bg-gray-100 rounded-lg" onChange={e => setForm({...form, password: e.target.value})} required />
          <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg font-medium">Sign In</button>
        </form>
        <p className="text-center mt-4 text-sm"><Link to="/register" className="text-indigo-600">Create Account</Link></p>
      </div>
    </div>
  );
}