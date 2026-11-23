import {
  WebGLRenderer, Scene, PerspectiveCamera, Color, FogExp2, PlaneGeometry, Mesh, MeshStandardMaterial,
  CylinderGeometry, ConeGeometry, SpotLight, DirectionalLight, AmbientLight, HemisphereLight, Group, CanvasTexture,
  RepeatWrapping, Float32BufferAttribute, MeshBasicMaterial, AdditiveBlending, DoubleSide, Vector3, MathUtils, SRGBColorSpace,
} from 'three';

// ---- Tunables -------------------------------------------------------------
const TIDE_PERIOD_S = 90;      // real seconds per full tide cycle (accelerated)
const TIDE_MIN = -0.6;         // low water level (m)
const TIDE_MAX = 2.4;          // high water level (m)
const BEAM_PERIOD_S = 8;       // lighthouse rotation period
const EYE_HEIGHT = 1.7;
const ISLAND_RADIUS = 60;

// ---- Deterministic noise (no Math.random: reproducible tests) ---------------
function hash(x, y) { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); }
function vnoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function heightAt(x, z) {
  const r = Math.hypot(x, z) / ISLAND_RADIUS;
  const base = 3.2 * (1 - r * r) - 0.9;                       // dome: shore around r~0.8
  const n = (vnoise(x * 0.08, z * 0.08) - 0.5) * 2.2 + (vnoise(x * 0.3, z * 0.3) - 0.5) * 0.35;
  return base + n * Math.max(0, 1 - r * 0.6);
}
const tideAt = (t) => TIDE_MIN + (TIDE_MAX - TIDE_MIN) * 0.5 * (1 - Math.cos((2 * Math.PI * t) / TIDE_PERIOD_S));

// ---- Renderer / scene -------------------------------------------------------
const renderer = new WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const NIGHT = new Color(0x101c2a);
const scene = new Scene();
scene.background = NIGHT;
scene.fog = new FogExp2(0x101c2a, 0.018);

const camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 400);
camera.rotation.order = 'YXZ';
scene.add(camera);

const moon = new DirectionalLight(0x6f8fc0, 1.1); moon.position.set(-30, 40, 25); scene.add(moon);
scene.add(new AmbientLight(0x2a3a55, 1.4));
scene.add(new HemisphereLight(0x3a5078, 0x0c1014, 0.9));

// ---- Island (procedural terrain, vertex colours: wet sand to dry sand) -------------
{
  const size = ISLAND_RADIUS * 2.6, seg = 160;
  const g = new PlaneGeometry(size, size, seg, seg);
  g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const h = heightAt(pos.getX(i), pos.getZ(i));
    pos.setY(i, h);
    const dry = MathUtils.clamp((h + 0.2) / 2.5, 0, 1);
    const n = 0.85 + 0.3 * hash(i, 7);
    colors[i * 3] = MathUtils.lerp(0.12, 0.42, dry) * n;
    colors[i * 3 + 1] = MathUtils.lerp(0.13, 0.38, dry) * n;
    colors[i * 3 + 2] = MathUtils.lerp(0.14, 0.30, dry) * n;
  }
  g.setAttribute('color', new Float32BufferAttribute(colors, 3));
  g.computeVertexNormals();
  scene.add(new Mesh(g, new MeshStandardMaterial({ vertexColors: true, roughness: 0.92, metalness: 0 })));
}

// ---- Rocks (instances kept simple: cheap meshes, deterministic) -------------------
{
  const rockMat = new MeshStandardMaterial({ color: 0x2a2d30, roughness: 0.95, flatShading: true });
  const rockGeo = new ConeGeometry(1, 1.4, 6);
  for (let i = 0; i < 40; i++) {
    const a = hash(i, 1) * Math.PI * 2, r = 20 + hash(i, 2) * 38;
    const x = Math.cos(a) * r, z = Math.sin(a) * r;
    const m = new Mesh(rockGeo, rockMat);
    const s = 0.6 + hash(i, 3) * 1.6;
    m.scale.set(s, s * (0.6 + hash(i, 4)), s);
    m.position.set(x, heightAt(x, z) + 0.2, z);
    m.rotation.y = hash(i, 5) * 6;
    scene.add(m);
  }
}

// ---- Lighthouse ---------------------------------------------------------------------
const LH = { x: -8, z: -14 };
const lhBase = heightAt(LH.x, LH.z);
const lighthouse = new Group();
lighthouse.position.set(LH.x, lhBase, LH.z);
scene.add(lighthouse);
{
  const tower = new Mesh(new CylinderGeometry(1.6, 2.4, 20, 20),
    new MeshStandardMaterial({ color: 0x8c8f93, roughness: 0.85 }));
  tower.position.y = 10;
  lighthouse.add(tower);
  const band = new Mesh(new CylinderGeometry(1.95, 2.05, 2.2, 20), new MeshStandardMaterial({ color: 0x6a1d1d, roughness: 0.8 }));
  band.position.y = 9;
  lighthouse.add(band);
  const gallery = new Mesh(new CylinderGeometry(2.3, 2.3, 0.3, 20), new MeshStandardMaterial({ color: 0x1b1d20 }));
  gallery.position.y = 20.15;
  lighthouse.add(gallery);
  const lamp = new Mesh(new CylinderGeometry(0.9, 0.9, 1.6, 16), new MeshBasicMaterial({ color: 0xfff1c8 }));
  lamp.position.y = 21.1;
  lighthouse.add(lamp);
  const roof = new Mesh(new ConeGeometry(1.5, 1.4, 16), new MeshStandardMaterial({ color: 0x1b1d20 }));
  roof.position.y = 22.6;
  lighthouse.add(roof);
}
// Rotating beam: a pivot at the lamp holds a real SpotLight and a visible volumetric-looking cone.
const beamPivot = new Group();
beamPivot.position.y = 21.1;
lighthouse.add(beamPivot);
const beamLight = new SpotLight(0xfff0cc, 9000, 140, MathUtils.degToRad(9), 0.5, 1.6);
beamLight.position.set(0, 0, 0);
beamLight.target.position.set(0, -1.5, 40);      // slightly down, towards +Z of the pivot
beamPivot.add(beamLight, beamLight.target);
{
  const L = 70, R = 5;
  const cone = new Mesh(
    new ConeGeometry(R, L, 24, 1, true),
    new MeshBasicMaterial({ color: 0xffe9b0, transparent: true, opacity: 0.16, blending: AdditiveBlending, depthWrite: false, side: DoubleSide, fog: true }),
  );
  cone.geometry.translate(0, -L / 2, 0);       // apex at origin, opening along -Y
  cone.rotation.x = -Math.PI / 2 - 0.04;        // -Y axis -> +Z (slight droop)
  beamPivot.add(cone);
}

// ---- Water (level driven by the tide clock) --------------------------------------------
function makeWaterTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const ctx = c.getContext('2d'); const img = ctx.createImageData(256, 256);
  for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
    // tileable: sum of sines with integer periods
    const v = Math.sin(x / 256 * Math.PI * 2 * 4 + Math.sin(y / 256 * Math.PI * 2 * 3) * 1.5) * 0.5
            + Math.sin(y / 256 * Math.PI * 2 * 6 + x / 256 * Math.PI * 2 * 2) * 0.35
            + Math.sin((x + y) / 256 * Math.PI * 2 * 9) * 0.15;
    const k = (y * 256 + x) * 4; const b = Math.floor(128 + 127 * v);
    img.data[k] = img.data[k + 1] = img.data[k + 2] = b; img.data[k + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const t = new CanvasTexture(c); t.wrapS = t.wrapT = RepeatWrapping; t.repeat.set(40, 40); t.colorSpace = SRGBColorSpace;
  return t;
}
const waterTex = makeWaterTexture();
const water = new Mesh(
  new PlaneGeometry(600, 600).rotateX(-Math.PI / 2),
  new MeshStandardMaterial({ color: 0x12304a, roughness: 0.15, metalness: 0.2, bumpMap: waterTex, bumpScale: 6, transparent: true, opacity: 0.93 }),
);
scene.add(water);

// ---- Player ------------------------------------------------------------------------------
const player = { x: 18, z: 20, yaw: Math.PI * 0.85, pitch: -0.05, vy: 0 };
const flashlight = new SpotLight(0xdfe9ff, 220, 50, MathUtils.degToRad(26), 0.9, 1.5);
flashlight.position.set(0.15, -0.1, 0);
flashlight.target.position.set(0, 0, -10);
camera.add(flashlight, flashlight.target);
let flashOn = true;

const keys = new Set();
addEventListener('keydown', (e) => {
  keys.add(e.code);
  if (e.code === 'KeyF') { flashOn = !flashOn; flashlight.visible = flashOn; }
  if (e.code === 'KeyT') timeScale = timeScale === 1 ? 6 : 1;
});
addEventListener('keyup', (e) => keys.delete(e.code));
const intro = document.getElementById('intro');
intro.addEventListener('click', () => { intro.classList.add('hidden'); renderer.domElement.requestPointerLock?.(); });
document.addEventListener('mousemove', (e) => {
  if (document.pointerLockElement !== renderer.domElement) return;
  player.yaw -= e.movementX * 0.0022;
  player.pitch = MathUtils.clamp(player.pitch - e.movementY * 0.0022, -1.4, 1.4);
});
addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---- Simulation ----------------------------------------------------------------------------
let tideClock = 0;       // seconds of tide time
let beamClock = 0;
let timeScale = 1;
const hud = document.getElementById('hud');
const fwd = new Vector3(), right = new Vector3();

function step(dt) {
  tideClock += dt * timeScale;
  beamClock += dt;
  const level = tideAt(tideClock);
  water.position.y = level;
  waterTex.offset.x += dt * 0.004; waterTex.offset.y += dt * 0.0025;
  beamPivot.rotation.y = (beamClock / BEAM_PERIOD_S) * Math.PI * 2;

  const speed = (keys.has('ShiftLeft') || keys.has('ShiftRight') ? 5.5 : 3) * dt;
  fwd.set(-Math.sin(player.yaw), 0, -Math.cos(player.yaw));
  right.set(Math.cos(player.yaw), 0, -Math.sin(player.yaw));
  let mx = 0, mz = 0;
  if (keys.has('KeyW') || keys.has('KeyZ') || keys.has('ArrowUp')) { mx += fwd.x; mz += fwd.z; }
  if (keys.has('KeyS') || keys.has('ArrowDown')) { mx -= fwd.x; mz -= fwd.z; }
  if (keys.has('KeyD') || keys.has('ArrowRight')) { mx += right.x; mz += right.z; }
  if (keys.has('KeyA') || keys.has('KeyQ') || keys.has('ArrowLeft')) { mx -= right.x; mz -= right.z; }
  const len = Math.hypot(mx, mz);
  if (len > 0) {
    const nx = player.x + (mx / len) * speed, nz = player.z + (mz / len) * speed;
    // keep on the map; slow down when wading deeper than the knee
    if (Math.hypot(nx, nz) < ISLAND_RADIUS * 1.25) { player.x = nx; player.z = nz; }
  }
  const ground = heightAt(player.x, player.z);
  const depth = Math.max(0, level - ground);
  player.eyeY = ground + EYE_HEIGHT;
  camera.position.set(player.x, player.eyeY, player.z);
  camera.rotation.set(player.pitch, player.yaw, 0);
  hud.textContent = `Marée : ${level.toFixed(2)} m   Eau autour de vous : ${depth.toFixed(2)} m` + (timeScale > 1 ? '   (x6)' : '');
  return { level, depth };
}

let last = performance.now(), frames = 0, fpsAcc = 0, fps = 0, running = true;
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000); last = now;
  step(dt);
  renderer.render(scene, camera);
  frames++; fpsAcc += dt;
  if (fpsAcc >= 1) { fps = frames / fpsAcc; frames = 0; fpsAcc = 0; }
  if (running) requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// ---- Test hooks: read-only state + deterministic setters (used by tests/run.cjs) ------------
window.__estran = {
  version: 'poc-0.1.0',
  getState: () => ({
    tideClock, tideLevel: water.position.y, beamAngle: beamPivot.rotation.y, beamClock,
    player: { x: player.x, z: player.z, yaw: player.yaw, pitch: player.pitch, eyeY: camera.position.y },
    fps, flashlight: flashOn,
    gl: renderer.capabilities.isWebGL2 ? 'webgl2' : 'webgl1',
    drawCalls: renderer.info.render.calls, triangles: renderer.info.render.triangles,
  }),
  setTideClock: (t) => { tideClock = t; },
  setBeamClock: (t) => { beamClock = t; },
  setPlayer: (x, z, yaw, pitch = 0) => { player.x = x; player.z = z; player.yaw = yaw; player.pitch = pitch; },
  hideIntro: () => intro.classList.add('hidden'),
  tideAt,
  heightAt,
};
