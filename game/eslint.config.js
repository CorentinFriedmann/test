// ESLint 10, "flat" config. Minimal on purpose (T-040, docs/tech/NORMES_CODE.md section 2): only rules that catch real
// errors. No style rule (Prettier is not used, decision T-034). No plugin and no `globals` package: the few globals are listed here.
import fs from 'node:fs';
import path from 'node:path';

const es = {}; // ES built-ins come from languageOptions.ecmaVersion
const browser = Object.fromEntries([
  'window', 'document', 'navigator', 'location', 'localStorage', 'sessionStorage', 'console', 'performance', 'requestAnimationFrame',
  'cancelAnimationFrame', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'queueMicrotask', 'fetch', 'URL', 'Blob', 'Image',
  'URLSearchParams', 'addEventListener', 'removeEventListener', 'DOMException', 'HTMLElement', 'HTMLCanvasElement', 'AudioContext', 'OfflineAudioContext', 'BaseAudioContext', 'AudioBuffer', 'AudioNode', 'AudioParam',
  'Event', 'KeyboardEvent', 'MouseEvent', 'PointerEvent', 'ResizeObserver', 'MutationObserver', 'getComputedStyle', 'devicePixelRatio',
  'innerWidth', 'innerHeight', 'TextEncoder', 'TextDecoder', 'structuredClone', 'atob', 'btoa', 'WebGL2RenderingContext', 'WebGLRenderingContext',
].map((k) => [k, 'readonly']));
const node = Object.fromEntries([
  'process', 'console', 'Buffer', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'setImmediate', 'queueMicrotask', 'URL',
  'TextEncoder', 'TextDecoder', 'structuredClone', 'performance', 'fetch', 'AbortController',
].map((k) => [k, 'readonly']));
const buildDefines = { __ESTRAN_BUILD__: 'readonly' }; // injected by esbuild (scripts/build.mjs)
const cjs = Object.fromEntries(['require', 'module', 'exports', '__dirname', '__filename'].map((k) => [k, 'readonly']));

/** Local rule: a relative import must point to an existing file, and each named import must be exported by it. */
const exportedNames = (text) => {
  const names = new Set();
  for (const m of text.matchAll(/^export\s+(?:async\s+)?(?:const|let|var|function\*?|class)\s+([A-Za-z_$][\w$]*)/gm)) names.add(m[1]);
  for (const m of text.matchAll(/^export\s*\{([^}]*)\}/gm)) for (const part of m[1].split(',')) { const n = part.trim().split(/\s+as\s+/).pop(); if (n) names.add(n); }
  return { names, star: /^export\s*\*/m.test(text) };
};
const importsResolve = {
  meta: { type: 'problem', schema: [], messages: { missing: 'Import "{{src}}" does not resolve to a file.', name: '"{{name}}" is not exported by "{{src}}".' } },
  create(context) {
    return {
      ImportDeclaration(node) {
        const src = node.source.value;
        if (typeof src !== 'string' || !src.startsWith('.')) return;
        const target = path.resolve(path.dirname(context.filename), src);
        if (!fs.existsSync(target) || !fs.statSync(target).isFile()) { context.report({ node: node.source, messageId: 'missing', data: { src } }); return; }
        if (!/\.m?js$/.test(target)) return;
        const { names, star } = exportedNames(fs.readFileSync(target, 'utf8'));
        if (star) return;
        for (const s of node.specifiers) {
          if (s.type === 'ImportSpecifier' && !names.has(s.imported.name ?? s.imported.value)) context.report({ node: s, messageId: 'name', data: { name: s.imported.name ?? s.imported.value, src } });
        }
      },
    };
  },
};

const rules = {
  'no-undef': 'error', 'no-unreachable': 'error', 'no-dupe-keys': 'error', 'no-dupe-args': 'error', 'no-dupe-else-if': 'error',
  'no-duplicate-case': 'error', 'no-dupe-class-members': 'error', 'no-const-assign': 'error', 'no-redeclare': 'error',
  'no-self-assign': 'error', 'no-unsafe-negation': 'error', 'no-unsafe-finally': 'error', 'no-unused-private-class-members': 'error',
  'no-func-assign': 'error', 'no-import-assign': 'error', 'no-invalid-regexp': 'error', 'no-sparse-arrays': 'error',
  'no-cond-assign': 'error', 'no-constant-condition': ['error', { checkLoops: false }], 'no-empty-pattern': 'error', 'no-loss-of-precision': 'error',
  'use-isnan': 'error', 'valid-typeof': 'error', 'getter-return': 'error', 'no-setter-return': 'error', 'no-this-before-super': 'error',
  'constructor-super': 'error', 'no-compare-neg-zero': 'error', 'no-unsafe-optional-chaining': 'error', 'no-prototype-builtins': 'error',
  'no-useless-backreference': 'error', 'no-misleading-character-class': 'error', 'no-shadow-restricted-names': 'error',
  'local/imports-resolve': 'error',
};
const base = { plugins: { local: { rules: { 'imports-resolve': importsResolve } } }, rules, linterOptions: { reportUnusedDisableDirectives: 'error' } };

export default [
  { ignores: ['node_modules/**', 'dist/**', 'captures/**', 'src/data/generated.js'] },
  // Game code: ES modules, browser globals. src/sim and src/data are pure: no browser, no Node global (the purity test checks the sim too).
  { ...base, files: ['src/**/*.js'], ignores: ['src/sim/**', 'src/data/**'], languageOptions: { ecmaVersion: 'latest', sourceType: 'module', globals: { ...es, ...browser, ...buildDefines } } },
  { ...base, files: ['src/sim/**/*.js', 'src/data/**/*.js'], languageOptions: { ecmaVersion: 'latest', sourceType: 'module', globals: es } },
  // Tooling and unit tests: ES modules under Node.
  { ...base, files: ['scripts/**/*.mjs', 'tests/unit/**/*.js', 'tests/p2/**/*.{js,mjs}', 'eslint.config.js'], languageOptions: { ecmaVersion: 'latest', sourceType: 'module', globals: { ...es, ...node } } },
  // Browser scenarios (Playwright): CommonJS, Node plus the page's globals inside page.evaluate().
  { ...base, files: ['**/*.cjs'], languageOptions: { ecmaVersion: 'latest', sourceType: 'commonjs', globals: { ...es, ...node, ...cjs, ...browser } } },
];
