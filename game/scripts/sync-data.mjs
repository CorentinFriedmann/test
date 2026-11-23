// Copies the four design CSV files from docs/design/data/ (source of truth) into game/data/.
// monde.csv is owned by the game (terrain generation and world rules missing from the GDD tables).
import { copyFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const docs = resolve(root, '..', 'docs', 'design', 'data');
if (!existsSync(docs)) { console.log('docs/design/data not found: nothing to sync'); process.exit(0); }
for (const n of ['maree', 'maree_effets', 'stations', 'menace']) {
  copyFileSync(resolve(docs, `${n}.csv`), resolve(root, 'data', `${n}.csv`));
  console.log(`synced ${n}.csv`);
}
