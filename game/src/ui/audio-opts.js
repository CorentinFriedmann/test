// Audio options of the pause/intro overlay (volume, mute, noise subtitles), the permanent sound indicator and the failure banner
// (T-043 C2), all bound to the audio system.

export const BANNER_TEXT = {
  context: 'Le son ne démarre pas. Cliquez dans la fenêtre, vérifiez le volume de l\'ordinateur et que l\'onglet n\'est pas muet.',
  unsupported: 'Ce navigateur ne peut pas jouer le son du jeu. Essayez Chrome ou Edge.',
};

/**
 * What the permanent indicator says. s: { volume, muted, status: { started, state, failure, intentional } } (see audio/index.js).
 *   SON INDISPONIBLE : the context failed or does not exist.
 *   SON COUPÉ        : muted (key M or the box) or volume 0.
 *   SON ACTIF        : the context runs (or the pause has suspended it on purpose: the player did not mute anything).
 *   SON EN ATTENTE   : nothing started yet (before the click) or the context is still starting.
 */
export function soundIndicator(s) {
  const st = s.status || { started: false, state: 'none', failure: null, intentional: false };
  if (st.failure) return { key: 'unavailable', text: 'SON INDISPONIBLE' };
  if (s.muted || s.volume <= 0) return { key: 'muted', text: 'SON COUPÉ' };
  if (st.started && (st.state === 'running' || st.intentional)) return { key: 'active', text: 'SON ACTIF' };
  return { key: 'pending', text: 'SON EN ATTENTE' };
}

/** Returns sync(settings): updates the form fields, the indicator and the banner. */
export function bindAudioOptions(root, audio, captions, ui = {}) {
  const vol = root.querySelector('#opt-vol'), mute = root.querySelector('#opt-mute'), cap = root.querySelector('#opt-cap');
  root.addEventListener('click', (e) => e.stopPropagation()); // clicking an option must not start the game
  const sync = (s) => {
    vol.value = String(Math.round(s.volume * 100)); mute.checked = s.muted; cap.checked = s.captions; if (!s.captions) captions.clear();
    const ind = soundIndicator(s);
    if (ui.indicator) { ui.indicator.textContent = ind.text; ui.indicator.dataset.state = ind.key; }
    if (ui.banner) {
      const f = s.status && s.status.failure;
      ui.banner.textContent = f ? BANNER_TEXT[f] : '';
      ui.banner.classList.toggle('on', !!f);
    }
  };
  vol.addEventListener('input', () => audio.setVolume(Number(vol.value) / 100));
  mute.addEventListener('change', () => audio.setMuted(mute.checked));
  cap.addEventListener('change', () => audio.setCaptions(cap.checked));
  return sync;
}
