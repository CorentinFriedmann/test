'use strict';
// Rendu Markdown minimal et sûr (tout le HTML est échappé) pour les documents du studio.
(function () {
  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ESC[c]);

  function inline(s) {
    const codes = [];
    let out = esc(s).replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000`; });
    out = out
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, '$1<em>$2</em>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<span class="lien-local" title="$2">$1</span>');
    return out.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${codes[Number(i)]}</code>`);
  }

  const cellules = (l) => l.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map((c) => c.trim());
  const estItem = (l) => /^\s*([-*+]|\d+\.)\s+/.test(l);

  function liste(lignes) {
    let html = '';
    const pile = [];
    for (const l of lignes) {
      const m = /^(\s*)([-*+]|\d+\.)\s+(.*)$/.exec(l);
      if (!m) { html += ' ' + inline(l.trim()); continue; }
      const ind = m[1].length;
      while (pile.length && ind < pile[pile.length - 1].ind) html += `</li></${pile.pop().tag}>`;
      if (!pile.length || ind > pile[pile.length - 1].ind) {
        const tag = /\d/.test(m[2]) ? 'ol' : 'ul';
        pile.push({ ind, tag });
        html += `<${tag}>`;
      } else {
        html += '</li>';
      }
      const cb = /^\[( |x|X)\]\s+(.*)$/.exec(m[3]);
      html += cb
        ? `<li class="case"><span class="coche ${cb[1] === ' ' ? '' : 'faite'}">${cb[1] === ' ' ? '☐' : '☑'}</span> ${inline(cb[2])}`
        : `<li>${inline(m[3])}`;
    }
    while (pile.length) html += `</li></${pile.pop().tag}>`;
    return html;
  }

  function renderMarkdown(md) {
    const lignes = String(md || '').replace(/\r/g, '').split('\n');
    const out = [];
    let i = 0;
    while (i < lignes.length) {
      const l = lignes[i];
      let m;
      if (/^\s*```/.test(l)) {
        const buf = [];
        i++;
        while (i < lignes.length && !/^\s*```/.test(lignes[i])) buf.push(lignes[i++]);
        i++;
        out.push(`<pre><code>${esc(buf.join('\n'))}</code></pre>`);
      } else if (!l.trim()) {
        i++;
      } else if ((m = /^(#{1,6})\s+(.*)$/.exec(l))) {
        out.push(`<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`);
        i++;
      } else if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(l)) {
        out.push('<hr>');
        i++;
      } else if (/^\s*\|/.test(l) && i + 1 < lignes.length && /^\s*\|?\s*:?-{2,}/.test(lignes[i + 1])) {
        const tete = cellules(l);
        i += 2;
        const corps = [];
        while (i < lignes.length && /^\s*\|/.test(lignes[i])) corps.push(cellules(lignes[i++]));
        out.push(`<div class="table-defil"><table><thead><tr>${tete.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${corps.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      } else if (/^\s*>/.test(l)) {
        const buf = [];
        while (i < lignes.length && /^\s*>/.test(lignes[i])) buf.push(lignes[i++].replace(/^\s*>\s?/, ''));
        out.push(`<blockquote>${renderMarkdown(buf.join('\n'))}</blockquote>`);
      } else if (estItem(l)) {
        const buf = [];
        while (i < lignes.length && (estItem(lignes[i]) || (/^\s{2,}\S/.test(lignes[i]) && buf.length))) buf.push(lignes[i++]);
        out.push(liste(buf));
      } else {
        const buf = [];
        while (i < lignes.length && lignes[i].trim() && !/^(#{1,6}\s|\s*```|\s*\||\s*>)/.test(lignes[i]) && !estItem(lignes[i])) buf.push(lignes[i++]);
        out.push(`<p>${inline(buf.join(' '))}</p>`);
      }
    }
    return out.join('\n');
  }

  window.renderMarkdown = renderMarkdown;
  window.echapper = esc;
})();
