import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { JobListPage } from '../pages/JobListPage';
import { JobDetailPage } from '../pages/JobDetailPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { JobLogsPage } from '../pages/JobLogsPage';
import { useAuth } from '../contexts/AuthContext';

const AppRoutes = () => {
  const { token, loading } = useAuth();

  // If still loading, show a loading indicator or just return null (or a spinner)
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <Routes>
        {/* Public routes */}
        <Navigate path="/" to="/jobs" replace />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes - require authentication */}
        <Route
          path="/jobs"
          element={
            token ? <JobListPage /> : <Navigate to="/login" replace state={{ from: '/jobs' }} />
          }
        />
        <Route
          path="/jobs/create"
          element={
            token ? <JobDetailPage /> : <Navigate to="/login" replace state={{ from: '/jobs/create' }} />
          }
        />
        <Route
          path="/jobs/:id"
          element={
            token ? <JobDetailPage /> : <Navigate to="/login" replace state={{ from: `/jobs/:id` }} />
          }
        />
        <Route
          path="/jobs/:id/logs"
          element={
            token ? <JobLogsPage jobId={id} /> : <Navigate to="/login" replace state={{ from: `/jobs/:id/logs` }} />
          }
        />
        <Route
          path="/notifications"
          element={
            token ? <NotificationsPage /> : <Navigate to="/login" replace state={{ from: '/notifications' }} />
          }
        />
        <Route
          path="/job-logs"
          element={
            token ? <JobLogsPage /> : <Navigate to="/login" replace state={{ from: '/job-logs' }} />
          }
        />

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Layout>
  );
};

export { AppRoutes };