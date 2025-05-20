require('dotenv').config()
const { getSupabaseAdminClient, testCredentials } = require('../lib/config')

// Initialize the Supabase client with admin privileges
const supabase = getSupabaseAdminClient()

// Test user details from config
const testUser = testCredentials.admin

async function createTestUser() {
  try {
    console.log('Creating test admin user...')
    
    // First check if user already exists by trying to sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testUser.email,
      password: testUser.password
    })
    
    if (signInData?.user) {
      console.log('Test user already exists and credentials are valid.')
      console.log('Email:', testUser.email)
      console.log('Password:', testUser.password)
      return
    }
    
    // Try to create user with admin auth API
    const { data, error } = await supabase.auth.admin.createUser({
      email: testUser.email,
      password: testUser.password,
      email_confirm: true,
      user_metadata: {
        name: testUser.name,
        role: testUser.role
      }
    })

    if (error) {
      if (error.message.includes('already registered')) {
        console.log('User already exists, but password may be different.')
        console.log('Try signing in with the known password:', testUser.password)
      } else {
        console.error('Error creating test user:', error.message)
      }
      return
    }

    console.log('Test admin user created successfully!')
    console.log('Email:', testUser.email)
    console.log('Password:', testUser.password)
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

// Run the function
createTestUser() 