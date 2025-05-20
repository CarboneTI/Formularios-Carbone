// Mock Auth Module - Created for local-auth script
// This module provides a local authentication system when Supabase is unavailable
// Browser-compatible version (no Node.js modules)

// In-memory user storage instead of file system
const DEFAULT_USERS = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    email: "admin@carbonecompany.com",
    name: "Administrador",
    password_hash: "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9", // admin123
    role: "admin",
    created_at: "2023-01-01T00:00:00.000Z"
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    email: "gerente@carbonecompany.com",
    name: "Gerente",
    password_hash: "cf15171faaa8c0bec30a6a3d1d32c56d8fb1690acef8cef24ba608ae23db1935", // gerente123
    role: "manager",
    created_at: "2023-01-01T00:00:00.000Z"
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    email: "usuario@carbonecompany.com",
    name: "Usuário Padrão",
    password_hash: "e8dfecd64435958ad95e27361938581326ffd8b25951b675dfd58f3f29f70689", // usuario123
    role: "user",
    created_at: "2023-01-01T00:00:00.000Z"
  }
];

// In-memory storage
let usersCache = [...DEFAULT_USERS];

// Simple hash function for passwords (browser compatible)
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
}

// Generate a simple token
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
  
  // Simple base64 encoding (browser compatible)
  const tokenStr = btoa(JSON.stringify(tokenData));
  
  // Return a fake JWT
  return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${tokenStr}.fake-signature`;
}

// Mock auth client for local development
const mockAuthClient = {
  // Sign in with email and password
  signInWithPassword: async ({ email, password }) => {
    console.log('Local auth: Attempting sign in with', email);
    const user = usersCache.find(u => u.email === email);
    
    if (!user) {
      console.log('Local auth: User not found');
      return { error: { message: 'Invalid email or password' } };
    }
    
    // For this mock version, we'll just accept the passwords directly
    // In a real version, we'd hash the password and compare it
    if (
      (email === 'admin@carbonecompany.com' && password === 'admin123') ||
      (email === 'gerente@carbonecompany.com' && password === 'gerente123') ||
      (email === 'usuario@carbonecompany.com' && password === 'usuario123')
    ) {
      console.log('Local auth: Successful sign in');
      const token = generateToken(user);
      
      // Store user in localStorage to simulate a session
      if (typeof window !== 'undefined') {
        localStorage.setItem('supabase.auth.token', token);
        localStorage.setItem('supabase.auth.user', JSON.stringify(user));
      }
      
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
    }
    
    console.log('Local auth: Invalid password');
    return { error: { message: 'Invalid email or password' } };
  },
  
  // Sign out
  signOut: async () => {
    console.log('Local auth: Signing out');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('supabase.auth.user');
    }
    return { error: null };
  },
  
  // Get session
  getSession: async () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('supabase.auth.token');
      const userJson = localStorage.getItem('supabase.auth.user');
      
      if (token && userJson) {
        try {
          const user = JSON.parse(userJson);
          return {
            data: {
              session: {
                access_token: token,
                refresh_token: token,
                expires_at: new Date(Date.now() + 86400 * 7 * 1000).toISOString(),
                user: {
                  id: user.id,
                  email: user.email,
                  user_metadata: {
                    name: user.name,
                    role: user.role
                  }
                }
              }
            }
          };
        } catch (e) {
          console.error('Local auth: Error parsing user', e);
        }
      }
    }
    
    return { data: { session: null } };
  },
  
  // Admin API for listing users
  admin: {
    listUsers: async () => {
      console.log('Local auth: Listing users');
      return {
        data: {
          users: usersCache.map(u => ({
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
    createUser: async ({ email, password, email_confirm = true, user_metadata }) => {
      console.log('Local auth: Creating user', email);
      
      // Check if user already exists
      if (usersCache.some(u => u.email === email)) {
        return { error: { message: 'User already exists' } };
      }
      
      // Create new user
      const newUser = {
        id: 'user_' + Math.random().toString(36).substring(2, 11),
        email,
        name: user_metadata?.name || 'New User',
        role: user_metadata?.role || 'user',
        password_hash: simpleHash(password),
        created_at: new Date().toISOString()
      };
      
      // Add to memory
      usersCache.push(newUser);
      
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
    },
    
    // Update user
    updateUserById: async (id, { user_metadata, email_confirm, password }) => {
      console.log('Local auth: Updating user', id);
      
      const userIndex = usersCache.findIndex(u => u.id === id);
      if (userIndex === -1) {
        return { error: { message: 'User not found' } };
      }
      
      // Update user data
      const updatedUser = { ...usersCache[userIndex] };
      
      if (user_metadata) {
        updatedUser.name = user_metadata.name || updatedUser.name;
        updatedUser.role = user_metadata.role || updatedUser.role;
      }
      
      if (password) {
        updatedUser.password_hash = simpleHash(password);
      }
      
      // Update in cache
      usersCache[userIndex] = updatedUser;
      
      return {
        data: {
          user: {
            id: updatedUser.id,
            email: updatedUser.email,
            user_metadata: {
              name: updatedUser.name,
              role: updatedUser.role
            }
          }
        }
      };
    }
  }
};

// Mock supabase client for local development
const createMockClient = () => {
  console.log('Creating mock Supabase client (browser-compatible)');
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

// Export the mock client
module.exports = {
  createMockClient,
  mockAuthClient
};
