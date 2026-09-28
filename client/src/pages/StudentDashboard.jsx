import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
export default function StudentDashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });
  const [scholarships, setScholarships] = useState([]);
  useEffect(() => {
    Promise.all([api.get('/applications/my'), api.get('/scholarships')]).then(([appsRes, schRes]) => {
      const apps = appsRes.data;
      setStats({ total: apps.length, pending: apps.filter(a => a.status === 'Under Review').length, approved: apps.filter(a => a.status === 'Approved').length });
      setScholarships(schRes.data.slice(0, 3));
    });
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Welcome back!</h1>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm"><p className="text-gray-500 text-sm">Total Applications</p><p className="text-3xl font-bold">{stats.total}</p></div>
        <div className="bg-white p-6 rounded-xl shadow-sm"><p className="text-gray-500 text-sm">Pending</p><p className="text-3xl font-bold text-yellow-600">{stats.pending}</p></div>
        <div className="bg-white p-6 rounded-xl shadow-sm"><p className="text-gray-500 text-sm">Approved</p><p className="text-3xl font-bold text-green-600">{stats.approved}</p></div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-bold text-lg mb-4">Scholarship Programs</h2>
        <div className="space-y-4">
          {scholarships.map(s => (
            <div key={s._id} className="border rounded-lg p-4">
              <div className="flex justify-between"><h3 className="font-semibold">{s.name}</h3><span className="text-green-600 font-bold">R {s.amount.toLocaleString()}</span></div>
              <p className="text-sm text-gray-500 mt-1">Deadline: {new Date(s.deadline).toLocaleDateString()}</p>
              <div className="mt-3 flex gap-2">
                <Link to={`/scholarships/${s._id}`} className="text-sm px-3 py-1 border rounded">View Details</Link>
                <Link to={`/apply/${s._id}`} className="text-sm px-3 py-1 bg-indigo-600 text-white rounded">Apply Now</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}