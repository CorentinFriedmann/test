// Subtitles of the noises (accessibility, off by default): a short French text per cue, with the direction of the source.
import { sectorLabel } from './spatial.js';

/** Returns { key, text } or null when the cue needs no subtitle (own footsteps, heartbeat, UI-like ticks). */
export function captionFor(cue, listener, cfg) {
  const dir = () => sectorLabel(listener, cue);
  const far = () => (cue.dist > 0.65 * cfg.audibleR ? ', au loin' : '');
  switch (cue.kind) {
    case 'swirl': return { key: 'swirl', text: `bruit dans l'eau, ${dir()}${far()}` };
    case 'roar': return { key: 'roar', text: `grondement, ${dir()}${far()}` };
    case 'growl': return { key: 'roar', text: `grondement proche, ${dir()}` };
    case 'flee_splash': return { key: 'flee', text: `éclaboussure, ${dir()}` };
    case 'debris': return { key: 'debris', text: 'choc de débris' };
    case 'grab': return { key: 'grab', text: 'la Laisse vous saisit' };
    case 'lh_low': return { key: 'lh', text: 'le phare faiblit' };
    case 'lh_out': return { key: 'lh', text: "le phare s'éteint" };
    case 'lh_toll': return { key: 'toll', text: `cloche d'alerte du phare, ${dir()}` };
    case 'lh_wound': return { key: 'lh', text: 'phare remonté' };
    case 'station': return { key: 'station', text: 'relevé noté' };
    default: return null;
  }
}
