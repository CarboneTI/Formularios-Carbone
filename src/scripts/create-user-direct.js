const { getSupabaseAdminClient, testCredentials } = require('../lib/config')

// Initialize the Supabase client with admin privileges
const supabase = getSupabaseAdminClient()

// Test user details from config
const testUser = testCredentials.admin

async function createTestUser() {
  try {
    console.log('Creating test admin user...')
    
    // Try simple signup first
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password,
      options: {
        data: {
          name: testUser.name,
          role: testUser.role
        }
      }
    })
    
    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        console.log('User already exists, trying to verify it can be used to login')
        
        // Try to sign in with the credentials
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: testUser.email,
          password: testUser.password
        })
        
        if (signInError) {
          console.error('Error signing in:', signInError.message)
          console.log('Creating new user might be needed, but email is already registered')
        } else {
          console.log('Successfully signed in with the test user!')
          console.log('Email:', testUser.email)
          console.log('Password:', testUser.password)
        }
      } else {
        console.error('Error creating test user:', signUpError.message)
      }
      return
    }
    
    console.log('Test admin user created successfully!')
    console.log('Email:', testUser.email)
    console.log('Password:', testUser.password)
    
    // Confirm email immediately if possible
    try {
      const { data, error } = await supabase.auth.admin.updateUserById(
        signUpData.user.id,
        { email_confirm: true }
      )
      
      if (error) {
        console.error('Error confirming email:', error.message)
      } else {
        console.log('Email confirmed automatically')
      }
    } catch (err) {
      console.error('Could not confirm email:', err.message)
    }
    
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

// Run the function
createTestUser() 