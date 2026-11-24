// Measurement screen (F2 or ?perf=1): average frame rate, 95th percentile of the frame time, draw calls, triangles,
// and a button that copies the whole report as JSON. Render side only: it reads, it never touches the simulation.
export function createPerfPanel({ meter, getContext, visible }) {
  const el = document.createElement('div');
  el.id = 'perf';
  el.style.cssText = 'position:fixed;right:12px;top:64px;z-index:30;width:292px;padding:10px 12px;font:12px/1.5 ui-monospace,monospace;'
    + 'color:#cfe3ee;background:rgba(5,9,13,.82);border:1px solid #3b5163;border-radius:8px;display:none;pointer-events:auto;user-select:text';
  el.innerHTML = '<div style="letter-spacing:.12em;color:#8fd3c8;margin-bottom:4px">MESURE (F2)</div><pre id="perf-text" style="margin:0;white-space:pre-wrap"></pre>'
    + '<div style="display:flex;gap:8px;margin-top:8px"><button id="perf-copy">Copier le rapport de performance</button><button id="perf-reset">RAZ</button></div>'
    + '<div id="perf-msg" style="margin-top:6px;color:#e6b86a;min-height:1.4em"></div>'
    + '<textarea id="perf-json" readonly style="display:none;width:100%;height:90px;margin-top:6px;font:11px monospace"></textarea>';
  document.body.appendChild(el);
  const $ = (id) => el.querySelector('#' + id);
  const text = $('perf-text'), msg = $('perf-msg'), ta = $('perf-json');
  let shown = false, timer = 0;

  function report() {
    const s = meter.summary(), c = getContext();
    const r = (x, d = 2) => Math.round(x * 10 ** d) / 10 ** d;
    return {
      report: 'estran-perf', version: 1, date: new Date().toISOString(),
      quality: c.quality, moment: c.moment, seed: c.seed, tick: c.tick, url: location.search,
      resolution: { css: [innerWidth, innerHeight], pixelRatio: c.pixelRatio, buffer: [c.bufferW, c.bufferH] },
      gpu: c.gpu, userAgent: navigator.userAgent, hardwareConcurrency: navigator.hardwareConcurrency || null,
      window: { frames: s.frames, note: 'derniers frames (max 600), partie en cours ; les temps sont des intervalles entre frames (vsync inclus), pas des temps GPU' },
      avgFps: r(s.avgFps, 1), avgFrameMs: r(s.avgFrameMs), p50FrameMs: r(s.p50FrameMs), p95FrameMs: r(s.p95FrameMs), p99FrameMs: r(s.p99FrameMs),
      maxFrameMs: r(s.maxFrameMs), hitchesOver33ms: s.hitches33ms, cpuDrawAvgMs: r(s.cpuDrawAvgMs), cpuDrawP95Ms: r(s.cpuDrawP95Ms),
      drawCalls: c.drawCalls, triangles: c.triangles, geometries: c.geometries, textures: c.textures,
      jsHeapMB: c.heapMB,
    };
  }
  function refresh() {
    const rep = report();
    text.textContent = `${rep.quality}  ${rep.moment}  ${rep.resolution.buffer.join('x')}\n`
      + `cadence moyenne   ${rep.avgFps.toFixed(1)} i/s\n`
      + `frame moyenne     ${rep.avgFrameMs.toFixed(1)} ms\n`
      + `95e centile       ${rep.p95FrameMs.toFixed(1)} ms\n`
      + `pire frame        ${rep.maxFrameMs.toFixed(1)} ms\n`
      + `appels de dessin  ${rep.drawCalls}\n`
      + `triangles         ${rep.triangles}\n`
      + `JS dessin (moy)   ${rep.cpuDrawAvgMs.toFixed(2)} ms`;
  }
  async function copy() {
    const json = JSON.stringify(report(), null, 2);
    ta.value = json;
    try { await navigator.clipboard.writeText(json); msg.textContent = 'Rapport copié.'; ta.style.display = 'none'; }
    catch {
      try { ta.style.display = 'block'; ta.select(); msg.textContent = document.execCommand('copy') ? 'Rapport copié.' : 'Copie bloquée : sélectionnez le texte ci-dessous (Ctrl+C).'; }
      catch { msg.textContent = 'Copie bloquée : sélectionnez le texte ci-dessous (Ctrl+C).'; }
    }
    setTimeout(() => { msg.textContent = ''; }, 4000);
  }
  $('perf-copy').addEventListener('click', copy);
  $('perf-reset').addEventListener('click', () => { meter.reset(); msg.textContent = 'Compteurs remis à zéro.'; });
  function show(b) {
    shown = b; el.style.display = b ? 'block' : 'none';
    clearInterval(timer); if (b) { refresh(); timer = setInterval(refresh, 500); }
  }
  show(visible);
  return { toggle: () => show(!shown), isShown: () => shown, report };
}
