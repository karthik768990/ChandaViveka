import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Callback = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // The AuthContext listener is handling the session from the URL hash.
    // Once the session is successfully set, we redirect the user.
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  return <div>Processing login... Please wait.</div>;
};

export default Callback;