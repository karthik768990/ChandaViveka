import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, loginWithGoogle } = useAuth();

  // If user is already logged in, send them to the dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div>
      <h2>Welcome</h2>
      <p>Please log in to use the application.</p>
      <button onClick={loginWithGoogle}>
        Login with Google
      </button>
    </div>
  );
};

export default Home;