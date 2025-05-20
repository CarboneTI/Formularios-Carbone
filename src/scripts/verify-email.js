// Direct script to verify email for any user account
// Especially useful when having authentication issues

const { createClient } = require('@supabase/supabase-js')

// Supabase connection details (hardcoded for reliability)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Initialize admin Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Email to verify - change this as needed
const emailToVerify = 'admin@carbonecompany.com'

async function verifyEmail() {
  try {
    console.log(`Attempting to verify email: ${emailToVerify}`)
    
    // First list users to find the user's ID
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('Error listing users:', listError.message)
      return
    }
    
    const userToVerify = users.users.find(user => user.email === emailToVerify)
    
    if (!userToVerify) {
      console.error(`User with email ${emailToVerify} not found`)
      return
    }
    
    console.log(`Found user: ${userToVerify.id} (${userToVerify.email})`)
    
    // Update the user to confirm their email
    const { data, error } = await supabase.auth.admin.updateUserById(
      userToVerify.id,
      { email_confirm: true }
    )
    
    if (error) {
      console.error('Error confirming email:', error.message)
      return
    }
    
    console.log('Email confirmed successfully!')
    console.log('User can now login with:', emailToVerify)
    
    // As an extra verification, try to log in
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'admin@carbonecompany.com',
      password: process.env.ADMIN_PASSWORD || 'admin123'
    })
    
    if (loginError) {
      console.error('Login test failed:', loginError.message)
      console.log('You may need to reset the password')
    } else {
      console.log('Login test successful! User credentials are valid.')
    }
    
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

// Run the function
verifyEmail() 