import { createClient } from '@supabase/supabase-js'
import { createMockClient } from './mock-auth'
import { supabaseConfig, USE_LOCAL_AUTH } from './config'

// For debugging
if (USE_LOCAL_AUTH) {
  console.log('Using mock Supabase client (local auth enabled)');
}

// Create the appropriate client
export const supabase = USE_LOCAL_AUTH 
  ? createMockClient()
  : createClient(supabaseConfig.url, supabaseConfig.anonKey) 