// Player audio settings: volume, mute, subtitles of the noises. Stored in localStorage when it is available (never required).
export const DEFAULTS = Object.freeze({ volume: 0.8, muted: false, captions: false });
const KEY = 'estran.audio.v1';

export function sanitize(o) {
  const s = { ...DEFAULTS };
  if (o && typeof o === 'object') {
    if (Number.isFinite(o.volume)) s.volume = Math.min(1, Math.max(0, o.volume));
    if (typeof o.muted === 'boolean') s.muted = o.muted;
    if (typeof o.captions === 'boolean') s.captions = o.captions;
  }
  return s;
}
export function loadSettings(storage) {
  try { return sanitize(JSON.parse(storage.getItem(KEY))); } catch { return { ...DEFAULTS }; }
}
export function saveSettings(storage, s) {
  try { storage.setItem(KEY, JSON.stringify(sanitize(s))); } catch { /* private mode, quota... the settings just do not persist */ }
}
