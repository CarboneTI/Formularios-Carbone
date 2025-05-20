// Script to validate and debug Supabase API keys
const { createClient } = require('@supabase/supabase-js');
const https = require('https');

// Get keys from environment variables
const CURRENT_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const CURRENT_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Alternative keys to try (with different formats/timestamps)
const ALTERNATIVE_KEYS = [
  {
    type: 'service key',
    url: SUPABASE_URL,
    key: CURRENT_SERVICE_KEY,
  },
  {
    type: 'anon key',
    url: SUPABASE_URL,
    key: CURRENT_ANON_KEY,
  }
];

// Helper to decode JWT without dependencies
function decodeJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { error: 'Invalid JWT format' };
    }
    
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    
    return JSON.parse(jsonPayload);
  } catch (e) {
    return { error: e.message };
  }
}

// Test a key with direct HTTPS call
function testKeyWithHTTPS(url, key, type) {
  return new Promise((resolve) => {
    console.log(`\nTesting ${type} with HTTPS request...`);
    console.log(`URL: ${url}`);
    console.log(`Key: ${key.substring(0, 15)}...${key.substring(key.length - 10)}`);
    
    // Extract host from URL
    const host = url.replace('https://', '');
    
    const options = {
      hostname: host,
      path: '/rest/v1/',
      method: 'GET',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    };
    
    const req = https.request(options, (res) => {
      console.log(`Status Code: ${res.statusCode}`);
      
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          console.log('Response:', JSON.stringify(parsedData, null, 2));
        } catch (e) {
          console.log('Response (not JSON):', data);
        }
        
        resolve({
          statusCode: res.statusCode,
          success: res.statusCode >= 200 && res.statusCode < 300
        });
      });
    });
    
    req.on('error', (e) => {
      console.error(`Request error: ${e.message}`);
      resolve({ 
        statusCode: 0, 
        success: false,
        error: e.message
      });
    });
    
    req.end();
  });
}

// Test a key with Supabase client
async function testKeyWithClient(url, key, type) {
  console.log(`\nTesting ${type} with Supabase client...`);
  console.log(`URL: ${url}`);
  console.log(`Key: ${key.substring(0, 15)}...${key.substring(key.length - 10)}`);
  
  try {
    const supabase = createClient(url, key);
    
    // Try a simple query
    const { data, error } = await supabase.from('_verify_keys_test').select('*').limit(1);
    
    if (error) {
      console.log('Supabase client error:', error.message);
      return { success: false, error: error.message };
    }
    
    console.log('Supabase client success:', data || 'No data returned');
    return { success: true, data };
  } catch (e) {
    console.log('Supabase client exception:', e.message);
    return { success: false, error: e.message };
  }
}

async function main() {
  console.log('======= SUPABASE KEY VERIFICATION TOOL =======');
  console.log('Project ID:', SUPABASE_URL);
  console.log('URL:', SUPABASE_URL);
  
  // Decode current keys to check their content
  console.log('\n== CURRENT KEYS ANALYSIS ==');
  
  const serviceKeyDecoded = decodeJWT(CURRENT_SERVICE_KEY);
  console.log('Service key decoded:', JSON.stringify(serviceKeyDecoded, null, 2));
  
  const anonKeyDecoded = decodeJWT(CURRENT_ANON_KEY);
  console.log('Anon key decoded:', JSON.stringify(anonKeyDecoded, null, 2));
  
  // Test all alternative configurations
  console.log('\n== TESTING DIFFERENT KEY CONFIGURATIONS ==');
  
  for (const config of ALTERNATIVE_KEYS) {
    // Test with HTTP request
    const httpsResult = await testKeyWithHTTPS(config.url, config.key, config.type);
    
    // If HTTP request was successful, try with client
    if (httpsResult.success) {
      await testKeyWithClient(config.url, config.key, config.type);
    }
    
    console.log(`Result for ${config.type}: ${httpsResult.success ? 'SUCCESS' : 'FAILED'}`);
    console.log('-----------------------------------');
  }
  
  console.log('\n== RECOMMENDED ACTIONS ==');
  console.log('1. Check if your Supabase project is active and the keys have not expired');
  console.log('2. Verify the project ID is correct: ' + SUPABASE_URL);
  console.log('3. Regenerate keys in the Supabase dashboard if needed');
  console.log('4. Make sure keys are formatted correctly with proper roles (anon/service_role)');
  console.log('5. Check if your IP is blocked or if there are network restrictions');
}

main().catch(console.error); 