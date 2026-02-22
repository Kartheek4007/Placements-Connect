
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/student/StudentDashboard';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<DashboardLayout requireAdmin={true} />}>
        <Route index element={<AdminDashboard />} />
        {/* Further admin routes go here */}
      </Route>

      {/* Student Routes */}
      <Route path="/student" element={<DashboardLayout requireAdmin={false} />}>
        <Route index element={<StudentDashboard />} />
        {/* Further student routes go here */}
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
