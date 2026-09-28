import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
export default function Scholarships() {
  const [scholarships, setScholarships] = useState([]);
  useEffect(() => { api.get('/scholarships').then(res => setScholarships(res.data)); }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Scholarship Programs</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {scholarships.map(s => (
          <div key={s._id} className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex justify-between items-start">
              <div><h3 className="font-bold text-lg">{s.name}</h3><p className="text-sm text-gray-500 mt-1">{s.sponsor}</p><p className="text-sm text-gray-600 mt-2">{s.description}</p></div>
              <span className="text-green-600 font-bold text-xl">R {s.amount.toLocaleString()}</span>
            </div>
            <div className="mt-4 flex gap-3">
              <Link to={`/scholarships/${s._id}`} className="px-4 py-2 border rounded-lg text-sm">View Details</Link>
              <Link to={`/apply/${s._id}`} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">Apply Now</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}