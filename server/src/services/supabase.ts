import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to handle Supabase responses
export const handleSupabaseResponse = <T>(response: any) => {
  if (response.error) {
    throw new Error(response.error.message);
  }
  return response.data as T;
};
