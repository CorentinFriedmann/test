// Generates the embedded data, bundles src/main.js with three.js and inlines it in a single HTML file.
import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
execFileSync(process.execPath, [resolve(root, 'scripts/gen-data.mjs')], { stdio: 'inherit' });
const result = await build({
  entryPoints: [resolve(root, 'src/main.js')],
  bundle: true,
  minify: true,
  format: 'iife',
  target: 'es2022',
  legalComments: 'none',
  write: false,
});
const js = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const tpl = readFileSync(resolve(root, 'src/index.template.html'), 'utf8');
const html = tpl.replace('<!--APP-->', () => `<script>${js}</script>`);
mkdirSync(resolve(root, 'dist'), { recursive: true });
const out = resolve(root, 'dist/estran.html');
writeFileSync(out, html);
console.log(`built ${out} (${(html.length / 1024).toFixed(0)} KiB)`);
