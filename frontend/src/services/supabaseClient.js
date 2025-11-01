import { createClient } from '@supabase/supabase-js'

// Get Supabase URL and PUBLIC Anon Key from .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key is missing in .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)