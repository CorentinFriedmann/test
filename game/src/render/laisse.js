// La Laisse, visual only: a hooded dark form with trailing strands, plus a disturbance of the water around her.
// Visibility rule (GDD 9 case 1): shown only while the simulation says she is lit (threat.lit > 0), or always with ?debug=1.
// Nothing here is read back by the simulation.
import { LatheGeometry, CylinderGeometry, Vector2, Mesh, Group, PlaneGeometry, MathUtils, Float32BufferAttribute } from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { hash2 } from '../sim/rng.js';
import { createLaisseMaterial, createDisturbanceMaterial } from './shaders.js';
import { LOOK } from './quality.js';

const PROFILE = [[0.0, -0.8], [0.55, -0.6], [0.66, 0.0], [0.52, 0.9], [0.38, 1.7], [0.3, 2.3], [0.36, 2.7], [0.22, 3.1], [0.0, 3.4]];

export function buildLaisseGeometry(radial, tendrils) {
  const parts = [];
  const body = new LatheGeometry(PROFILE.map(([r, y]) => new Vector2(r, y)), radial);
  const bp = body.attributes.position, sway = new Float32Array(bp.count);
  for (let i = 0; i < bp.count; i++) sway[i] = MathUtils.clamp((bp.getY(i) + 0.8) / 4.2, 0, 1) * 0.5;
  body.setAttribute('aSway', new Float32BufferAttribute(sway, 1));
  parts.push(body);
  for (let k = 0; k < tendrils; k++) {
    const a = (k / tendrils) * Math.PI * 2 + hash2(k, 1, 77) * 0.6, len = 1.5 + hash2(k, 2, 77) * 1.1, y0 = 0.2 + hash2(k, 3, 77) * 1.4;
    const t = new CylinderGeometry(0.015, 0.1, len, 5, 5, true);
    t.translate(0, -len / 2, 0);                       // hangs down from its attachment point
    const p = t.attributes.position, s = new Float32Array(p.count);
    for (let i = 0; i < p.count; i++) { const u = MathUtils.clamp(-p.getY(i) / len, 0, 1); s[i] = 0.5 + u * 2.2; p.setX(i, p.getX(i) + u * u * 0.35); }
    t.setAttribute('aSway', new Float32BufferAttribute(s, 1));
    t.rotateZ(0.25 + hash2(k, 4, 77) * 0.4);          // trails outward
    t.rotateY(a);
    t.translate(Math.cos(a) * 0.45, y0 + 1.1, Math.sin(a) * 0.45);
    parts.push(t);
  }
  const merged = mergeGeometries(parts, false);
  parts.forEach((g) => g.dispose());
  return merged;
}

/** Creates the group (body + water disturbance). `q` is a QUALITY entry. */
export function createLaisse(q) {
  const group = new Group(); group.visible = false;
  const mat = createLaisseMaterial();
  const body = new Mesh(buildLaisseGeometry(q.laisseRadial, q.laisseTendrils), mat);
  body.renderOrder = 2; body.frustumCulled = false; group.add(body);
  const dmat = createDisturbanceMaterial();
  const disc = new Mesh(new PlaneGeometry(7, 7).rotateX(-Math.PI / 2), dmat);
  disc.renderOrder = 2; disc.position.y = LOOK.laisseBaseDrop + 0.04; group.add(disc);
  const shown = { x: 0, z: 0, init: false, a: 0 };
  setNoise(q);
  function setNoise(nq) { mat.defines.RAGGED = nq.laisseNoise ? 1 : 0; mat.needsUpdate = true; }
  return {
    group,
    setQuality(nq) {
      body.geometry.dispose(); body.geometry = buildLaisseGeometry(nq.laisseRadial, nq.laisseTendrils); setNoise(nq);
    },
    /** th: simulation threat state (read only); level: water level; camera: for the lean; dt: real seconds. */
    update(th, level, camPos, time, dt, showAlways) {
      if (!th || !th.active) { group.visible = false; shown.init = false; shown.a = 0; return false; }
      if (!shown.init) { shown.x = th.x; shown.z = th.z; shown.init = true; }
      shown.x += (th.x - shown.x) * 0.5; shown.z += (th.z - shown.z) * 0.5;      // display smoothing only
      group.position.set(shown.x, level - LOOK.laisseBaseDrop, shown.z);
      group.rotation.y = Math.atan2(camPos.x - shown.x, camPos.z - shown.z);
      const lit = th.lit > 0;
      // Appears fast, goes out with the simulation's own 0.5 s window: never visible while the simulation says she is not lit.
      const target = lit ? Math.min(1, th.lit / LOOK.laisseLitFadeOut) : (showAlways ? 0.55 : 0);
      shown.a = target >= shown.a ? Math.min(target, shown.a + dt * LOOK.laisseLitFadeIn) : target;
      const vis = lit || showAlways;
      group.visible = vis && shown.a > 0.01 && !group.userData.hidden;
      mat.uniforms.uAlpha.value = shown.a; mat.uniforms.uTime.value = time; mat.uniforms.uDebug.value = !lit && showAlways ? 1 : 0;
      dmat.uniforms.uAlpha.value = shown.a; dmat.uniforms.uTime.value = time;
      return group.visible;
    },
    mats: [mat, dmat],
    /** Test hook: forces the group hidden (legibility probe). */
    forceHide(b) { group.userData.hidden = b; },
  };
}
