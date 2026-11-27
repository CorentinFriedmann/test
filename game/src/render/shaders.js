// Hand-written GLSL (no asset, no dependency): water, La Laisse, her water disturbance, and the grain / vignette overlay.
import { ShaderMaterial, UniformsUtils, UniformsLib, Color, Vector2, Vector3, Vector4, NormalBlending, DoubleSide, FrontSide } from 'three';

const NOISE = /* glsl */`
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y); }
`;

// ---------------------------------------------------------------- water
export function createWaterMaterial({ octaves, glint, heightTex, hMin, hRange, mapHalf, lighthouse }) {
  const uniforms = UniformsUtils.merge([UniformsLib.fog, {
    uTime: { value: 0 }, uDeep: { value: new Color() }, uShallow: { value: new Color() }, uFoam: { value: new Color() },
    uSunDir: { value: new Vector3(0, 1, 0) }, uSunCol: { value: new Color() }, uSunGlint: { value: 1 },
    uHeight: { value: heightTex }, uHMin: { value: hMin }, uHRange: { value: hRange }, uMapHalf: { value: mapHalf },
    uLamp: { value: new Vector3(0, 0, 0) }, uLampPos: { value: new Vector3() }, uLampDir: { value: new Vector3(0, 0, -1) },
    uBeam: { value: new Vector4(0, 0, 70, 0.16) }, uLH: { value: new Vector2(lighthouse.x, lighthouse.z) },
  }]);
  return new ShaderMaterial({
    uniforms, fog: true, transparent: true, side: FrontSide,
    defines: { OCT: octaves, GLINT: glint ? 1 : 0 },
    vertexShader: /* glsl */`
      #include <fog_pars_vertex>
      varying vec3 vWorld;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorld = wp.xyz;
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader: /* glsl */`
      uniform float uTime, uHMin, uHRange, uMapHalf, uSunGlint;
      uniform vec3 uDeep, uShallow, uFoam, uSunDir, uSunCol, uLamp, uLampPos, uLampDir;
      uniform vec4 uBeam; uniform vec2 uLH; uniform sampler2D uHeight;
      varying vec3 vWorld;
      #include <fog_pars_fragment>
      ${NOISE}
      float wave(vec2 p) {
        float a = 0.5, s = 0.0; vec2 q = p;
        for (int i = 0; i < OCT; i++) { s += a * vn(q + uTime * vec2(0.07, 0.05) * float(i + 1)); q = q * 2.03 + 17.0; a *= 0.5; }
        return s;
      }
      void main() {
        vec2 xz = vWorld.xz;
        // Depth above the seabed/sand: the shore line, foam and transparency all come from the real terrain heights.
        vec2 uv = (xz + uMapHalf) / (2.0 * uMapHalf);
        float inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
        float ground = texture2D(uHeight, uv).r * uHRange + uHMin;
        float d = mix(3.0, vWorld.y - ground, inside);
        float w = wave(xz * 0.35);
        float e = 0.08;
        vec3 N = normalize(vec3(-(wave((xz + vec2(e, 0.0)) * 0.35) - w) * 1.6, 1.0, -(wave((xz + vec2(0.0, e)) * 0.35) - w) * 1.6));
        vec3 V = normalize(cameraPosition - vWorld);
        vec3 col = mix(uShallow, uDeep, smoothstep(0.0, 2.2, d));
        float fr = pow(1.0 - max(dot(N, V), 0.0), 3.0);
        col = mix(col, fogColor, fr * 0.45);
        #if GLINT
          vec3 R = reflect(-V, N);
          col += uSunCol * pow(max(dot(R, uSunDir), 0.0), 70.0) * uSunGlint;
          float spark = smoothstep(0.55, 0.85, wave(xz * 1.3 + uTime * 0.2));
          if (uLamp.x > 0.5) {
            vec3 L = vWorld - uLampPos; float dl = length(L);
            float cone = smoothstep(uLamp.y, uLamp.z, dot(L / dl, uLampDir));
            col += vec3(0.62, 0.74, 0.95) * cone / (1.0 + dl * dl / 500.0) * (0.22 + 0.9 * spark);
          }
          if (uBeam.x > 0.001) {
            vec2 r = xz - uLH; float ang = atan(r.x, r.y) - uBeam.y; ang = atan(sin(ang), cos(ang));
            float k = (1.0 - smoothstep(0.0, uBeam.w, abs(ang))) * smoothstep(uBeam.z, uBeam.z * 0.55, length(r));
            col += vec3(1.0, 0.9, 0.62) * k * uBeam.x * (0.14 + 0.75 * spark);
          }
        #endif
        // Foam: a lapping band where the water meets the sand, broken up by noise.
        float lap = 0.07 * sin(uTime * 1.4 + w * 6.0);
        float dd = d + lap + (w - 0.5) * 0.14;
        float foam = smoothstep(0.32, 0.02, dd) * smoothstep(-0.12, 0.0, dd);
        foam = clamp(foam * (0.5 + 0.9 * vn(xz * 5.0 + uTime * 0.15)), 0.0, 1.0);
        col = mix(col, uFoam, foam * 0.9);
        float a = max(mix(0.45, 0.94, smoothstep(0.0, 1.6, d)), foam * 0.95);
        gl_FragColor = vec4(col, a);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }`,
  });
}

// ---------------------------------------------------------------- La Laisse
// Dark, unlit, ragged silhouette. It only has a rim of cold light (a lamp or the beam is on her) so that it reads against a dark sky.
export function createLaisseMaterial() {
  const uniforms = UniformsUtils.merge([UniformsLib.fog, {
    uTime: { value: 0 }, uAlpha: { value: 0 }, uRim: { value: new Color(0x9fbad6) }, uCore: { value: new Color(0x03060a) }, uDebug: { value: 0 },
  }]);
  return new ShaderMaterial({
    uniforms, fog: true, transparent: true, depthWrite: false, side: DoubleSide, blending: NormalBlending,
    defines: { RAGGED: 1 },
    vertexShader: /* glsl */`
      attribute float aSway;
      uniform float uTime;
      varying vec3 vN, vV, vP;
      #include <fog_pars_vertex>
      void main() {
        vec3 p = position;
        float ph = p.x * 3.1 + p.z * 2.3;
        p.x += sin(uTime * 1.6 + p.y * 2.2 + ph) * 0.10 * aSway;
        p.z += cos(uTime * 1.3 + p.y * 1.7 + ph) * 0.10 * aSway;
        p.z += max(p.y, 0.0) * max(p.y, 0.0) * 0.045;   // the hood leans forward
        vP = p;
        vN = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
        vV = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader: /* glsl */`
      uniform float uTime, uAlpha, uDebug; uniform vec3 uRim, uCore;
      varying vec3 vN, vV, vP;
      #include <fog_pars_fragment>
      ${NOISE}
      void main() {
        float f = 1.0 - abs(dot(normalize(vN), normalize(vV)));
        float rim = pow(f, 2.0);
        float ragged = 1.0;
        #if RAGGED
          ragged = 0.55 + 0.6 * vn(vP.xy * 5.0 + vec2(uTime * 0.6, -uTime * 0.9) + vP.z * 3.0);
        #endif
        vec3 col = mix(uCore, uRim, rim * mix(0.55, 0.35, uDebug)) ;
        col = mix(col, vec3(0.45, 0.08, 0.06), uDebug * rim);
        float a = clamp(uAlpha * (0.78 + 0.22 * rim) * ragged, 0.0, 1.0);
        a *= 1.0 - 0.35 * smoothstep(0.1, 0.0, vP.y + 0.9); // soft where she melts into the water
        gl_FragColor = vec4(col, a);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }`,
  });
}

/** Dark rippled disc on the water around the Laisse: the "disturbance" that gives her away when she is lit. */
export function createDisturbanceMaterial() {
  const uniforms = { uTime: { value: 0 }, uAlpha: { value: 0 }, uRim: { value: new Color(0xa9c2dc) } };
  return new ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, side: DoubleSide,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */`
      uniform float uTime, uAlpha; uniform vec3 uRim; varying vec2 vUv;
      ${NOISE}
      void main() {
        float r = length(vUv - 0.5) * 2.0;
        float rings = 0.5 + 0.5 * sin(r * 22.0 - uTime * 3.2 + vn(vUv * 6.0) * 3.0);
        float body = (1.0 - smoothstep(0.35, 1.0, r)) * smoothstep(0.0, 0.15, r);
        float ring = pow(rings, 3.0) * (1.0 - smoothstep(0.5, 1.0, r));
        vec3 col = mix(vec3(0.01, 0.02, 0.03), uRim, ring * 0.7);
        gl_FragColor = vec4(col, uAlpha * (body * 0.55 + ring * 0.45));
        #include <colorspace_fragment>
      }`,
  });
}

// ---------------------------------------------------------------- grain + vignette
export function createOverlayMaterial() {
  return new ShaderMaterial({
    uniforms: { uSeed: { value: 0 }, uGrain: { value: 0.1 }, uVig: { value: 0.5 }, uVigCol: { value: new Color(0x02060a) }, uAspect: { value: 1.6 },
      uThreat: { value: 0 }, uThreatCol: { value: new Color(0x02060c) } }, // uThreat: the Laisse-near edge vignette (T-043), added to the existing one
    transparent: true, depthTest: false, depthWrite: false,
    vertexShader: `varying vec2 vUv; void main(){ vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: /* glsl */`
      uniform float uSeed, uGrain, uVig, uAspect, uThreat; uniform vec3 uVigCol, uThreatCol; varying vec2 vUv;
      float hash(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
      void main() {
        vec2 c = (vUv - 0.5) * vec2(uAspect, 1.0);
        float edge = smoothstep(0.35, 1.05, length(c));
        float vig0 = uVig * edge, tv = uThreat * edge;
        float vig = vig0 + tv - vig0 * tv;                // the two vignettes add up without exceeding 1
        vec3 vigCol = mix(uVigCol, uThreatCol, tv / (vig0 + tv + 1e-4));
        float n = hash(gl_FragCoord.xy + uSeed * 17.31);
        float g = uGrain * abs(n - 0.5) * 2.0;           // strength of the grain at this pixel
        vec3 col = mix(vec3(step(0.5, n)), vigCol, vig / (vig + g + 1e-4));
        float a = 1.0 - (1.0 - vig) * (1.0 - g);
        gl_FragColor = vec4(col, a);
        #include <colorspace_fragment>
      }`,
  });
}
