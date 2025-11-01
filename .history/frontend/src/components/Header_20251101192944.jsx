import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // <-- Add .jsx



const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', background: '#f0f0f0' }}>
      <div>
        <Link to={user ? "/dashboard" : "/"} style={{ marginRight: '10px' }}>
          Home
        </Link>
        {user && (
          <Link to="/analyzer" style={{ marginRight: '10px' }}>
            Chandas Analyzer
          </Link>
        )}
      </div>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: '10px' }}>{user.email}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <span>Please log in</span>
        )}
      </div>
    </header>
  );
};

export default Header;