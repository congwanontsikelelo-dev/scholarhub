import { useEffect, useState } from 'react';
import api from '../services/api';
export default function WorkStudy() {
  const [programs, setPrograms] = useState([]);
  useEffect(() => { api.get('/work-study').then(res => setPrograms(res.data)); }, []);
  const handleApply = async (id) => {
    try {
      await api.post(`/work-study/apply/${id}`);
      alert('Applied!');
      setPrograms(prev => prev.map(p => p._id === id ? {...p, slotsAvailable: p.slotsAvailable - 1} : p));
    } catch (err) { alert('Failed'); }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Work-Study Programs</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {programs.map(p => (
          <div key={p._id} className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex justify-between"><h3 className="font-bold text-lg">{p.title}</h3><span className="text-green-600 font-bold">R{p.payRate}/hr</span></div>
            <p className="text-sm text-gray-500">{p.department}</p>
            <p className="text-sm text-gray-600 mt-2">{p.description}</p>
            <div className="mt-4 flex gap-4 text-sm"><span>⏱ {p.hoursPerWeek} hrs/wk</span><span>👥 {p.slotsAvailable} slots</span></div>
            <button onClick={() => handleApply(p._id)} disabled={p.slotsAvailable === 0} className="mt-4 w-full bg-indigo-600 text-white p-2 rounded-lg disabled:opacity-50">{p.slotsAvailable === 0 ? 'No Slots' : 'Apply Now'}</button>
          </div>
        ))}
      </div>
    </div>
  );
}