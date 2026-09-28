import { useEffect, useState } from 'react';
import api from '../services/api';
export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  useEffect(() => {
    api.get('/applications/all').then(res => {
      setApplications(res.data);
      setStats({ total: res.data.length, pending: res.data.filter(a => a.status === 'Submitted' || a.status === 'Under Review').length, approved: res.data.filter(a => a.status === 'Approved').length, rejected: res.data.filter(a => a.status === 'Rejected').length });
    });
  }, []);
  const updateStatus = async (id, status) => {
    await api.put(`/applications/${id}/status`, { status, feedback: '' });
    api.get('/applications/all').then(res => setApplications(res.data));
  };
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm"><p className="text-gray-500 text-sm">Total</p><p className="text-3xl font-bold">{stats.total}</p></div>
        <div className="bg-white p-6 rounded-xl shadow-sm"><p className="text-gray-500 text-sm">Pending</p><p className="text-3xl font-bold text-yellow-600">{stats.pending}</p></div>
        <div className="bg-white p-6 rounded-xl shadow-sm"><p className="text-gray-500 text-sm">Approved</p><p className="text-3xl font-bold text-green-600">{stats.approved}</p></div>
        <div className="bg-white p-6 rounded-xl shadow-sm"><p className="text-gray-500 text-sm">Rejected</p><p className="text-3xl font-bold text-red-600">{stats.rejected}</p></div>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <h2 className="font-bold p-6 border-b">All Applications</h2>
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="text-left p-4">Student</th><th className="text-left p-4">Scholarship</th><th className="text-left p-4">Status</th><th className="text-left p-4">Actions</th></tr></thead>
          <tbody>
            {applications.map(app => (
              <tr key={app._id} className="border-t">
                <td className="p-4">{app.student?.firstName} {app.student?.lastName}</td>
                <td className="p-4">{app.scholarship?.name}</td>
                <td className="p-4"><span className={`px-2 py-1 rounded text-xs ${app.status === 'Approved' ? 'bg-green-100 text-green-700' : app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{app.status}</span></td>
                <td className="p-4">
                  {(app.status === 'Submitted' || app.status === 'Under Review') && (
                    <div className="flex gap-2">
                      <button onClick={() => updateStatus(app._id, 'Approved')} className="bg-green-600 text-white px-3 py-1 rounded text-xs">Approve</button>
                      <button onClick={() => updateStatus(app._id, 'Rejected')} className="bg-red-600 text-white px-3 py-1 rounded text-xs">Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}