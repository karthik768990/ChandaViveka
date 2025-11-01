import axios from 'axios';
import { supabase } from './supabaseClient';

// Get the backend API base URL from .env.local
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Interceptor to automatically add the Supabase Auth Token
// to every request to YOUR backend.
api.interceptors.request.use(
  async (config) => {
    // Get the current session from the Supabase client
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;