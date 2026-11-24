// three.js scene (render only): island mesh from the simulation's heightAt, tide-following water with shore foam, lighthouse and
// beam, lamp, La Laisse, fog, grain and vignette. It reads the simulation state and never writes to it.
import {
  WebGLRenderer, Scene, PerspectiveCamera, Color, FogExp2, PlaneGeometry, Mesh, MeshStandardMaterial, CylinderGeometry, ConeGeometry,
  BoxGeometry, SpotLight, DirectionalLight, AmbientLight, HemisphereLight, Group, CanvasTexture, DataTexture, RepeatWrapping, Float32BufferAttribute,
  MeshBasicMaterial, AdditiveBlending, DoubleSide, MathUtils, SRGBColorSpace, RingGeometry, IcosahedronGeometry, InstancedMesh, Object3D,
  Sprite, SpriteMaterial, BufferGeometry, OrthographicCamera, RedFormat, UnsignedByteType, LinearFilter, ClampToEdgeWrapping, Vector3,
} from 'three';
import { hash2, valueNoise } from '../sim/rng.js';
import { QUALITY, MOMENTS, LOOK, blendMoments } from './quality.js';
import { createWaterMaterial, createOverlayMaterial } from './shaders.js';
import { createLaisse } from './laisse.js';

const ROCKS = 48; // same count and placement on every quality level (what hides what must not depend on the level)

function makeSandTexture() {
  const S = 256, c = document.createElement('canvas'); c.width = c.height = S;
  const ctx = c.getContext('2d'), img = ctx.createImageData(S, S);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    // Tileable: lattice noise wrapped on the 256 grid, two octaves, plus fine ripple lines like wind-combed sand.
    const wrap = (px, py, f) => {
      const fx = px / S * f, fy = py / S * f, xi = Math.floor(fx), yi = Math.floor(fy), xf = fx - xi, yf = fy - yi;
      const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), h = (a, b) => hash2(((a % f) + f) % f, ((b % f) + f) % f, 11);
      return h(xi, yi) * (1 - u) * (1 - v) + h(xi + 1, yi) * u * (1 - v) + h(xi, yi + 1) * (1 - u) * v + h(xi + 1, yi + 1) * u * v;
    };
    const n = wrap(x, y, 8) * 0.5 + wrap(x, y, 32) * 0.3 + hash2(x, y, 5) * 0.2;
    const ripple = 0.5 + 0.5 * Math.sin((y / S * 14 + wrap(x, y, 4) * 2.2) * Math.PI * 2);
    const v = Math.floor(255 * (0.62 + 0.3 * n + 0.1 * ripple * n));
    const k = (y * S + x) * 4; img.data[k] = img.data[k + 1] = img.data[k + 2] = v; img.data[k + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const t = new CanvasTexture(c); t.wrapS = t.wrapT = RepeatWrapping; t.repeat.set(36, 36); t.colorSpace = SRGBColorSpace; t.anisotropy = 4;
  return t;
}

function makeGlowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const ctx = c.getContext('2d'), g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,240,204,1)'); g.addColorStop(0.18, 'rgba(255,233,176,0.55)'); g.addColorStop(1, 'rgba(255,233,176,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
  return new CanvasTexture(c);
}

/** Open cone from the lantern; vertex alpha fades the beam along its length so it has no hard far end. */
function beamGeometry(segments) {
  const L = LOOK.beamConeLength, g = new ConeGeometry(LOOK.beamConeRadius, L, segments, 1, true).translate(0, -L / 2, 0);
  const p = g.attributes.position, col = new Float32Array(p.count * 4);
  for (let i = 0; i < p.count; i++) { const u = MathUtils.clamp(-p.getY(i) / L, 0, 1); col.set([1, 1, 1, 1 - u ** 1.4], i * 4); }
  g.setAttribute('color', new Float32BufferAttribute(col, 4));
  return g;
}

function rockGeometry(detail) {
  const g = new IcosahedronGeometry(1, detail), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const k = 0.72 + 0.5 * hash2(Math.round(x * 24), Math.round(y * 24) + 3 * Math.round(z * 24), 31); // same position => same push (no cracks)
    p.setXYZ(i, x * k, Math.max(y * k, -0.45), z * k);
  }
  g.computeVertexNormals();
  return g;
}

export function createView(sim, qualityName, opts = {}) {
  let q = QUALITY[qualityName];
  const { world } = sim;
  const renderer = new WebGLRenderer({ antialias: q.antialias, powerPreference: 'high-performance' });
  const applyPixelRatio = () => renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, q.pixelRatioMax) * q.scale);
  applyPixelRatio();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;           // the grain / vignette overlay is a second pass on the same frame
  renderer.info.autoReset = false;      // so the counters cover the whole frame; reset by hand in draw()
  document.body.appendChild(renderer.domElement);

  const baseMoment = opts.moment || 'night';
  const scene = new Scene();
  scene.background = new Color(); scene.fog = new FogExp2(0x000000, 0.01);
  const camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 400);
  camera.rotation.order = 'YXZ';
  scene.add(camera);
  const moon = new DirectionalLight(0xffffff, 1); scene.add(moon);
  const amb = new AmbientLight(0xffffff, 1), hemi = new HemisphereLight(0xffffff, 0x000000, 1);
  scene.add(amb, hemi);

  const wetLevel = { value: -1 };

  // ---- Terrain: vertices follow the simulation terrain exactly (what you see is what the rules use).
  const size = world.mapRadius * 2 + 10, seg = Math.round(size), half = size / 2;
  const sandTex = makeSandTexture();
  const terrainMat = new MeshStandardMaterial({ vertexColors: true, roughness: 0.92, metalness: 0, map: sandTex, bumpMap: q.terrainBump ? sandTex : null, bumpScale: 1.4 });
  terrainMat.onBeforeCompile = (sh) => {
    sh.uniforms.uLevel = wetLevel; sh.uniforms.uBand = { value: LOOK.wetBand };
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying float vWy;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvWy = position.y;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vWy; uniform float uLevel, uBand;')
      .replace('#include <color_fragment>', '#include <color_fragment>\nfloat wetK = 1.0 - smoothstep(-0.05, uBand, vWy - uLevel);\ndiffuseColor.rgb *= mix(1.0, 0.6, wetK);')
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, 0.32, wetK);');
  };
  let hMin = Infinity, hMax = -Infinity;
  {
    const g = new PlaneGeometry(size, size, seg, seg);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position, colors = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i), h = world.heightAt(x, z);
      pos.setY(i, h);
      const onPlatform = Math.hypot(x - world.lighthouse.x, z - world.lighthouse.z) <= world.plateauRadius + 0.5;
      const dry = MathUtils.clamp((h + 0.2) / 2.5, 0, 1);
      const n = 0.82 + 0.36 * hash2(i, 7, 1), patch = 0.8 + 0.4 * valueNoise(x * 0.09, z * 0.09, 3), cool = valueNoise(x * 0.05 + 40, z * 0.05, 9);
      const [r, gg, b] = onPlatform ? [0.34, 0.35, 0.37] : [MathUtils.lerp(0.12, 0.42, dry), MathUtils.lerp(0.13, 0.38, dry), MathUtils.lerp(0.14, 0.30, dry)];
      const k = n * patch;
      colors[i * 3] = r * k * (1 - 0.12 * cool); colors[i * 3 + 1] = gg * k; colors[i * 3 + 2] = b * k * (1 + 0.15 * cool);
    }
    g.setAttribute('color', new Float32BufferAttribute(colors, 3));
    g.computeVertexNormals();
    scene.add(new Mesh(g, terrainMat));
  }

  // ---- Terrain height as a texture, so the water shader knows where the shore is (foam, transparency).
  const HN = seg * 2, hdata = new Float32Array(HN * HN);
  for (let j = 0; j < HN; j++) for (let i = 0; i < HN; i++) {
    const h = world.heightAt(-half + (i + 0.5) * size / HN, -half + (j + 0.5) * size / HN);
    hdata[j * HN + i] = h; if (h < hMin) hMin = h; if (h > hMax) hMax = h;
  }
  const hbytes = new Uint8Array(HN * HN), hRange = Math.max(0.001, hMax - hMin);
  for (let k = 0; k < hdata.length; k++) hbytes[k] = Math.round(255 * (hdata[k] - hMin) / hRange);
  const heightTex = new DataTexture(hbytes, HN, HN, RedFormat, UnsignedByteType);
  heightTex.magFilter = heightTex.minFilter = LinearFilter; heightTex.wrapS = heightTex.wrapT = ClampToEdgeWrapping;
  heightTex.unpackAlignment = 1; heightTex.needsUpdate = true;

  // ---- Rocks: one InstancedMesh (one draw call), displaced icosahedra, deterministic placement.
  const rockMat = new MeshStandardMaterial({ color: 0xffffff, roughness: 0.95, flatShading: true });
  const rocks = new InstancedMesh(rockGeometry(q.rockDetail), rockMat, ROCKS);
  {
    const o = new Object3D(), tint = new Color();
    let n = 0;
    for (let i = 0; i < ROCKS; i++) {
      const a = hash2(i, 1, 5) * Math.PI * 2, r = 18 + hash2(i, 2, 5) * 40;
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      if (Math.hypot(x - world.lighthouse.x, z - world.lighthouse.z) < 9) continue;
      const s = 0.55 + hash2(i, 3, 5) * 1.5;
      o.position.set(x, world.heightAt(x, z) + 0.12 * s, z);
      o.scale.set(s * (0.8 + hash2(i, 6, 5) * 0.6), s * (0.55 + hash2(i, 4, 5) * 0.8), s);
      o.rotation.set(0, hash2(i, 5, 5) * 6.28, 0); o.updateMatrix();
      rocks.setMatrixAt(n, o.matrix);
      const v = 0.75 + 0.5 * hash2(i, 8, 5); tint.setRGB(0.2 * v, 0.21 * v, 0.23 * v); rocks.setColorAt(n, tint);
      n++;
    }
    rocks.count = n; rocks.instanceMatrix.needsUpdate = true; rocks.instanceColor.needsUpdate = true;
    scene.add(rocks);
  }

  // ---- Lighthouse on the 3.00 m platform. The beam heading is the simulation's own formula (same as threat.js beamHit).
  const lighthouse = new Group();
  lighthouse.position.set(world.lighthouse.x, world.plateauHeight, world.lighthouse.z);
  scene.add(lighthouse);
  const add = (geo, mat, y) => { const m = new Mesh(geo, mat); m.position.y = y; lighthouse.add(m); return m; };
  add(new CylinderGeometry(1.6, 2.4, 20, 20), new MeshStandardMaterial({ color: 0x8c8f93, roughness: 0.85 }), 10);
  add(new CylinderGeometry(1.95, 2.05, 2.2, 20), new MeshStandardMaterial({ color: 0x6a1d1d, roughness: 0.8 }), 9);
  add(new CylinderGeometry(2.3, 2.3, 0.3, 20), new MeshStandardMaterial({ color: 0x1b1d20 }), 20.15);
  const lanternMat = new MeshBasicMaterial({ color: 0xfff1c8 });
  add(new CylinderGeometry(0.9, 0.9, 1.6, 16), lanternMat, 21.1);
  add(new ConeGeometry(1.5, 1.4, 16), new MeshStandardMaterial({ color: 0x1b1d20 }), 22.6);
  const glow = new Sprite(new SpriteMaterial({ map: makeGlowTexture(), color: 0xffe9b0, blending: AdditiveBlending, transparent: true, depthWrite: false, fog: false }));
  glow.scale.setScalar(16); glow.position.y = 21.1; glow.renderOrder = 4; lighthouse.add(glow);
  const beamPivot = new Group(); beamPivot.position.y = 21.1; lighthouse.add(beamPivot);
  const beamLight = new SpotLight(LOOK.beamColor, LOOK.beamIntensity, 140, MathUtils.degToRad(LOOK.beamAngleDeg), 0.5, 1.6);
  beamLight.target.position.set(0, -1.5, 40);
  beamPivot.add(beamLight, beamLight.target);
  const coneMat = new MeshBasicMaterial({ color: 0xffe9b0, vertexColors: true, transparent: true, opacity: LOOK.beamOpacity, blending: AdditiveBlending, depthWrite: false, side: DoubleSide, fog: true });
  const cone = new Mesh(beamGeometry(q.beamSegments), coneMat);
  cone.rotation.x = -Math.PI / 2 - 0.04; cone.renderOrder = 3;
  beamPivot.add(cone);

  // ---- Crank at the foot of the tower (hold E to rewind the lighthouse).
  const crank = new Group(); crank.position.set(world.crank.x, world.plateauHeight, world.crank.z); scene.add(crank);
  const crankMat = new MeshStandardMaterial({ color: 0x9a7b3c, roughness: 0.6, metalness: 0.4 });
  const crankPost = new Mesh(new CylinderGeometry(0.12, 0.14, 1.0, 10), crankMat); crankPost.position.y = 0.5; crank.add(crankPost);
  const crankArm = new Group(); crankArm.position.y = 1.0; crank.add(crankArm);
  const arm = new Mesh(new BoxGeometry(0.7, 0.08, 0.08), crankMat); arm.position.x = 0.3; crankArm.add(arm);
  const knob = new Mesh(new CylinderGeometry(0.06, 0.06, 0.25, 8), crankMat); knob.position.set(0.65, -0.1, 0); crankArm.add(knob);

  // ---- Debris on the foreshore (crates and buckets): hitting one makes a loud noise.
  {
    const crate = new MeshStandardMaterial({ color: 0x6b5236, roughness: 0.9 }), bucket = new MeshStandardMaterial({ color: 0x4d6a78, roughness: 0.7 });
    world.debris.forEach((d, i) => {
      const m = i % 2 ? new Mesh(new CylinderGeometry(0.28, 0.22, 0.45, 12), bucket) : new Mesh(new BoxGeometry(0.7, 0.55, 0.55), crate);
      m.position.set(d.x, d.ground + 0.25, d.z); m.rotation.y = i * 1.7; scene.add(m);
    });
  }

  // ---- La Laisse (visible only while lit; see laisse.js).
  const laisse = createLaisse(q);
  scene.add(laisse.group);

  // ---- Water rings under the player's footsteps (radius proportional to the noise, capped at 8 m: GDD 11).
  const rings = [];
  {
    const geo = new RingGeometry(0.92, 1, 40).rotateX(-Math.PI / 2);
    for (let i = 0; i < 8; i++) {
      const m = new Mesh(geo, new MeshBasicMaterial({ color: 0xbfe0f0, transparent: true, opacity: 0, depthWrite: false, side: DoubleSide }));
      m.visible = false; m.renderOrder = 2; scene.add(m); rings.push({ m, age: 1e9, max: 1, life: 1 });
    }
  }
  let ringNext = 0;

  // ---- Ladders: a post with graduations; the colour tells read / unread.
  const ladders = world.stations.map((s) => {
    const g = new Group(); g.position.set(s.x, s.ground, s.z);
    const mat = new MeshStandardMaterial({ color: 0xd9c98a, emissive: 0x3a3418, roughness: 0.7 });
    const post = new Mesh(new BoxGeometry(0.16, 2.6, 0.16), mat); post.position.y = 1.3; g.add(post);
    for (let k = 0; k < 6; k++) { const tick = new Mesh(new BoxGeometry(0.5, 0.06, 0.1), mat); tick.position.y = 0.4 + k * 0.4; g.add(tick); }
    scene.add(g);
    return { mat };
  });

  // ---- Water: plane at the tide level, shader with shore foam and light reflections.
  const waterMat = createWaterMaterial({ octaves: q.waterOctaves, glint: q.waterGlint, heightTex, hMin, hRange, mapHalf: half, lighthouse: world.lighthouse });
  const water = new Mesh(new PlaneGeometry(600, 600).rotateX(-Math.PI / 2), waterMat);
  water.renderOrder = 1; scene.add(water);

  // ---- Player lamp (intensity follows the simulation lamp state; the light is never removed, to avoid a shader recompile stutter).
  const lamp = new SpotLight(LOOK.lampColor, 0, 50, MathUtils.degToRad(LOOK.lampAngleDeg), 0.9, 1.5);
  lamp.position.set(0.15, -0.1, 0); lamp.target.position.set(0, 0, -10);
  camera.add(lamp, lamp.target);
  const lampCosOuter = Math.cos(MathUtils.degToRad(LOOK.lampAngleDeg)), lampCosInner = Math.cos(MathUtils.degToRad(LOOK.lampAngleDeg * 0.5));

  // ---- Grain and vignette: one full-screen triangle drawn over the finished frame.
  const overlayMat = createOverlayMaterial();
  const postScene = new Scene(), postCam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  {
    const g = new BufferGeometry(); g.setAttribute('position', new Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
    const tri = new Mesh(g, overlayMat); tri.frustumCulled = false; postScene.add(tri);
  }

  // ---- Lighting moments.
  const lampPos = new Vector3(), lampDir = new Vector3();
  const blend = { k: 0, applied: -1 };
  let momentName = baseMoment, cur = MOMENTS[baseMoment], curBeam = 1;
  function applyMoment(m) {
    cur = m;
    scene.background.setHex(m.bg); scene.fog.color.setHex(m.bg); scene.fog.density = m.fog;
    moon.color.setHex(m.sun); moon.intensity = m.sunI; moon.position.set(...m.sunPos);
    amb.color.setHex(m.amb); amb.intensity = m.ambI;
    hemi.color.setHex(m.hemiSky); hemi.groundColor.setHex(m.hemiGround); hemi.intensity = m.hemiI;
    terrainMat.color.setScalar(m.sand);
    const u = waterMat.uniforms;
    u.uDeep.value.setHex(m.waterDeep); u.uShallow.value.setHex(m.waterShallow); u.uFoam.value.setHex(m.foam);
    u.uSunDir.value.set(...m.sunPos).normalize(); u.uSunCol.value.setHex(m.sun); u.uSunGlint.value = 0.45 * m.sunI;
    overlayMat.uniforms.uGrain.value = q.grain ? m.grain : 0; overlayMat.uniforms.uVig.value = m.vignette; overlayMat.uniforms.uVigCol.value.setHex(m.vignetteColor);
    lanternMat.color.setHex(0xfff1c8).multiplyScalar(0.3 + 0.7 * m.lantern);
  }
  applyMoment(MOMENTS[baseMoment]);

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    overlayMat.uniforms.uAspect.value = camera.aspect;
  }
  addEventListener('resize', onResize);
  overlayMat.uniforms.uAspect.value = camera.aspect;

  let frameNo = 0, last = null;
  function draw(st, pose, simTime, dt = 1 / 60, keepSeed = false) {
    last = [st, pose, simTime];
    if (opts.momentFixed !== true) {
      const target = st.outcome === 'victory' ? 1 : 0;
      blend.k = MathUtils.clamp(blend.k + Math.sign(target - blend.k) * Math.min(Math.abs(target - blend.k), dt / LOOK.victoryBlendSeconds), 0, 1);
      if (blend.k !== blend.applied) { blend.applied = blend.k; applyMoment(blend.k > 0 ? blendMoments(MOMENTS[baseMoment], MOMENTS.dawn, blend.k) : MOMENTS[baseMoment]); }
    }
    renderer.info.reset();
    // Camera first: the lamp reflections on the water need its world pose.
    camera.position.set(pose.x, pose.ground + pose.eye, pose.z);
    camera.rotation.set(pose.pitch, pose.yaw, 0);
    camera.updateMatrixWorld(true);

    // Water follows the tide level of the simulation.
    water.position.y = st.level; wetLevel.value = st.level;
    const wu = waterMat.uniforms; wu.uTime.value = simTime;
    // Lighthouse beam: heading from the data period (same formula as the logic), wear flicker below the threshold.
    const heading = (simTime / opts.beamPeriod) * Math.PI * 2;
    beamPivot.rotation.y = heading;
    const c = st.lighthouse.charge, low = c < opts.flicker;
    const k = c <= 0 ? 0 : low ? (c / opts.flicker) * (hash2(Math.floor(simTime * 14), 3, 9) > 0.35 ? 1 : 0.15) : 1;
    curBeam = k * cur.beam;
    beamLight.intensity = LOOK.beamIntensity * curBeam; coneMat.opacity = LOOK.beamOpacity * curBeam;
    glow.material.opacity = Math.min(1, cur.glow * (0.35 + 0.65 * k));
    wu.uBeam.value.set(curBeam, heading, opts.beamReach * (low ? Math.max(c, 0) / opts.flicker : 1), 0.2);
    crankArm.rotation.y = st.lighthouse.winding ? (st.lighthouse.winding.ticks / st.lighthouse.winding.total) * Math.PI * 8 : 0;

    // Lamp.
    lamp.intensity = st.lamp.on ? LOOK.lampIntensity : 0;
    lampPos.set(0.15, -0.1, 0).applyMatrix4(camera.matrixWorld);
    camera.getWorldDirection(lampDir);
    wu.uLamp.value.set(st.lamp.on ? 1 : 0, lampCosOuter, lampCosInner); wu.uLampPos.value.copy(lampPos); wu.uLampDir.value.copy(lampDir);

    // The Laisse: the visibility rule is the simulation's (th.lit), identical on every quality level.
    laisse.update(st.threat, st.level, camera.position, simTime, dt, opts.showThreat === true);

    for (const r of rings) {
      if (!r.m.visible) continue;
      r.age += dt;
      const u = r.age / r.life;
      if (u >= 1) { r.m.visible = false; continue; }
      r.m.scale.setScalar(0.3 + r.max * u); r.m.material.opacity = 0.5 * (1 - u);
    }
    st.stations.forEach((s, i) => ladders[i].mat.color.setHex(s.read ? 0x6fd0c4 : 0xd9c98a));

    if (!keepSeed) frameNo++;
    overlayMat.uniforms.uSeed.value = frameNo % 997;
    renderer.clear();
    renderer.render(scene, camera);
    renderer.render(postScene, postCam);
  }

  const readPixels = () => {
    const gl = renderer.getContext(), w = gl.drawingBufferWidth, h = gl.drawingBufferHeight, buf = new Uint8Array(w * h * 4);
    gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, buf);
    return buf;
  };

  return {
    renderer, camera, dom: renderer.domElement,
    /** Spawns a ripple (render only). */
    addRing(x, z, noiseR, level) {
      const r = rings[ringNext++ % rings.length];
      r.age = 0; r.life = 1.2; r.max = Math.min(8, Math.max(1, noiseR)); r.m.position.set(x, level + 0.03, z); r.m.visible = true;
    },
    /** pose: interpolated {x, z, ground, yaw, pitch, eye}; st: simulation state (read only); dt: real seconds since the last frame. */
    draw,
    setQuality(name) {
      q = QUALITY[name];
      applyPixelRatio(); renderer.setSize(window.innerWidth, window.innerHeight);
      terrainMat.bumpMap = q.terrainBump ? sandTex : null; terrainMat.needsUpdate = true;
      waterMat.defines.OCT = q.waterOctaves; waterMat.defines.GLINT = q.waterGlint ? 1 : 0; waterMat.needsUpdate = true;
      cone.geometry.dispose(); cone.geometry = beamGeometry(q.beamSegments);
      rocks.geometry.dispose(); rocks.geometry = rockGeometry(q.rockDetail);
      laisse.setQuality(q); applyMoment(cur);
    },
    /** Test hook: how many pixels the Laisse changes in the current frame (same frame drawn with and without her). */
    probeLaisse() {
      if (!last) return { diff: 0, total: 0, visible: false };
      const [st, pose, t] = last;
      laisse.forceHide(false); draw(st, pose, t, 0, true); const withL = readPixels(); const visible = laisse.group.visible;
      laisse.forceHide(true); draw(st, pose, t, 0, true); const without = readPixels();
      laisse.forceHide(false);
      let diff = 0;
      for (let i = 0; i < withL.length; i += 4) {
        if (Math.abs(withL[i] - without[i]) + Math.abs(withL[i + 1] - without[i + 1]) + Math.abs(withL[i + 2] - without[i + 2]) > 24) diff++;
      }
      return { diff, total: withL.length / 4, visible };
    },
    info: () => ({
      gl: renderer.capabilities.isWebGL2 ? 'webgl2' : 'webgl1', drawCalls: renderer.info.render.calls, triangles: renderer.info.render.triangles,
      geometries: renderer.info.memory.geometries, textures: renderer.info.memory.textures,
    }),
    gpuName() {
      try { const gl = renderer.getContext(), e = gl.getExtension('WEBGL_debug_renderer_info'); return e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : 'inconnu'; } catch { return 'inconnu'; }
    },
    pixelRatio: () => renderer.getPixelRatio(),
    moment: () => momentName,
  };
}
