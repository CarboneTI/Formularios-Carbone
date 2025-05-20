// Local Auth System
// This script implements a simple local authentication system that bypasses Supabase API calls
// It stores user credentials in memory and fakes the authentication flow
// Use this for testing when Supabase API has connection issues

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Default users to create
const DEFAULT_USERS = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    email: "admin@carbonecompany.com",
    name: "Administrador",
    password: "admin123",
    role: "admin",
    created_at: new Date().toISOString()
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    email: "gerente@carbonecompany.com",
    name: "Gerente",
    password: "gerente123",
    role: "manager",
    created_at: new Date().toISOString()
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    email: "usuario@carbonecompany.com",
    name: "Usuário Padrão",
    password: "usuario123",
    role: "user",
    created_at: new Date().toISOString()
  }
];

// Local storage path
const LOCAL_STORAGE_DIR = path.join(__dirname, '..', '..', '.local-data');
const USERS_FILE_PATH = path.join(LOCAL_STORAGE_DIR, 'users.json');

// Generate a fake JWT token
function generateFakeToken(userData) {
  // Create a simple token structure
  const tokenData = {
    sub: userData.id,
    email: userData.email,
    role: userData.role,
    user_metadata: {
      name: userData.name,
      role: userData.role
    },
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400 * 7 // 7 days
  };
  
  // Convert to base64
  const tokenStr = Buffer.from(JSON.stringify(tokenData)).toString('base64');
  
  // Generate a simple signature
  const signature = crypto.createHash('sha256')
    .update(tokenStr + 'local-secret')
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  
  return `eyJhbGciOiJIUzI1NiJ9.${tokenStr}.${signature}`;
}

// Create the local files
function setupLocalStorage() {
  // Create directory if it doesn't exist
  if (!fs.existsSync(LOCAL_STORAGE_DIR)) {
    fs.mkdirSync(LOCAL_STORAGE_DIR, { recursive: true });
    console.log(`Created local storage directory: ${LOCAL_STORAGE_DIR}`);
  }

  // Check if users file exists
  let users = [];
  if (fs.existsSync(USERS_FILE_PATH)) {
    try {
      users = JSON.parse(fs.readFileSync(USERS_FILE_PATH, 'utf8'));
      console.log(`Found existing users: ${users.length}`);
    } catch (err) {
      console.error(`Error reading users file: ${err.message}`);
      users = [];
    }
  }

  // Add default users if they don't exist
  for (const defaultUser of DEFAULT_USERS) {
    const exists = users.some(u => u.email === defaultUser.email);
    if (!exists) {
      users.push({
        ...defaultUser,
        // Hash the password for storage
        password_hash: crypto.createHash('sha256')
          .update(defaultUser.password)
          .digest('hex')
      });
      console.log(`Added user: ${defaultUser.email} (${defaultUser.role})`);
    }
  }

  // Save users to file
  fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2));
  console.log(`Saved ${users.length} users to: ${USERS_FILE_PATH}`);

  return users;
}

// Create mock API handlers
function generateMockApiHandlers() {
  const apiDir = path.join(__dirname, '..', 'lib', 'mock-auth');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
  }
  
  // Create the auth module
  const authModulePath = path.join(apiDir, 'index.js');
  const authModule = `// Mock Auth Module - Created by local-auth script
// This module provides a local authentication system when Supabase is unavailable

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Local storage path
const USERS_FILE_PATH = path.join(__dirname, '..', '..', '..', '.local-data', 'users.json');

// Cache for users
let usersCache = null;

// Load users from file
function loadUsers() {
  if (usersCache) return usersCache;
  
  try {
    if (fs.existsSync(USERS_FILE_PATH)) {
      usersCache = JSON.parse(fs.readFileSync(USERS_FILE_PATH, 'utf8'));
      return usersCache;
    }
  } catch (err) {
    console.error('Error loading users from file:', err);
  }
  
  return [];
}

// Generate a fake JWT token
function generateToken(userData) {
  // Create a simple token structure
  const tokenData = {
    sub: userData.id,
    email: userData.email,
    role: userData.role,
    user_metadata: {
      name: userData.name,
      role: userData.role
    },
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400 * 7 // 7 days
  };
  
  // Convert to base64
  const tokenStr = Buffer.from(JSON.stringify(tokenData)).toString('base64');
  
  // Generate a simple signature
  const signature = crypto.createHash('sha256')
    .update(tokenStr + 'local-secret')
    .digest('base64')
    .replace(/\\+/g, '-')
    .replace(/\\//g, '_')
    .replace(/=/g, '');
  
  return \`eyJhbGciOiJIUzI1NiJ9.\${tokenStr}.\${signature}\`;
}

// Mock auth client for local development
const mockAuthClient = {
  // Sign in with email and password
  signInWithPassword: async ({ email, password }) => {
    const users = loadUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return { error: { message: 'Invalid email or password' } };
    }
    
    const passwordHash = crypto.createHash('sha256')
      .update(password)
      .digest('hex');
    
    if (user.password_hash !== passwordHash) {
      return { error: { message: 'Invalid email or password' } };
    }
    
    const token = generateToken(user);
    
    return {
      data: {
        user: {
          id: user.id,
          email: user.email,
          user_metadata: {
            name: user.name,
            role: user.role
          }
        },
        session: {
          access_token: token,
          refresh_token: token,
          expires_at: new Date(Date.now() + 86400 * 7 * 1000).toISOString()
        }
      }
    };
  },
  
  // Sign out
  signOut: async () => {
    return { error: null };
  },
  
  // Get session
  getSession: async () => {
    // This would normally validate a token from localStorage
    // For simplicity, we'll return null (no active session)
    return { data: { session: null } };
  },
  
  // Admin API for listing users
  admin: {
    listUsers: async () => {
      const users = loadUsers();
      
      return {
        data: {
          users: users.map(u => ({
            id: u.id,
            email: u.email,
            user_metadata: {
              name: u.name,
              role: u.role
            },
            created_at: u.created_at
          }))
        }
      };
    },
    
    // Create user
    createUser: async ({ email, password, user_metadata }) => {
      const users = loadUsers();
      
      // Check if user already exists
      if (users.some(u => u.email === email)) {
        return { error: { message: 'User already exists' } };
      }
      
      // Create new user
      const newUser = {
        id: crypto.randomUUID(),
        email,
        name: user_metadata.name,
        role: user_metadata.role,
        password_hash: crypto.createHash('sha256')
          .update(password)
          .digest('hex'),
        created_at: new Date().toISOString()
      };
      
      // Add to list
      users.push(newUser);
      
      // Save to file
      fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2));
      
      // Update cache
      usersCache = users;
      
      return {
        data: {
          user: {
            id: newUser.id,
            email: newUser.email,
            user_metadata: {
              name: newUser.name,
              role: newUser.role
            },
            created_at: newUser.created_at
          }
        }
      };
    }
  }
};

// Mock supabase client for local development
const createMockClient = () => {
  return {
    auth: mockAuthClient,
    // Add other Supabase services as needed
    from: (table) => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
    })
  };
};

module.exports = {
  createMockClient,
  mockAuthClient
};
`;
  
  // Write the auth module
  fs.writeFileSync(authModulePath, authModule);
  console.log(`Created mock auth module at: ${authModulePath}`);
  
  // Create a usage example file
  const usageExamplePath = path.join(apiDir, 'example.js');
  const usageExample = `// Example of how to use the mock auth system
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
`;
  
  // Write the usage example
  fs.writeFileSync(usageExamplePath, usageExample);
  console.log(`Created usage example at: ${usageExamplePath}`);
  
  // Create a wrapper for supabase.js
  const wrapperPath = path.join(__dirname, '..', 'lib', 'local-supabase.js');
  const wrapperModule = `// Local Supabase wrapper - Created by local-auth script
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
`;
  
  // Write the wrapper module
  fs.writeFileSync(wrapperPath, wrapperModule);
  console.log(`Created Supabase wrapper at: ${wrapperPath}`);
}

// Create a simple CLI to test the local login
function createTestScript() {
  const testScriptPath = path.join(__dirname, 'test-local-auth.js');
  const testScript = `// Test script for local authentication
const { createSupabaseClient } = require('../lib/local-supabase');

// Force local auth
process.env.USE_LOCAL_AUTH = 'true';

// Create the client
const supabase = createSupabaseClient();

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
  
  console.log('\\nSigned in successfully!');
  console.log('User:', data.user);
  console.log('Session expires:', data.session.expires_at);
  
  // List all users (admin function)
  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
  
  if (usersError) {
    console.error('Error listing users:', usersError.message);
    return;
  }
  
  console.log('\\nAll users in the system:');
  usersData.users.forEach(user => {
    console.log(\`- \${user.email} (\${user.user_metadata.role})\`);
  });
  
  console.log('\\nLocal authentication system is working correctly!');
}

testAuth().catch(console.error);
`;
  
  // Write the test script
  fs.writeFileSync(testScriptPath, testScript);
  console.log(`Created test script at: ${testScriptPath}`);
}

// Main function
async function main() {
  console.log('=== Setting up Local Authentication System ===\n');
  
  // Setup storage and create users
  const users = setupLocalStorage();
  console.log(`\nCreated ${users.length} local users.`);
  
  // Generate the mock API handlers
  generateMockApiHandlers();
  
  // Create test script
  createTestScript();
  
  console.log('\n=== Local Authentication System Ready ===');
  console.log('\nTo test the local auth system, run:');
  console.log('node src/scripts/test-local-auth.js');
  
  console.log('\nTo use local auth in your application, set environment variable:');
  console.log('USE_LOCAL_AUTH=true');
  
  console.log('\nAvailable users:');
  DEFAULT_USERS.forEach(user => {
    console.log(`- ${user.email} / ${user.password} (${user.role})`);
  });
}

// Run the main function
main().catch(console.error); 