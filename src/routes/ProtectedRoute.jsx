import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

export default function ProtectedRoute({ children, allow }) {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader fullHeight label="Checking your session…" />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Frontend gate for UX only — the backend remains the final authority
  // on every request per the auth model already in place server-side.
  if (allow && !allow.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
