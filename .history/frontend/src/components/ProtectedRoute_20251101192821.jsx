import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // <-- Add .jsx

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading session...</div>;
  }

  if (!user) {
    // User is not logged in, redirect to home
    return <Navigate to="/" replace />;
  }

  // User is logged in, show the protected page
  return children;
};

export default ProtectedRoute;