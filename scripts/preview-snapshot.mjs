// Explicit local review mode. Does not change or write to MongoDB.
import { spawn } from 'node:child_process';
import path from 'node:path';
const child = spawn(process.execPath, [path.resolve('node_modules/next/dist/bin/next'), 'start', '--hostname', '127.0.0.1', '--port', process.env.PORT || '3000'], {
  env: { ...process.env, HOMEBELE_CATALOG_MODE: 'snapshot' },
  stdio: 'inherit', windowsHide: true,
});
process.on('SIGINT', () => child.kill());
process.on('SIGTERM', () => child.kill());
child.on('exit', code => process.exit(code ?? 0));
