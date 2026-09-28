import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import Scholarships from './pages/Scholarships';
import ScholarshipDetail from './pages/ScholarshipDetail';
import Apply from './pages/Apply';
import WorkStudy from './pages/WorkStudy';
import Applications from './pages/Applications';
import Notifications from './pages/Notifications';
import PaymentPlans from './pages/PaymentPlans';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import DocumentUpload from './pages/DocumentUpload';
import AdminDashboard from './pages/AdminDashboard';

const PrivateRoute = ({ children, adminOnly }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
          <Route path="/scholarships" element={<PrivateRoute><Scholarships /></PrivateRoute>} />
          <Route path="/scholarships/:id" element={<PrivateRoute><ScholarshipDetail /></PrivateRoute>} />
          <Route path="/apply/:id" element={<PrivateRoute><Apply /></PrivateRoute>} />
          <Route path="/work-study" element={<PrivateRoute><WorkStudy /></PrivateRoute>} />
          <Route path="/applications" element={<PrivateRoute><Applications /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
          <Route path="/payment-plans" element={<PrivateRoute><PaymentPlans /></PrivateRoute>} />
          <Route path="/payment/success" element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />
          <Route path="/payment/cancel" element={<PrivateRoute><PaymentCancel /></PrivateRoute>} />
          <Route path="/upload/:applicationId" element={<PrivateRoute><DocumentUpload /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;