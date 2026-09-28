import { Link } from 'react-router-dom';
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Your Gateway to <span className="text-indigo-600">Educational Excellence</span></h1>
          <p className="text-gray-600 mb-8 text-lg">Discover and apply for scholarships that match your academic goals.</p>
          <div className="flex gap-4">
            <Link to="/register" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700">Apply Now</Link>
            <Link to="/login" className="bg-white text-gray-700 border px-6 py-3 rounded-lg font-medium">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}