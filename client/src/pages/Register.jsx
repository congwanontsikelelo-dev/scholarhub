import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
export default function Register() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '', studentID: '', university: '', course: '', yearLevel: '1st Year' });
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { ...form, role: 'student' });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) { alert(err.response?.data?.msg || 'Registration failed'); }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="First Name" className="p-3 bg-gray-100 rounded-lg" onChange={e => setForm({...form, firstName: e.target.value})} required />
            <input placeholder="Last Name" className="p-3 bg-gray-100 rounded-lg" onChange={e => setForm({...form, lastName: e.target.value})} required />
          </div>
          <input type="email" placeholder="Email" className="w-full p-3 bg-gray-100 rounded-lg" onChange={e => setForm({...form, email: e.target.value})} required />
          <input type="password" placeholder="Password" className="w-full p-3 bg-gray-100 rounded-lg" onChange={e => setForm({...form, password: e.target.value})} required />
          <input placeholder="Phone (+27...)" className="w-full p-3 bg-gray-100 rounded-lg" onChange={e => setForm({...form, phone: e.target.value})} />
          <input placeholder="Student ID" className="w-full p-3 bg-gray-100 rounded-lg" onChange={e => setForm({...form, studentID: e.target.value})} />
          <input placeholder="University" className="w-full p-3 bg-gray-100 rounded-lg" onChange={e => setForm({...form, university: e.target.value})} />
          <input placeholder="Course" className="w-full p-3 bg-gray-100 rounded-lg" onChange={e => setForm({...form, course: e.target.value})} />
          <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg font-medium">Sign Up</button>
        </form>
        <p className="text-center mt-4 text-sm"><Link to="/login" className="text-indigo-600">Already have an account?</Link></p>
      </div>
    </div>
  );
}