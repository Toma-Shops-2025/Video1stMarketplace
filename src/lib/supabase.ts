import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client using environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  console.error('VITE_SUPABASE_URL:', supabaseUrl);
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseKey ? '[PRESENT]' : '[MISSING]');
  throw new Error('Missing Supabase configuration. Check console for details.');
}

console.log('Initializing Supabase client with URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'tomashops_supabase_auth',
    flowType: 'pkce'
  }
});

// Initialize auth state
supabase.auth.getSession().then(({ data: { session }, error }) => {
  if (error) {
    console.error('Error getting auth session:', error);
  } else if (session) {
    console.log('Auth session restored successfully');
  } else {
    console.log('No active session found');
  }
});

// Test the connection and log detailed errors
supabase.from('products').select('count', { count: 'exact' }).then(({ count, error }) => {
  if (error) {
    console.error('Error connecting to Supabase:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      details: error.details
    });
  } else {
    console.log('Successfully connected to Supabase. Products count:', count);
  }
});

export default supabase;