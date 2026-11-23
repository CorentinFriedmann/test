// Keyboard and mouse -> per-tick input. The camera yaw/pitch are live (no 30 Hz latency); the tick reads the current yaw.
import { NEUTRAL_INPUT } from '../sim/sim.js';

export function createInput(target, onRestart) {
  const keys = new Set();
  let yaw = 0, pitch = -0.05, lampPressed = false, locked = false;
  addEventListener('keydown', (e) => {
    if (e.repeat) return;
    keys.add(e.code);
    if (e.code === 'KeyF') lampPressed = true;
    if (e.code === 'KeyR') onRestart();
  });
  addEventListener('keyup', (e) => keys.delete(e.code));
  addEventListener('blur', () => keys.clear());
  document.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement !== target) return;
    yaw -= e.movementX * 0.0022;
    pitch = Math.max(-1.4, Math.min(1.4, pitch - e.movementY * 0.0022));
  });
  document.addEventListener('pointerlockchange', () => { locked = document.pointerLockElement === target; });
  const down = (...c) => c.some((k) => keys.has(k));
  return {
    get yaw() { return yaw; }, set yaw(v) { yaw = v; },
    get pitch() { return pitch; }, set pitch(v) { pitch = v; },
    get locked() { return locked; },
    clear() { keys.clear(); lampPressed = false; },
    /** Input for the next simulation tick. */
    tick() {
      const f = (down('KeyW', 'KeyZ', 'ArrowUp') ? 1 : 0) - (down('KeyS', 'ArrowDown') ? 1 : 0);
      const r = (down('KeyD', 'ArrowRight') ? 1 : 0) - (down('KeyA', 'KeyQ', 'ArrowLeft') ? 1 : 0);
      const i = { ...NEUTRAL_INPUT, moveF: f, moveR: r, yaw, run: down('ShiftLeft', 'ShiftRight'), slow: down('KeyC'),
        interact: down('KeyE'), lampToggle: lampPressed };
      lampPressed = false;
      return i;
    },
  };
}
