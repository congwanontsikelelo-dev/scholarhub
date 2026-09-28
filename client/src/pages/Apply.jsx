import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
export default function Apply() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scholarship, setScholarship] = useState(null);
  const [form, setForm] = useState({ fullName: '', surname: '', email: '', phone: '', studentID: '', university: '', course: '', yearLevel: '', motivationalLetter: '' });
  useEffect(() => { api.get(`/scholarships/${id}`).then(res => setScholarship(res.data)); }, [id]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/applications', { scholarshipId: id, personalInfo: form, motivationalLetter: form.motivationalLetter });
      alert('Application submitted!');
      navigate('/applications');
    } catch (err) { alert('Failed to submit'); }
  };
  if (!scholarship) return <div className="p-10 text-center">Loading...</div>;
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Apply: {scholarship.name}</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-4 mt-6">
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Full Name" className="p-3 bg-gray-50 rounded-lg" onChange={e => setForm({...form, fullName: e.target.value})} required />
          <input placeholder="Surname" className="p-3 bg-gray-50 rounded-lg" onChange={e => setForm({...form, surname: e.target.value})} required />
        </div>
        <input type="email" placeholder="Email" className="w-full p-3 bg-gray-50 rounded-lg" onChange={e => setForm({...form, email: e.target.value})} required />
        <input placeholder="Phone (+27...)" className="w-full p-3 bg-gray-50 rounded-lg" onChange={e => setForm({...form, phone: e.target.value})} />
        <input placeholder="Student ID" className="w-full p-3 bg-gray-50 rounded-lg" onChange={e => setForm({...form, studentID: e.target.value})} />
        <input placeholder="University" className="w-full p-3 bg-gray-50 rounded-lg" onChange={e => setForm({...form, university: e.target.value})} />
        <input placeholder="Course" className="w-full p-3 bg-gray-50 rounded-lg" onChange={e => setForm({...form, course: e.target.value})} />
        <textarea placeholder="Motivational Letter" className="w-full p-3 bg-gray-50 rounded-lg h-32" onChange={e => setForm({...form, motivationalLetter: e.target.value})} required />
        <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg font-medium">Submit Application</button>
      </form>
    </div>
  );
}