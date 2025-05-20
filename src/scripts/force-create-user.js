// Direct script to create a user with admin privileges
// This bypasses all the configuration files and directly uses the service key

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Initialize the Supabase client with admin privileges
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// User details - CHANGE THESE as needed
const userToCreate = {
  email: 'admin@carbonecompany.com',
  password: 'admin123',
  name: 'Administrador',
  role: 'admin'
}

async function createUser() {
  try {
    console.log(`Attempting to create user: ${userToCreate.email}`)
    console.log(`Using service key starting with: ${supabaseServiceKey.substring(0, 15)}...`)
    
    // First check if the user already exists
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('Error listing users (service key may be invalid):', listError.message)
      return
    }
    
    const existingUser = users.users.find(user => user.email === userToCreate.email)
    
    if (existingUser) {
      console.log(`User ${userToCreate.email} already exists with ID: ${existingUser.id}`)
      
      // Option to update the existing user
      console.log('Updating existing user to ensure metadata and confirmed email...')
      
      const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        {
          email_confirm: true,
          user_metadata: {
            name: userToCreate.name,
            role: userToCreate.role
          },
          password: userToCreate.password
        }
      )
      
      if (updateError) {
        console.error('Error updating user:', updateError.message)
      } else {
        console.log('User updated successfully!')
      }
      
      return
    }
    
    // Create a new user
    const { data, error } = await supabase.auth.admin.createUser({
      email: userToCreate.email,
      password: userToCreate.password,
      email_confirm: true,
      user_metadata: {
        name: userToCreate.name,
        role: userToCreate.role
      }
    })
    
    if (error) {
      console.error('Error creating user:', error.message)
      return
    }
    
    console.log('User created successfully!')
    console.log(`User ID: ${data.user.id}`)
    console.log(`Email: ${userToCreate.email}`)
    console.log(`Password: ${userToCreate.password}`)
    
    // Verify login works
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: userToCreate.email,
      password: userToCreate.password
    })
    
    if (loginError) {
      console.error('Login verification failed:', loginError.message)
    } else {
      console.log('Login verification successful!')
    }
    
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

// Run the function
createUser() 