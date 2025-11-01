import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import api from '../services/api'; // Our custom axios instance

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get the initial session on page load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 2. Listen for any auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // 3. Cleanup listener on unmount
    return () => subscription.unsubscribe();
  }, []);

  // Function to call our backend's /api/auth/login endpoint
  const loginWithGoogle = async () => {
    try {
      // This calls http://localhost:3000/api/auth/login
      const { data } = await api.get('/auth/login');
      
      if (data.success && data.url) {
        // Redirect the user to the Google sign-in page
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  // Function to log the user out
  const logout = async () => {
    await supabase.auth.signOut();
    // The onAuthStateChange listener will handle setting user/session to null
  };

  const value = {
    session,
    user,
    loading,
    loginWithGoogle,
    logout,
  };

  // Don't render children until we've checked for an existing session
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily access auth state
export const useAuth = () => {
  return useContext(AuthContext);
};