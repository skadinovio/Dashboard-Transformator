import { Navigate } from 'react-router-dom';
import { getUserFromToken } from '../utils/auth';

export default function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  if (!token) {
    // token invalid atau expired
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }

  const user = getUserFromToken();
  if (!user) {
    // token invalid atau expired
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}