// Generates the embedded data, bundles src/main.js with three.js and inlines it in a single HTML file: dist/estran-p2.html.
// Licences (T-033, docs/legal/LICENCES.md section 5): the MIT notices of the bundled code stay in the file
// (esbuild legalComments 'inline'), the full MIT text of three.js is inserted in the page, and the game shows it in
// its "Crédits et licences" screen.
import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
execFileSync(process.execPath, [resolve(root, 'scripts/gen-data.mjs')], { stdio: 'inherit' });
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
const buildId = `${pkg.version} ${new Date().toISOString().slice(0, 10)}`;
const threeLicense = readFileSync(resolve(root, 'node_modules/three/LICENSE'), 'utf8').trim();
if (!/three\.js authors/.test(threeLicense) || !/Permission is hereby granted/.test(threeLicense)) {
  throw new Error('node_modules/three/LICENSE does not contain the expected MIT text');
}
const result = await build({
  entryPoints: [resolve(root, 'src/main.js')],
  bundle: true,
  minify: true,
  format: 'iife',
  target: 'es2022',
  legalComments: 'inline',
  define: { __ESTRAN_BUILD__: JSON.stringify(buildId) },
  write: false,
});
const js = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const tpl = readFileSync(resolve(root, 'src/index.template.html'), 'utf8');
const licenceBlock = threeLicense.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--');
const html = tpl
  .replace('<!--LICENCE_THREE-->', () => `\nthree.js (MIT)\n\n${licenceBlock}\n`)
  .replace('<!--APP-->', () => `<script>${js}</script>`);
mkdirSync(resolve(root, 'dist'), { recursive: true });
const out = resolve(root, 'dist/estran-p2.html');
writeFileSync(out, html);
console.log(`built ${out} (${(Buffer.byteLength(html) / 1024).toFixed(0)} KiB, build ${buildId})`);
