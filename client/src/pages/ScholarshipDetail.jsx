import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
export default function ScholarshipDetail() {
  const { id } = useParams();
  const [scholarship, setScholarship] = useState(null);
  useEffect(() => { api.get(`/scholarships/${id}`).then(res => setScholarship(res.data)); }, [id]);
  if (!scholarship) return <div className="p-10 text-center">Loading...</div>;
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/scholarships" className="text-indigo-600 text-sm mb-4 inline-block">← Back</Link>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold">{scholarship.name}</h1>
          <p className="text-green-600 text-2xl font-bold">R {scholarship.amount.toLocaleString()}</p>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold mb-3">Eligibility</h3>
            <ul className="list-disc list-inside space-y-2">{scholarship.eligibilityCriteria?.map((c, i) => <li key={i}>{c}</li>)}</ul>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold mb-4">Documents Required</h3>
          <ul className="space-y-2">{scholarship.requiredDocuments?.map((doc, i) => <li key={i} className="text-sm">📄 {doc}</li>)}</ul>
          <Link to={`/apply/${scholarship._id}`} className="block w-full bg-indigo-600 text-white text-center p-3 rounded-lg mt-6">Apply Now</Link>
        </div>
      </div>
    </div>
  );
}