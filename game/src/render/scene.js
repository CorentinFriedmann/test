// three.js scene: island mesh from the simulation's heightAt, water at the tide level, lighthouse, ladders.
import {
  WebGLRenderer, Scene, PerspectiveCamera, Color, FogExp2, PlaneGeometry, Mesh, MeshStandardMaterial, CylinderGeometry, ConeGeometry,
  BoxGeometry, SpotLight, DirectionalLight, AmbientLight, HemisphereLight, Group, CanvasTexture, RepeatWrapping, Float32BufferAttribute,
  MeshBasicMaterial, AdditiveBlending, DoubleSide, MathUtils, SRGBColorSpace, RingGeometry, CapsuleGeometry,
} from 'three';
import { hash2 } from '../sim/rng.js';
import { QUALITY } from './quality.js';

function makeWaterTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const ctx = c.getContext('2d'); const img = ctx.createImageData(256, 256);
  for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
    const v = Math.sin(x / 256 * Math.PI * 2 * 4 + Math.sin(y / 256 * Math.PI * 2 * 3) * 1.5) * 0.5
      + Math.sin(y / 256 * Math.PI * 2 * 6 + x / 256 * Math.PI * 2 * 2) * 0.35 + Math.sin((x + y) / 256 * Math.PI * 2 * 9) * 0.15;
    const k = (y * 256 + x) * 4; const b = Math.floor(128 + 127 * v);
    img.data[k] = img.data[k + 1] = img.data[k + 2] = b; img.data[k + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const t = new CanvasTexture(c); t.wrapS = t.wrapT = RepeatWrapping; t.repeat.set(40, 40); t.colorSpace = SRGBColorSpace;
  return t;
}

export function createView(sim, quality, opts = {}) {
  const q = QUALITY[quality];
  const { world } = sim;
  const renderer = new WebGLRenderer({ antialias: q.antialias, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, q.pixelRatioMax));
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const scene = new Scene();
  scene.background = new Color(0x101c2a);
  scene.fog = new FogExp2(0x101c2a, 0.018);
  const camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 400);
  camera.rotation.order = 'YXZ';
  scene.add(camera);
  const moon = new DirectionalLight(0x6f8fc0, 1.1); moon.position.set(-30, 40, 25); scene.add(moon);
  scene.add(new AmbientLight(0x2a3a55, 1.4), new HemisphereLight(0x3a5078, 0x0c1014, 0.9));

  // Island: vertices follow the simulation terrain exactly (what you see is what the rules use).
  {
    const size = world.mapRadius * 2 + 10, seg = Math.round(size);
    const g = new PlaneGeometry(size, size, seg, seg);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position, colors = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const h = world.heightAt(pos.getX(i), pos.getZ(i));
      pos.setY(i, h);
      const onPlatform = Math.hypot(pos.getX(i) - world.lighthouse.x, pos.getZ(i) - world.lighthouse.z) <= world.plateauRadius + 0.5;
      const dry = MathUtils.clamp((h + 0.2) / 2.5, 0, 1), n = 0.85 + 0.3 * hash2(i, 7, 1);
      const [r, gg, b] = onPlatform ? [0.34, 0.35, 0.37] : [MathUtils.lerp(0.12, 0.42, dry), MathUtils.lerp(0.13, 0.38, dry), MathUtils.lerp(0.14, 0.30, dry)];
      colors[i * 3] = r * n; colors[i * 3 + 1] = gg * n; colors[i * 3 + 2] = b * n;
    }
    g.setAttribute('color', new Float32BufferAttribute(colors, 3));
    g.computeVertexNormals();
    scene.add(new Mesh(g, new MeshStandardMaterial({ vertexColors: true, roughness: 0.92, metalness: 0 })));
  }

  // Rocks: cheap, deterministic (integer hash), kept off the platform.
  {
    const mat = new MeshStandardMaterial({ color: 0x2a2d30, roughness: 0.95, flatShading: true });
    const geo = new ConeGeometry(1, 1.4, 6);
    for (let i = 0; i < q.rocks; i++) {
      const a = hash2(i, 1, 5) * Math.PI * 2, r = 20 + hash2(i, 2, 5) * 38;
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      if (Math.hypot(x - world.lighthouse.x, z - world.lighthouse.z) < 9) continue;
      const m = new Mesh(geo, mat), s = 0.6 + hash2(i, 3, 5) * 1.6;
      m.scale.set(s, s * (0.6 + hash2(i, 4, 5)), s);
      m.position.set(x, world.heightAt(x, z) + 0.2, z);
      m.rotation.y = hash2(i, 5, 5) * 6;
      scene.add(m);
    }
  }

  // Lighthouse on the 3.00 m platform. The rotating beam is cosmetic in pass (a): its angle follows the simulation clock.
  const lighthouse = new Group();
  lighthouse.position.set(world.lighthouse.x, world.plateauHeight, world.lighthouse.z);
  scene.add(lighthouse);
  const add = (geo, mat, y) => { const m = new Mesh(geo, mat); m.position.y = y; lighthouse.add(m); return m; };
  add(new CylinderGeometry(1.6, 2.4, 20, 20), new MeshStandardMaterial({ color: 0x8c8f93, roughness: 0.85 }), 10);
  add(new CylinderGeometry(1.95, 2.05, 2.2, 20), new MeshStandardMaterial({ color: 0x6a1d1d, roughness: 0.8 }), 9);
  add(new CylinderGeometry(2.3, 2.3, 0.3, 20), new MeshStandardMaterial({ color: 0x1b1d20 }), 20.15);
  add(new CylinderGeometry(0.9, 0.9, 1.6, 16), new MeshBasicMaterial({ color: 0xfff1c8 }), 21.1);
  add(new ConeGeometry(1.5, 1.4, 16), new MeshStandardMaterial({ color: 0x1b1d20 }), 22.6);
  const beamPivot = new Group(); beamPivot.position.y = 21.1; lighthouse.add(beamPivot);
  const beamMats = [];
  const beamLight = new SpotLight(0xfff0cc, 9000, 140, MathUtils.degToRad(9), 0.5, 1.6);
  beamLight.target.position.set(0, -1.5, 40);
  beamPivot.add(beamLight, beamLight.target);
  {
    const L = 70, R = 5;
    const coneMat = new MeshBasicMaterial({
      color: 0xffe9b0, transparent: true, opacity: 0.16, blending: AdditiveBlending, depthWrite: false, side: DoubleSide, fog: true });
    beamMats.push(coneMat);
    const cone = new Mesh(new ConeGeometry(R, L, 24, 1, true), coneMat);
    cone.geometry.translate(0, -L / 2, 0);
    cone.rotation.x = -Math.PI / 2 - 0.04;
    beamPivot.add(cone);
  }

  // Crank at the foot of the tower (hold E to rewind the lighthouse). Pass b.
  const crank = new Group(); crank.position.set(world.crank.x, world.plateauHeight, world.crank.z); scene.add(crank);
  const crankMat = new MeshStandardMaterial({ color: 0x9a7b3c, roughness: 0.6, metalness: 0.4 });
  const crankPost = new Mesh(new CylinderGeometry(0.12, 0.14, 1.0, 10), crankMat); crankPost.position.y = 0.5; crank.add(crankPost);
  const crankArm = new Group(); crankArm.position.y = 1.0; crank.add(crankArm);
  const arm = new Mesh(new BoxGeometry(0.7, 0.08, 0.08), crankMat); arm.position.x = 0.3; crankArm.add(arm);
  const knob = new Mesh(new CylinderGeometry(0.06, 0.06, 0.25, 8), crankMat); knob.position.set(0.65, -0.1, 0); crankArm.add(knob);

  // Debris on the foreshore (crates and buckets): hitting one makes a loud noise.
  {
    const crate = new MeshStandardMaterial({ color: 0x6b5236, roughness: 0.9 }), bucket = new MeshStandardMaterial({ color: 0x4d6a78, roughness: 0.7 });
    world.debris.forEach((d, i) => {
      const m = i % 2 ? new Mesh(new CylinderGeometry(0.28, 0.22, 0.45, 12), bucket) : new Mesh(new BoxGeometry(0.7, 0.55, 0.55), crate);
      m.position.set(d.x, d.ground + 0.25, d.z); m.rotation.y = i * 1.7; scene.add(m);
    });
  }

  // La Laisse: provisional dark silhouette (T-030 replaces it). Visible only while lit by the beam or the lamp (GDD 9 case 1),
  // or always with ?debug=1. Its position is smoothed for display only; the simulation keeps its own 30 Hz position.
  const laisseMat = new MeshStandardMaterial({ color: 0x0b1118, roughness: 0.5, emissive: 0x16222e });
  const laisse = new Group(); laisse.visible = false; scene.add(laisse);
  { const body = new Mesh(new CapsuleGeometry(0.45, 1.3, 4, 10), laisseMat); body.position.y = 0.9; laisse.add(body);
    const head = new Mesh(new ConeGeometry(0.3, 0.6, 8), laisseMat); head.position.y = 2.0; laisse.add(head); }
  const laisseShown = { x: 0, z: 0, init: false };

  // Water rings under the player's footsteps (radius proportional to the noise, capped at 8 m: GDD 11).
  const rings = [];
  {
    const geo = new RingGeometry(0.92, 1, 40).rotateX(-Math.PI / 2);
    for (let i = 0; i < 8; i++) {
      const m = new Mesh(geo, new MeshBasicMaterial({ color: 0xbfe0f0, transparent: true, opacity: 0, depthWrite: false, side: DoubleSide }));
      m.visible = false; scene.add(m); rings.push({ m, age: 1e9, max: 1, life: 1 });
    }
  }
  let ringNext = 0;

  // Ladders: a post with graduations; the colour tells read / unread.
  const ladders = world.stations.map((s) => {
    const g = new Group(); g.position.set(s.x, s.ground, s.z);
    const mat = new MeshStandardMaterial({ color: 0xd9c98a, emissive: 0x3a3418, roughness: 0.7 });
    const post = new Mesh(new BoxGeometry(0.16, 2.6, 0.16), mat); post.position.y = 1.3; g.add(post);
    for (let k = 0; k < 6; k++) { const tick = new Mesh(new BoxGeometry(0.5, 0.06, 0.1), mat); tick.position.y = 0.4 + k * 0.4; g.add(tick); }
    scene.add(g);
    return { mat };
  });

  // Water: plane at the tide level.
  const waterTex = makeWaterTexture();
  const water = new Mesh(new PlaneGeometry(600, 600).rotateX(-Math.PI / 2), new MeshStandardMaterial({
    color: 0x12304a, roughness: 0.15, metalness: 0.2, bumpMap: q.waterBump ? waterTex : null, bumpScale: 6, transparent: true, opacity: 0.93 }));
  scene.add(water);

  // Player lamp (visibility follows the simulation lamp state).
  const lamp = new SpotLight(0xdfe9ff, 220, 50, MathUtils.degToRad(26), 0.9, 1.5);
  lamp.position.set(0.15, -0.1, 0); lamp.target.position.set(0, 0, -10);
  camera.add(lamp, lamp.target);
  lamp.visible = false;

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  addEventListener('resize', onResize);

  return {
    renderer, camera, dom: renderer.domElement,
    /** pose: interpolated {x, z, ground, yaw, pitch, eye}; st: simulation state (read only). */
    /** Spawns a ripple (render only). */
    addRing(x, z, noiseR, level) {
      const r = rings[ringNext++ % rings.length];
      r.age = 0; r.life = 1.2; r.max = Math.min(8, Math.max(1, noiseR)); r.m.position.set(x, level + 0.03, z); r.m.visible = true;
    },
    draw(st, pose, simTime) {
      water.position.y = st.level;
      waterTex.offset.x = simTime * 0.004; waterTex.offset.y = simTime * 0.0025;
      beamPivot.rotation.y = (simTime / 8) * Math.PI * 2;
      {
        // Lighthouse wear: below the flicker threshold the beam flickers and dims; at 0 it is off (cosmetic, deterministic in the sim clock).
        const c = st.lighthouse.charge, low = c < opts.flicker;
        const k = c <= 0 ? 0 : low ? (c / opts.flicker) * (hash2(Math.floor(simTime * 14), 3, 9) > 0.35 ? 1 : 0.15) : 1;
        beamLight.intensity = 9000 * k; beamMats[0].opacity = 0.16 * k;
      }
      crankArm.rotation.y = st.lighthouse.winding ? (st.lighthouse.winding.ticks / st.lighthouse.winding.total) * Math.PI * 8 : 0;
      // The Laisse.
      {
        const th = st.threat;
        if (th && th.active) {
          if (!laisseShown.init) { laisseShown.x = th.x; laisseShown.z = th.z; laisseShown.init = true; }
          laisseShown.x += (th.x - laisseShown.x) * 0.5; laisseShown.z += (th.z - laisseShown.z) * 0.5;
          laisse.position.set(laisseShown.x, st.level - 1.1, laisseShown.z);
          laisse.visible = th.lit > 0 || opts.showThreat === true;
          laisseMat.emissive.setHex(th.lit > 0 ? 0x2a3a4a : 0x4a1010);
        } else { laisse.visible = false; laisseShown.init = false; }
      }
      for (const r of rings) {
        if (!r.m.visible) continue;
        r.age += 1 / 60;
        const u = r.age / r.life;
        if (u >= 1) { r.m.visible = false; continue; }
        r.m.scale.setScalar(0.3 + r.max * u); r.m.material.opacity = 0.5 * (1 - u);
      }
      lamp.visible = st.lamp.on;
      st.stations.forEach((s, i) => ladders[i].mat.color.setHex(s.read ? 0x6fd0c4 : 0xd9c98a));
      camera.position.set(pose.x, pose.ground + pose.eye, pose.z);
      camera.rotation.set(pose.pitch, pose.yaw, 0);
      renderer.render(scene, camera);
    },
    setQuality(name) {
      const nq = QUALITY[name];
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, nq.pixelRatioMax));
      renderer.setSize(window.innerWidth, window.innerHeight);
      water.material.bumpMap = nq.waterBump ? waterTex : null; water.material.needsUpdate = true;
    },
    info: () => ({ gl: renderer.capabilities.isWebGL2 ? 'webgl2' : 'webgl1', drawCalls: renderer.info.render.calls, triangles: renderer.info.render.triangles }),
  };
}
