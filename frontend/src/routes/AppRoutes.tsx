import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { JobListPage } from '../pages/JobListPage';
import { JobDetailPage } from '../pages/JobDetailPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { JobLogsPage } from '../pages/JobLogsPage';
import { useAuth } from '../contexts/AuthContext';
import { Spinner } from '../components/Spinner';

const AppRoutes = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        {/* Redirect root based on auth */}
        <Route path="/" element={<Navigate to={token ? '/jobs' : '/login'} replace />} />

        {/* Public routes */}
        <Route path="/login" element={token ? <Navigate to="/jobs" replace /> : <LoginPage />} />
        <Route path="/register" element={token ? <Navigate to="/jobs" replace /> : <RegisterPage />} />

        {/* Protected routes */}
        <Route
          path="/jobs"
          element={token ? <JobListPage /> : <Navigate to="/login" replace state={{ from: '/jobs' }} />}
        />
        <Route
          path="/jobs/:id"
          element={token ? <JobDetailPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/jobs/:id/logs"
          element={token ? <JobLogsPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/notifications"
          element={token ? <NotificationsPage /> : <Navigate to="/login" replace state={{ from: '/notifications' }} />}
        />
        <Route
          path="/job-logs"
          element={token ? <JobLogsPage /> : <Navigate to="/login" replace />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={token ? '/jobs' : '/login'} replace />} />
      </Routes>
    </Layout>
  );
};

export { AppRoutes };