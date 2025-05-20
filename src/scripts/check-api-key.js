const https = require('https');

// Hard-coded Supabase credentials
const supabaseUrl = 'https://dzhscmihztgwtmiqidjy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6aHNjbWloenRnd3RtaXFpZGp5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNDU4MDI3OCwiZXhwIjoyMDMwMTU2Mjc4fQ.VdhQWGCLGlkIVSWcT1qGm8UEJdLovYbH0c7I3bautGU';

console.log('Testing API key validity...');
console.log(`Supabase URL: ${supabaseUrl}`);
console.log(`API Key Length: ${supabaseKey.length} characters`);
console.log(`API Key: ${supabaseKey.substring(0, 10)}...${supabaseKey.substring(supabaseKey.length - 10)}`);

// Check if the key is a valid JWT format
const parts = supabaseKey.split('.');
if (parts.length !== 3) {
  console.error('Error: API key is not in a valid JWT format (should have 3 parts separated by dots)');
  process.exit(1);
}

// Make a simple request to the Supabase API
const options = {
  hostname: supabaseUrl.replace('https://', ''),
  // Using a simple endpoint that should work with service_role key
  path: '/rest/v1/',
  method: 'GET',
  headers: {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`
  }
};

console.log('\nSending request to Supabase API...');
console.log(`Full request URL: ${supabaseUrl}${options.path}`);
console.log('Headers:');
console.log(` - apikey: ${options.headers.apikey.substring(0, 10)}...`);
console.log(` - Authorization: Bearer ${options.headers.Authorization.substring(7, 17)}...`);

const req = https.request(options, (res) => {
  console.log(`\nResponse Status Code: ${res.statusCode}`);
  console.log('Response Headers:', JSON.stringify(res.headers, null, 2));
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\nResponse Body:');
    try {
      const parsedData = JSON.parse(data);
      console.log(JSON.stringify(parsedData, null, 2));
    } catch (e) {
      console.log(data);
    }
    
    if (res.statusCode === 200) {
      console.log('\n✅ SUCCESS: API key is valid!');
    } else if (res.statusCode === 401) {
      console.error('\n❌ ERROR: API key is invalid or unauthorized.');
    } else {
      console.error(`\n⚠️ WARNING: Unexpected status code ${res.statusCode}`);
    }
  });
});

req.on('error', (e) => {
  console.error(`\n❌ Network error: ${e.message}`);
});

req.end(); 