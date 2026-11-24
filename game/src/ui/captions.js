// Subtitles of the noises (text lines that fade after 3 s) and a short toast for settings feedback. DOM only.
export function createCaptions(root, toastEl) {
  const LIFE_MS = 3000, MAX = 3;
  let toastTimer = null;
  const lines = new Map(); // key -> { el, timer }
  return {
    show({ key, text }) {
      let l = lines.get(key);
      if (!l) {
        if (lines.size >= MAX) { const first = lines.keys().next().value; this.drop(first); }
        const el = document.createElement('div'); el.className = 'cap'; root.appendChild(el); l = { el, timer: 0 }; lines.set(key, l);
      }
      l.el.textContent = text;
      clearTimeout(l.timer); l.timer = setTimeout(() => this.drop(key), LIFE_MS);
    },
    drop(key) { const l = lines.get(key); if (!l) return; clearTimeout(l.timer); l.el.remove(); lines.delete(key); },
    clear() { for (const k of [...lines.keys()]) this.drop(k); },
    toast(text) {
      if (!toastEl) return;
      toastEl.textContent = text; toastEl.classList.add('on');
      clearTimeout(toastTimer); toastTimer = setTimeout(() => toastEl.classList.remove('on'), 1600);
    },
  };
}
