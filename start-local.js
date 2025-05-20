// Start script that runs the app with local authentication
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Next.js app with LOCAL authentication...');
console.log('This will bypass Supabase authentication and use local user database.');

// Create the env variable
process.env.USE_LOCAL_AUTH = 'true';

// On Windows, we need to use the full path to npm or npx
const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

// Run the app
const nextProcess = spawn(npmCmd, ['run', 'dev'], {
  stdio: 'inherit',
  env: { 
    ...process.env,
    USE_LOCAL_AUTH: 'true'
  }
});

nextProcess.on('error', (err) => {
  console.error('Failed to start Next.js:', err);
});

console.log('\nAvailable users:');
console.log('- admin@carbonecompany.com / admin123 (Admin)');
console.log('- gerente@carbonecompany.com / gerente123 (Manager)');
console.log('- usuario@carbonecompany.com / usuario123 (User)');

console.log('\nPress Ctrl+C to stop the server'); 