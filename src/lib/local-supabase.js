// Local Supabase wrapper - Created by local-auth script
// This file conditionally uses the mock auth system or the real Supabase client

const { createClient } = require('@supabase/supabase-js');
const { createMockClient } = require('./mock-auth');

// Check if we should use the mock client
const SUPABASE_URL = 'https://dzhscmihztgwtmiqidjy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6aHNjbWloenRnd3RtaXFpZGp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ1ODAyNzgsImV4cCI6MjAzMDE1NjI3OH0.0AsUhH27yLhh9OKy9Fohs5-U4JGKhZcLiU6qLdsaLyY';
const USE_MOCK_CLIENT = process.env.USE_LOCAL_AUTH === 'true';

// Create the appropriate client
function createSupabaseClient() {
  if (USE_MOCK_CLIENT) {
    console.log('Using LOCAL authentication system (mock Supabase client)');
    return createMockClient();
  } else {
    console.log('Using REAL Supabase client');
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
}

// Export the client and utilities
module.exports = {
  createSupabaseClient,
  supabase: createSupabaseClient()
};
