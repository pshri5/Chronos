import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { JobListPage } from '../pages/JobListPage';
import { JobDetailPage } from '../pages/JobDetailPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { JobLogsPage } from '../pages/JobLogsPage';

// Helper component to wrap routes that require authentication
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  // In a real app, we would check the auth context here
  // For now, we'll just return the children (we'll implement auth context later)
  return children;
};

const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        {/* Public routes */}
        <Navigate path="/" to="/jobs" replace />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes - require authentication */}
        <Route path="/jobs" element={<RequireAuth><JobListPage /></RequireAuth>} />
        <Route path="/jobs/create" element={<RequireAuth><JobDetailPage /></RequireAuth>} />
        <Route path="/jobs/:id" element={<RequireAuth><JobDetailPage /></RequireAuth>} />
        <Route path="/notifications" element={<RequireAuth><NotificationsPage /></RequireAuth>} />
        <Route path="/job-logs" element={<RequireAuth><JobLogsPage /></RequireAuth>} />

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Layout>
  );
};

export { AppRoutes };