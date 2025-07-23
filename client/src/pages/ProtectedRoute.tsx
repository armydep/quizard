import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('jwt');
  return token ? children : <Navigate to="/login" />;
}
