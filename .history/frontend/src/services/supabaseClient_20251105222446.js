import { createClient } from '@supabase/supabase-js'

// Get Supabase URL and PUBLIC Anon Key from .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key is missing in .env.local");
}
console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("Supabase Key loaded?", !!import.meta.env.VITE_SUPABASE_ANON_KEY);


export const supabase = createClient(supabaseUrl, supabaseAnonKey)