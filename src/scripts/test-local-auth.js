// Test script for local authentication
const { createMockClient } = require('../lib/mock-auth');

console.log('Directly using the mock authentication system');

// Create the client
const supabase = createMockClient();

async function testAuth() {
  console.log('Testing local authentication system...');
  console.log('Available users:');
  console.log('- admin@carbonecompany.com / admin123 (admin)');
  console.log('- gerente@carbonecompany.com / gerente123 (manager)');
  console.log('- usuario@carbonecompany.com / usuario123 (user)');
  
  // Try to sign in with the admin user
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@carbonecompany.com',
    password: 'admin123'
  });
  
  if (error) {
    console.error('Error signing in:', error.message);
    return;
  }
  
  console.log('\nSigned in successfully!');
  console.log('User:', data.user);
  console.log('Session expires:', data.session.expires_at);
  
  // List all users (admin function)
  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
  
  if (usersError) {
    console.error('Error listing users:', usersError.message);
    return;
  }
  
  console.log('\nAll users in the system:');
  usersData.users.forEach(user => {
    console.log(`- ${user.email} (${user.user_metadata.role})`);
  });
  
  console.log('\nLocal authentication system is working correctly!');
}

testAuth().catch(console.error);
