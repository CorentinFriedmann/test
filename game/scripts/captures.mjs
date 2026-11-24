// Refreshes the VERSIONED screenshots in game/captures/ (on demand only). The test runs write to captures/.tmp (ignored by git).
// Usage: npm run captures
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const env = { ...process.env, ESTRAN_CAPTURE_DIR: 'captures' };
for (const script of ['tests/e2e/run.cjs', 'tests/e2e/render.cjs']) {
  const r = spawnSync(process.execPath, [resolve(root, script)], { cwd: root, env, stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
}
console.log('captures/ updated (versioned screenshots).');
