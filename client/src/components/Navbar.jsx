import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import api from '../services/api';
export default function Navbar() {
  const { user, logout } = useAuth();
  const [unread, setUnread] = useState(0);
  useEffect(() => { if (user) api.get('/notifications').then(res => setUnread(res.data.filter(n => !n.isRead).length)); }, [user]);
  if (!user) return null;
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-2 font-bold text-lg">
            <span className="text-indigo-600 text-2xl">🎓</span> ScholarHub
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
            <Link to="/dashboard" className="hover:text-indigo-600">Dashboard</Link>
            <Link to="/scholarships" className="hover:text-indigo-600">Scholarships</Link>
            <Link to="/work-study" className="hover:text-indigo-600">Work-Study</Link>
            <Link to="/applications" className="hover:text-indigo-600">Applications</Link>
            <Link to="/payment-plans" className="hover:text-indigo-600">Payments</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/notifications" className="relative">
              <span className="text-xl">🔔</span>
              {unread > 0 && <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{unread}</span>}
            </Link>
            <span className="text-sm">{user.firstName}</span>
            <button onClick={logout} className="text-sm text-red-500">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
}