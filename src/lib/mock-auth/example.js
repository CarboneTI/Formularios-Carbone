// Example of how to use the mock auth system
const { createMockClient } = require('./index');

// Create a mock client
const mockSupabase = createMockClient();

async function testAuth() {
  // Try to sign in
  const { data, error } = await mockSupabase.auth.signInWithPassword({
    email: 'admin@carbonecompany.com',
    password: 'admin123'
  });
  
  if (error) {
    console.error('Error signing in:', error.message);
    return;
  }
  
  console.log('Signed in successfully!');
  console.log('User:', data.user);
  console.log('Token:', data.session.access_token);
  
  // List users (admin only)
  const { data: usersData, error: usersError } = await mockSupabase.auth.admin.listUsers();
  
  if (usersError) {
    console.error('Error listing users:', usersError.message);
    return;
  }
  
  console.log('Users:', usersData.users.length);
}

testAuth().catch(console.error);
