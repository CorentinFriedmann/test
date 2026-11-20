'use strict';

// Lecture / écriture minimaliste du frontmatter YAML des agents (clé: valeur sur une ligne).

function unquote(v) {
  if (v.length >= 2 && v.startsWith('"') && v.endsWith('"')) {
    return v.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }
  if (v.length >= 2 && v.startsWith("'") && v.endsWith("'")) {
    return v.slice(1, -1).replace(/''/g, "'");
  }
  return v;
}

function parseFrontmatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)([\s\S]*)$/.exec(text);
  if (!m) return { data: {}, body: text };
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (kv) data[kv[1]] = unquote(kv[2].trim());
  }
  return { data, body: m[2].replace(/^(\r?\n)+/, '') };
}

function formatValue(v) {
  const s = String(v).replace(/\s*\r?\n\s*/g, ' ').trim();
  // Guillemets si la valeur pourrait être mal interprétée par un parseur YAML strict.
  if (/: |#|^[\s\-?:,\[\]{}&*!|>'"%@`]/.test(s)) {
    return `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  }
  return s;
}

function serializeFrontmatter(data, body) {
  const lines = ['---'];
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === null || String(v).trim() === '') continue;
    lines.push(`${k}: ${formatValue(v)}`);
  }
  lines.push('---', '');
  return lines.join('\n') + String(body).replace(/^\s*\n/, '').replace(/\s*$/, '\n');
}

module.exports = { parseFrontmatter, serializeFrontmatter };
