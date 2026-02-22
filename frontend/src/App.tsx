import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import Placeholder from './components/layout/Placeholder';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<DashboardLayout requireAdmin={true} />}>
        <Route index element={<AdminDashboard />} />
        <Route path="companies" element={<Placeholder title="Manage Companies" />} />
        <Route path="drives" element={<Placeholder title="Manage Drives" />} />
        <Route path="applications" element={<Placeholder title="Applications Review" />} />
      </Route>

      {/* Student Routes */}
      <Route path="/student" element={<DashboardLayout requireAdmin={false} />}>
        <Route index element={<StudentDashboard />} />
        <Route path="drives" element={<Placeholder title="Available Drives" />} />
        <Route path="applications" element={<Placeholder title="My Applications" />} />
        <Route path="profile" element={<Placeholder title="Student Profile" />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
