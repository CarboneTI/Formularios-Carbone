// This is a direct script to create a user in Supabase without any dependencies
const https = require('https');

// Hard-coded Supabase credentials (IMPORTANT: Do not share this script)
const supabaseUrl = 'https://dzhscmihztgwtmiqidjy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6aHNjbWloenRnd3RtaXFpZGp5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNDU4MDI3OCwiZXhwIjoyMDMwMTU2Mjc4fQ.VdhQWGCLGlkIVSWcT1qGm8UEJdLovYbH0c7I3bautGU';

// User info to create
const userToCreate = {
  email: 'admin@carbonecompany.com',
  password: 'admin123',
  user_metadata: {
    name: 'Administrador',
    role: 'admin'
  },
  email_confirm: true
};

// Make the API request directly
const options = {
  hostname: supabaseUrl.replace('https://', ''),
  path: '/auth/v1/admin/users',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`
  }
};

const req = https.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('User created or updated successfully!');
      console.log('Email:', userToCreate.email);
      console.log('Password:', userToCreate.password);
      try {
        const parsedData = JSON.parse(data);
        console.log('User ID:', parsedData.id);
      } catch (e) {
        console.log('Response:', data);
      }
    } else {
      console.error('Error:', data);
      
      // Try signing in to see if the user already exists
      console.log('Attempting to check if user exists by signing in...');
      checkUserExists();
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

// Write data to request body
req.write(JSON.stringify(userToCreate));
req.end();

// Function to check if the user already exists by trying to sign in
function checkUserExists() {
  const signInOptions = {
    hostname: supabaseUrl.replace('https://', ''),
    path: '/auth/v1/token?grant_type=password',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey
    }
  };

  const signInReq = https.request(signInOptions, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('User exists and credentials are valid!');
        console.log('You can log in with:');
        console.log('Email:', userToCreate.email);
        console.log('Password:', userToCreate.password);
      } else {
        console.log('User may exist but credentials are invalid or another issue occurred.');
        console.log('Response:', data);
      }
    });
  });

  signInReq.on('error', (e) => {
    console.error(`Problem with sign-in request: ${e.message}`);
  });

  signInReq.write(JSON.stringify({
    email: userToCreate.email,
    password: userToCreate.password
  }));
  
  signInReq.end();
} 