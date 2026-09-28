import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
export default function Applications() {
  const [applications, setApplications] = useState([]);
  useEffect(() => { api.get('/applications/my').then(res => setApplications(res.data)); }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Application History</h1>
      {applications.length === 0 ? <div className="bg-white rounded-xl p-10 text-center"><p className="text-gray-500 mb-4">No applications yet.</p><Link to="/scholarships" className="bg-gray-900 text-white px-6 py-2 rounded-lg">Browse Scholarships</Link></div> : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr><th className="text-left p-4">Scholarship</th><th className="text-left p-4">Amount</th><th className="text-left p-4">Status</th><th className="text-left p-4">Actions</th></tr></thead>
            <tbody>
              {applications.map(app => (
                <tr key={app._id} className="border-t">
                  <td className="p-4 font-medium">{app.scholarship?.name}</td>
                  <td className="p-4">R {app.scholarship?.amount?.toLocaleString()}</td>
                  <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs ${app.status === 'Approved' ? 'bg-green-100 text-green-700' : app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{app.status}</span></td>
                  <td className="p-4"><Link to={`/upload/${app._id}`} className="text-indigo-600 text-sm">Upload Docs</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}