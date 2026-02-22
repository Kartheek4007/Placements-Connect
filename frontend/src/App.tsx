import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCompanies from './pages/admin/AdminCompanies';
import AdminDrives from './pages/admin/AdminDrives';
import AdminApplications from './pages/admin/AdminApplications';
import AdminResults from './pages/admin/AdminResults';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentDrives from './pages/student/StudentDrives';
import StudentApplications from './pages/student/StudentApplications';
import StudentProfile from './pages/student/StudentProfile';
import StudentResults from './pages/student/StudentResults';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<DashboardLayout requireAdmin={true} />}>
        <Route index element={<AdminDashboard />} />
        <Route path="companies" element={<AdminCompanies />} />
        <Route path="drives" element={<AdminDrives />} />
        <Route path="applications" element={<AdminApplications />} />
        <Route path="results" element={<AdminResults />} />
      </Route>

      {/* Student Routes */}
      <Route path="/student" element={<DashboardLayout requireAdmin={false} />}>
        <Route index element={<StudentDashboard />} />
        <Route path="drives" element={<StudentDrives />} />
        <Route path="applications" element={<StudentApplications />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="results" element={<StudentResults />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
