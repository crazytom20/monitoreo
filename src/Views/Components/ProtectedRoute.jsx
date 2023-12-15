import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './Authentication';

function ProtectedRoutes() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to="/login" />;
}

export default ProtectedRoutes;
