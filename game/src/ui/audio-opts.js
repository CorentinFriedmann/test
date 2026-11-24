// Audio options of the pause/intro overlay (volume, mute, noise subtitles), bound to the audio system.
export function bindAudioOptions(root, audio, captions) {
  const vol = root.querySelector('#opt-vol'), mute = root.querySelector('#opt-mute'), cap = root.querySelector('#opt-cap');
  root.addEventListener('click', (e) => e.stopPropagation()); // clicking an option must not start the game
  const sync = (s) => { vol.value = String(Math.round(s.volume * 100)); mute.checked = s.muted; cap.checked = s.captions; if (!s.captions) captions.clear(); };
  vol.addEventListener('input', () => audio.setVolume(Number(vol.value) / 100));
  mute.addEventListener('change', () => audio.setMuted(mute.checked));
  cap.addEventListener('change', () => audio.setCaptions(cap.checked));
  return sync;
}
