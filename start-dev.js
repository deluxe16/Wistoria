import { spawn } from 'child_process';
import path from 'path';

console.log('\x1b[36m%s\x1b[0m', '==================================================');
console.log('\x1b[36m%s\x1b[0m', '   STARTING WISTORIA FULL STACK APPLICATION');
console.log('\x1b[36m%s\x1b[0m', '==================================================');

// Start backend
const serverProcess = spawn('node', ['server/server.js'], {
  stdio: 'inherit',
  shell: true
});

// Start frontend
const clientProcess = spawn('npm', ['--prefix', 'client', 'run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

process.on('SIGINT', () => {
  serverProcess.kill();
  clientProcess.kill();
  process.exit();
});
