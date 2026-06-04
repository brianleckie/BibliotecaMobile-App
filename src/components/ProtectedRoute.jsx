import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, message }) {
  const { token } = useAuth();
  if (!token)
    return (
      <Navigate
        to="/login"
        replace
        state={{ message: message ?? 'Iniciá sesión para acceder a esta sección.' }}
      />
    );
  return children;
}
