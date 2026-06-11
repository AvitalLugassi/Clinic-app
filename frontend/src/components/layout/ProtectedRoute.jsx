import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import Spinner from '../ui/Spinner/Spinner';

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuthContext();

  if (loading) return <Spinner fullPage />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;

  return children ?? <Outlet />;
}
