import { useEffect, useState } from 'react';
import api from '../services/api';
export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => { api.get('/notifications').then(res => setNotifications(res.data)); }, []);
  const markRead = async (id) => { await api.put(`/notifications/${id}/read`); api.get('/notifications').then(res => setNotifications(res.data)); };
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      <div className="space-y-3">
        {notifications.map(n => (
          <div key={n._id} onClick={() => markRead(n._id)} className={`p-4 rounded-xl cursor-pointer ${n.isRead ? 'bg-white' : 'bg-indigo-50 border border-indigo-100'}`}>
            <h3 className={`font-semibold ${n.isRead ? 'text-gray-700' : 'text-indigo-900'}`}>{n.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{n.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}