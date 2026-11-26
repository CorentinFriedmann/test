// T-040: static guard of the rules in docs/tech/NORMES_CODE.md section 5 ("Interdits dans la simulation").
// Reads the source files of src/sim/ (no execution) and fails with file:line for any forbidden API.
// Limits (documented): comments are ignored, but string and template literals are NOT (a forbidden word inside a string is
// reported: rephrase it); a regex literal containing // or a quote may confuse the comment stripper; indirect access
// (globalThis['Math'].random, aliasing) is not detected. This test catches accidents, not deliberate evasion.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SIM_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'src', 'sim');

// Keep in sync with docs/tech/NORMES_CODE.md section 5.
const FORBIDDEN = [
  ['Math.random', /\bMath\s*\.\s*random\b/],
  ['Date.now', /\bDate\s*\.\s*now\b/],
  ['performance.now', /(?<![.\w$])performance\s*\.\s*now\b/],
  ['new Date', /\bnew\s+Date\b/],
  ['setTimeout', /(?<![.\w$])setTimeout\b/],
  ['setInterval', /(?<![.\w$])setInterval\b/],
  ['requestAnimationFrame', /(?<![.\w$])requestAnimationFrame\b/],
  ['document', /(?<![.\w$])document\b/],
  ['window', /(?<![.\w$])window\b/],
  ['navigator', /(?<![.\w$])navigator\b/],
  ['import of three', /(?:\bfrom\s*|\bimport\s*\(?\s*|\brequire\s*\(\s*)['"]three(?:\/[^'"]*)?['"]/],
];

/** Replaces comments by spaces (newlines kept so that line numbers stay exact). Strings are skipped, not blanked. */
function stripComments(src) {
  let out = '', i = 0, quote = null;
  while (i < src.length) {
    const c = src[i], n = src[i + 1];
    if (quote) {
      out += c;
      if (c === '\\') { out += n ?? ''; i += 2; continue; }
      if (c === quote) quote = null;
      i++;
    } else if (c === '/' && n === '/') {
      while (i < src.length && src[i] !== '\n') { out += ' '; i++; }
    } else if (c === '/' && n === '*') {
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) { out += src[i] === '\n' ? '\n' : ' '; i++; }
      out += '  '; i += 2;
    } else {
      if (c === '"' || c === "'" || c === '`') quote = c;
      out += c; i++;
    }
  }
  return out;
}

/** Violations of one source text: [{ line, rule, text }]. */
function findViolations(src) {
  const lines = stripComments(src).split('\n'), found = [];
  lines.forEach((text, k) => { for (const [rule, re] of FORBIDDEN) if (re.test(text)) found.push({ line: k + 1, rule, text: text.trim() }); });
  return found;
}

test('the checker itself: detects each forbidden API, ignores comments and property names', () => {
  for (const [rule, sample] of [
    ['Math.random', 'const x = Math.random();'], ['Date.now', 'const t = Date.now();'], ['performance.now', 'performance.now()'],
    ['new Date', 'new Date()'], ['setTimeout', 'setTimeout(f, 1)'], ['setInterval', 'setInterval(f, 1)'],
    ['requestAnimationFrame', 'requestAnimationFrame(f)'], ['document', 'document.body'], ['window', 'window.innerWidth'],
    ['navigator', 'navigator.userAgent'], ['import of three', "import * as THREE from 'three';"], ['import of three', "import { Vector3 } from 'three/src/x.js'"],
  ]) assert.ok(findViolations(sample).some((v) => v.rule === rule), `${rule} must be detected in: ${sample}`);
  for (const ok of ['// Math.random() is forbidden', '/* Date.now */ const a = 1;', 'const b = state.window; // document', 'x.setTimeout = 1', "import { a } from './three-utils.js'", 'const threeX = 3;', 'a /* multi\nline Math.random */ + 1'])
    assert.deepEqual(findViolations(ok), [], `must be ignored: ${ok}`);
  assert.equal(findViolations('a\n/* x\ny */\nMath.random()')[0].line, 4, 'line numbers survive block comments');
});

test('src/sim/ is not empty (the guard would otherwise pass for nothing)', () => {
  assert.ok(fs.readdirSync(SIM_DIR).filter((f) => f.endsWith('.js')).length >= 5);
});

test('src/sim/ uses no forbidden API (NORMES_CODE.md section 5): no clock, no randomness outside rng.js, no DOM, no three', () => {
  const problems = [];
  for (const f of fs.readdirSync(SIM_DIR).filter((x) => x.endsWith('.js')).sort()) {
    const file = path.join('src', 'sim', f);
    for (const v of findViolations(fs.readFileSync(path.join(SIM_DIR, f), 'utf8'))) problems.push(`${file}:${v.line}: forbidden "${v.rule}" -> ${v.text}`);
  }
  assert.deepEqual(problems, [], `\n${problems.join('\n')}\nsrc/sim/ must stay deterministic and browser-free (docs/tech/NORMES_CODE.md section 5).`);
});
