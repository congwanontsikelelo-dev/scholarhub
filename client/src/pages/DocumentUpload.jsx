import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
export default function DocumentUpload() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return alert('Select files');
    const formData = new FormData();
    files.forEach(file => formData.append('documents', file));
    try {
      setUploading(true);
      await api.post(`/applications/${applicationId}/documents`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert('Uploaded!');
      navigate('/applications');
    } catch (err) { alert('Upload failed'); }
    finally { setUploading(false); }
  };
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Upload Documents</h1>
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input type="file" multiple onChange={e => setFiles(Array.from(e.target.files))} className="hidden" id="fileInput" />
          <label htmlFor="fileInput" className="cursor-pointer text-indigo-600 font-medium">Click to choose files</label>
          <p className="text-sm text-gray-500 mt-2">PDF, DOC, JPG, PNG (Max 5MB)</p>
        </div>
        <button onClick={handleSubmit} disabled={uploading} className="w-full bg-indigo-600 text-white p-3 rounded-lg font-medium mt-4 disabled:opacity-50">{uploading ? 'Uploading...' : 'Submit Documents'}</button>
      </div>
    </div>
  );
}