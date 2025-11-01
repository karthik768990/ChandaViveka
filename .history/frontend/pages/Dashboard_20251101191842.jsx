import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api'; // Our axios instance

const Dashboard = () => {
  const { user } = useAuth(); // Get user from AuthContext
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // This call automatically includes the Bearer token
        const { data } = await api.get('/auth/profile');
        if (data.success) {
          setProfile(data.user);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  return (
    <div>
      <h2>Dashboard (Protected Route)</h2>
      <p>
        Welcome, <strong>{user?.email}</strong>
      </p>

      <hr />

      <h3>Your Profile (from /api/auth/profile):</h3>
      {loading && <p>Loading backend profile...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {profile && (
        <pre style={{ background: '#eee', padding: '10px' }}>
          {JSON.stringify(profile, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default Dashboard;