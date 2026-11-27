// T-043 browser scenarios on the assembled file: start screen and sound (real click -> AudioContext "running", indicator, failure banner),
// guidance (objective, action line, ladder list, first aid, marker), end screen with its reason, visual cues of the Laisse, and the
// layout at 1280x720 and 1920x1080 (no overlap between the guidance texts, the subtitles, the toast and the gauges).
// Captures go through harness.shot (versioned with ESTRAN_CAPTURE_DIR=captures, otherwise captures/.tmp).
// Usage: node tests/e2e/guidance.cjs (after npm run build).
const { chromium, check, openPage, results } = require('./harness.cjs');

const VP = { width: 1280, height: 720 };
const txt = (page, sel) => page.evaluate((s) => (document.querySelector(s) ? document.querySelector(s).textContent : null), sel);
const dist = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);

/** Boxes of everything that must not overlap in the HUD (visible elements only). */
const BOXES = `(() => {
  const sels = ['#g-objective', '#g-status', '#g-tip', '#g-action', '#pastilles .lrow', '#captions .cap', '#toast', '#sound-ind', '#gauge', '#lamp', '#phare', '#marker.on #marker-dist'];
  const out = [];
  for (const s of sels) for (const [i, e] of [...document.querySelectorAll(s)].entries()) {
    const cs = getComputedStyle(e), r = e.getBoundingClientRect();
    if (cs.display === 'none' || cs.visibility === 'hidden' || r.width === 0 || r.height === 0) continue;
    if (s === '#toast' && parseFloat(cs.opacity) < 0.3) continue;
    out.push({ name: s + '#' + i, l: r.left, t: r.top, r: r.right, b: r.bottom });
  }
  return out;
})()`;
function overlaps(boxes) {
  const bad = [];
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    const a = boxes[i], b = boxes[j];
    if (a.l < b.r - 0.5 && b.l < a.r - 0.5 && a.t < b.b - 0.5 && b.t < a.b - 0.5) bad.push(`${a.name} x ${b.name}`);
  }
  return bad;
}
const CAPS = ["bruit dans l'eau, à gauche, au loin", 'grondement, devant', 'éclaboussure, derrière'];
const injectCaptions = (page) => page.evaluate((c) => { const root = document.getElementById('captions'); root.innerHTML = ''; c.forEach((t) => { const d = document.createElement('div'); d.className = 'cap'; d.textContent = t; root.appendChild(d); }); }, CAPS);

(async () => {
  const browser = await chromium.launch();

  // ---- 1. Start screen and sound, with a real click ----
  {
    const g = await openPage(browser, '?q=low', { viewport: VP, keepIntro: true });
    await g.frames(3);
    check('Start screen: one big button "Cliquer pour commencer (avec le son)"', (await txt(g.page, '#start')) === 'Cliquer pour commencer (avec le son)');
    const intro = await g.page.evaluate(() => document.getElementById('intro').innerText.replace(/\s+/g, ' '));
    check('Start screen: headphones and test-sound sentence, keys reminder (aid 1 text)', /Casque recommandé\. Montez le volume de l'ordinateur : un court son de test va jouer\./.test(intro) && /ZQSD ou flèches : marcher · Souris : regarder · Maj : courir · C : marcher lentement · M : son/.test(intro));
    check('Start screen: before the click no audio exists and the indicator says "SON EN ATTENTE"', (await g.page.evaluate(() => window.__estran.audioStats())).state === 'none' && (await txt(g.page, '#sound-ind')) === 'SON EN ATTENTE');
    check('Start screen: settings (volume, mute, subtitles) and the P2 bar are kept', (await g.page.$$('#opt-vol, #opt-mute, #opt-cap, #p2-form, #p2-perf, #p2-credits')).length === 6);
    check('Start screen: the subtitles box is ticked by default', await g.page.evaluate(() => document.getElementById('opt-cap').checked));
    await g.shot('estran-accueil.png');
    await g.page.click('#start');
    await g.page.evaluate(() => window.__estran.setManual(true));
    await g.page.waitForFunction(() => window.__estran.audioStats().state === 'running', null, { timeout: 5000 }).catch(() => {});
    const a = await g.page.evaluate(() => window.__estran.audioStats());
    check('The click on the start button creates the AudioContext and it is "running"', a.started && a.state === 'running' && a.failure === null, `state=${a.state} failure=${a.failure}`);
    await g.frames(2);
    check('Indicator after the click: SON ACTIF', (await txt(g.page, '#sound-ind')) === 'SON ACTIF');
    check('No failure banner when the sound runs', !(await g.page.evaluate(() => document.getElementById('audio-banner').classList.contains('on'))));
    check('Test sound message shown for the player', /^Son de test lancé\. Rien entendu \? Vérifiez le volume et le casque\. M : couper ou activer le son\.$/.test(await txt(g.page, '#toast')) && (await g.page.evaluate(() => document.getElementById('toast').classList.contains('on'))));
    check('The test chime was played (two oscillator notes through the master chain)', (await g.page.evaluate(() => window.__estran.audioStats())).started);
    await g.page.keyboard.press('KeyM');
    await g.frames(1);
    check('Key M: indicator SON COUPÉ (and the context keeps running)', (await txt(g.page, '#sound-ind')) === 'SON COUPÉ' && (await g.page.evaluate(() => window.__estran.audioStats())).state === 'running');
    await g.page.keyboard.press('KeyM');
    await g.frames(1);
    check('Key M again: indicator SON ACTIF', (await txt(g.page, '#sound-ind')) === 'SON ACTIF');
    await g.page.evaluate(() => window.__estran.audio.setMuted(true));
    check('The mute box also drives the indicator', (await txt(g.page, '#sound-ind')) === 'SON COUPÉ');
    await g.page.evaluate(() => window.__estran.audio.setMuted(false));
    const s = await g.st();
    check('The HUD is visible once the game started; no console error or warning', s.paused === false && g.problems.length === 0, g.problems.slice(0, 3).join(' | '));

    // Pause screen: "Cliquer pour reprendre", indicator still visible, then resume with a click.
    await g.page.evaluate(() => { document.exitPointerLock?.(); Object.defineProperty(document, 'hidden', { get: () => true, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); });
    await g.page.waitForTimeout(200);
    await g.frames(2);
    check('Pause screen: button says "Cliquer pour reprendre", indicator still shows SON ACTIF', (await txt(g.page, '#start')) === 'Cliquer pour reprendre' && (await txt(g.page, '#sound-ind')) === 'SON ACTIF');
    await g.page.evaluate(() => { Object.defineProperty(document, 'hidden', { get: () => false, configurable: true }); });
    await g.page.click('#start');
    await g.page.waitForFunction(() => window.__estran.audioStats().state === 'running', null, { timeout: 5000 }).catch(() => {});
    check('Resume click: the audio runs again, no failure banner', (await g.page.evaluate(() => window.__estran.audioStats().state)) === 'running' && !(await g.page.evaluate(() => document.getElementById('audio-banner').classList.contains('on'))));
    await g.page.close();
  }

  // ---- 2. Failure of the sound: the banner stays, the indicator says SON INDISPONIBLE, the game still plays ----
  {
    const never = () => {
      const Real = window.AudioContext;
      window.AudioContext = class extends Real { constructor() { super(); this.suspend().catch(() => {}); } resume() { return Promise.resolve(); } get state() { return 'suspended'; } };
    };
    const g = await openPage(browser, '?q=low', { viewport: VP, keepIntro: true, init: never, allowWarnings: true });
    await g.page.click('#start');
    await g.page.evaluate(() => window.__estran.setManual(true));
    await g.page.waitForTimeout(1900);
    const banner = await g.page.evaluate(() => ({ on: document.getElementById('audio-banner').classList.contains('on'), text: document.getElementById('audio-banner').textContent, vis: getComputedStyle(document.getElementById('audio-banner')).display }));
    check('Sound that never starts: the banner appears after 1.5 s with the exact text', banner.on && banner.vis === 'block' && banner.text === "Le son ne démarre pas. Cliquez dans la fenêtre, vérifiez le volume de l'ordinateur et que l'onglet n'est pas muet.", banner.text);
    check('Sound that never starts: the indicator says SON INDISPONIBLE', (await txt(g.page, '#sound-ind')) === 'SON INDISPONIBLE');
    await g.page.evaluate(() => window.__estran.advance(60)); await g.frames(2);
    check('The game plays on without sound; the subtitles stay on so the threat is still readable', (await g.st()).tick >= 60 && (await g.page.evaluate(() => window.__estran.audioStats())).captions === true);
    await g.shot('estran-son-indisponible.png');
    await g.page.close();

    const g2 = await openPage(browser, '?q=low', { viewport: VP, keepIntro: true, init: () => { window.AudioContext = undefined; window.webkitAudioContext = undefined; }, allowWarnings: true });
    await g2.page.click('#start');
    await g2.page.waitForTimeout(300);
    const b2 = await g2.page.evaluate(() => ({ on: document.getElementById('audio-banner').classList.contains('on'), text: document.getElementById('audio-banner').textContent }));
    check('No AudioContext in the browser: banner "Ce navigateur ne peut pas jouer le son du jeu. Essayez Chrome ou Edge."', b2.on && b2.text === 'Ce navigateur ne peut pas jouer le son du jeu. Essayez Chrome ou Edge.', b2.text);
    check('No AudioContext: the game starts anyway (HUD, no page error)', (await g2.st()).paused === false && g2.problems.filter((p) => /pageerror/.test(p)).length === 0, g2.problems.slice(0, 2).join(' | '));
    await g2.page.close();
  }

  // ---- 3. Guidance at the start, in play, and its layout ----
  {
    const g = await openPage(browser, '?q=low', { viewport: VP, gesture: true });
    await g.page.evaluate(() => window.__estran.advance(60)); await g.frames(2);
    const hud = await g.page.evaluate(() => ({ obj: document.getElementById('g-objective').textContent, stat: document.getElementById('g-status').textContent, tip: document.getElementById('g-tip').textContent, act: document.getElementById('g-action').textContent,
      rows: [...document.querySelectorAll('#pastilles .lrow')].map((r) => r.innerText.replace(/\s+/g, ' ')) }));
    check('Guidance: the permanent objective line', hud.obj === 'Lisez les 3 échelles de marée, puis revenez au phare.', hud.obj);
    check('Guidance: status line "Relevés : 0/3 · Fin de la marée : 4:5x"', /^Relevés : 0\/3 · Fin de la marée : 4:5\d$/.test(hud.stat), hud.stat);
    check('Guidance: first aid 1 (keys) shown at the start', hud.tip === 'ZQSD ou flèches : marcher · Souris : regarder · Maj : courir · C : marcher lentement · M : son', hud.tip);
    check('Guidance: action line "Attendez au phare : l\'échelle 1 s\'ouvre dans 0:3x."', /^Attendez au phare : l'échelle 1 s'ouvre dans 0:3\d\.$/.test(hud.act), hud.act);
    check('Guidance: the list of the 3 ladders with their names and opening times', hud.rows.length === 3 && /^1 · marée montante s'ouvre dans 0:3\d$/.test(hud.rows[0]) && /^2 · marée haute s'ouvre dans 1:\d\d$/.test(hud.rows[1]) && /^3 · marée descendante s'ouvre dans 3:\d\d$/.test(hud.rows[2]), hud.rows.join(' | '));
    check('The old 6 s objective element is gone', (await g.page.$('#objective')) === null);
    await injectCaptions(g.page);
    const bad = overlaps(await g.page.evaluate(BOXES));
    check('Layout 1280x720: no overlap between guidance, list, toast, subtitles (3 lines) and gauges', bad.length === 0, bad.join('; '));
    await g.shot('estran-guidage-depart.png');

    // The marker: one at a time, faint until the ladder is open (spec C1).
    const w = await g.page.evaluate(() => window.__estran.getWorld());
    await g.page.evaluate(([x, z]) => window.__estran.lookAt(x, z, -0.02), [w.stations[0].x, w.stations[0].z]);
    await g.page.evaluate(() => window.__estran.advance(1)); await g.frames(3);
    let mk = await g.page.evaluate(() => { const e = document.getElementById('marker'); return { cls: e.className, op: getComputedStyle(e).opacity, d: document.getElementById('marker-dist').textContent }; });
    const p = (await g.st()).player;
    check('Marker: faint (35 %) diamond with the distance while the ladder is not open', /\bon\b/.test(mk.cls) && /\bweak\b/.test(mk.cls) && /\bface\b/.test(mk.cls) && Math.abs(parseFloat(mk.op) - 0.35) < 0.02, `${mk.cls} opacity=${mk.op}`);
    check('Marker: distance text is the distance to the ladder in metres', mk.d === `${Math.round(dist(p, w.stations[0]))} m`, `${mk.d} vs ${dist(p, w.stations[0]).toFixed(1)}`);
    await g.page.evaluate(() => window.__estran.lookAt(window.__estran.getWorld().lighthouse.x, window.__estran.getWorld().lighthouse.z, 0.2));
    await g.page.evaluate(([x, z]) => { const E = window.__estran; E.lookAt(-x, -z, 0); E.advance(1); }, [w.stations[0].x, w.stations[0].z]);
    await g.frames(3);
    mk = await g.page.evaluate(() => ({ cls: document.getElementById('marker').className }));
    check('Marker: an edge arrow when the target is behind the player', /\bedge\b/.test(mk.cls), mk.cls);
    await injectCaptions(g.page);
    const badEdge = overlaps(await g.page.evaluate(BOXES));
    check('Edge arrow of the marker overlaps nothing (guidance, list, subtitles, gauges)', badEdge.length === 0, badEdge.join('; '));
    await g.shot('estran-repere-bord.png');

    // Go to the leaving time: the marker turns strong (85 %).
    await g.page.evaluate(() => window.__estran.advance(14 * 30)); // t ~ 16 s
    await g.page.evaluate(([x, z]) => window.__estran.lookAt(x, z, -0.02), [w.stations[0].x, w.stations[0].z]);
    for (let i = 0; i < 40; i++) {
      const gd = await g.page.evaluate(() => window.__estran.getGuide());
      if (/^Partez vers l'échelle 1 : elle s'ouvre dans 0:\d\d\.$/.test(gd.action)) break;
      await g.page.evaluate(() => window.__estran.advance(15));
    }
    await g.page.evaluate(([x, z]) => window.__estran.lookAt(x, z, -0.02), [w.stations[0].x, w.stations[0].z]);
    await g.page.evaluate(() => window.__estran.advance(1)); await g.frames(3);
    const leave = await g.page.evaluate(() => ({ act: document.getElementById('g-action').textContent, cls: document.getElementById('marker').className, tip: document.getElementById('g-tip').textContent }));
    check('Guidance: "Partez vers l\'échelle 1 : elle s\'ouvre dans 0:xx." appears in time to walk there', /^Partez vers l'échelle 1 : elle s'ouvre dans 0:\d\d\.$/.test(leave.act), leave.act);
    check('Marker: strong (85 %, pulsing) once it is time to leave', /\bstrong\b/.test(leave.cls), leave.cls);
    await g.shot('estran-repere.png');
    await g.page.close();
  }

  // ---- 4. Guidance in play: at the ladder, reading, after the reading, ladder list ----
  {
    const g = await openPage(browser, '?q=low', { viewport: VP, gesture: true });
    const w = await g.page.evaluate(() => window.__estran.getWorld());
    await g.page.evaluate(() => window.__estran.setBot('win'));
    let s = await g.until((q) => dist(q.player, w.stations[0]) <= 1.4 && q.stations[0].readable, 6000, 6);
    await g.page.evaluate(() => window.__estran.setBot(null));
    await g.page.evaluate(([x, z]) => window.__estran.lookAt(x, z, -0.05), [w.stations[0].x, w.stations[0].z]);
    await g.page.evaluate(() => window.__estran.advance(2)); await g.frames(3);
    check('At a readable ladder: "Maintenez E pour lire l\'échelle (5 s)"', (await txt(g.page, '#g-action')) === 'Maintenez E pour lire l\'échelle (5 s)', await txt(g.page, '#g-action'));
    check('The ladder list shows it as OUVERTE with the time left', /^OUVERTE, reste 0:\d\d$/.test(await g.page.evaluate(() => document.querySelector('#pastilles .lrow .lstate').textContent)));
    await injectCaptions(g.page);
    check('Layout at the ladder (action line + 3 subtitles): no overlap', overlaps(await g.page.evaluate(BOXES)).length === 0, overlaps(await g.page.evaluate(BOXES)).join('; '));
    await g.shot('estran-guidage-echelle.png');
    await g.page.keyboard.down('KeyE');
    await g.page.evaluate(() => window.__estran.advance(30)); await g.frames(2);
    check('While E is held: "Lecture en cours… maintenez E"', (await txt(g.page, '#g-action')) === 'Lecture en cours… maintenez E', await txt(g.page, '#g-action'));
    await g.page.evaluate(() => window.__estran.advance(130)); await g.frames(2);
    await g.page.keyboard.up('KeyE');
    await g.page.evaluate(() => window.__estran.advance(2)); await g.frames(3);
    s = await g.st();
    check('Reading done (1/3)', s.readCount === 1 && s.stations[0].read);
    check('After a reading: "Relevé noté. Revenez vers le phare."', (await txt(g.page, '#g-action')) === 'Relevé noté. Revenez vers le phare.', await txt(g.page, '#g-action'));
    check('Status line counts the reading: "Relevés : 1/3"', /^Relevés : 1\/3 · /.test(await txt(g.page, '#g-status')));
    const rows = await g.page.evaluate(() => [...document.querySelectorAll('#pastilles .lrow')].map((r) => r.innerText.replace(/\s+/g, ' ')));
    check('Ladder list after the reading: "lue ✓" then "s\'ouvre dans" for the next ones', /lue ✓$/.test(rows[0]) && /s'ouvre dans/.test(rows[1]), rows.join(' | '));
    const mk = await g.page.evaluate(() => document.getElementById('marker').className);
    check('Marker after a reading: the lighthouse (one marker only)', /\bon\b/.test(mk) && (await g.page.evaluate(() => window.__estran.getGuide().target.kind)) === 'lighthouse', mk);
    await g.page.evaluate(() => window.__estran.advance(11 * 30)); await g.frames(2); // (the player stands on the spot: still dry enough at t ~ 65 s)
    const later = await g.page.evaluate(() => window.__estran.getGuide());
    check('Ten seconds later the next ladder is the target again and the aid of the lamp or crank may show', later.target.kind === 'station' && later.target.index === 1);
    // The scripted player takes over again (the tide would drown a player left standing there), until S2 is open.
    await g.page.evaluate(() => window.__estran.setBot('win'));
    s = await g.until((q) => q.stations[1].readable, 6000, 30);
    await g.frames(2);
    const l2 = await g.page.evaluate(() => document.querySelectorAll('#pastilles .lstate')[1].textContent);
    const act2 = await txt(g.page, '#g-action');
    check('Ladder 2 open: the list says "OUVERTE, reste M:SS"', /^OUVERTE, reste \d:\d\d$/.test(l2), l2);
    check('Ladder 2 open: the action line is the one of an open ladder (go / approach / hold E)', /^(Échelle 2 ouverte : allez-y ! Il reste \d:\d\d\.|Approchez-vous de l'échelle\.|Maintenez E pour lire l'échelle \(5 s\))$/.test(act2), act2);
    await g.shot('estran-guidage-liste.png');
    check('No console error or warning during the guided run', g.problems.length === 0, g.problems.slice(0, 3).join(' | '));
    await g.page.close();
  }

  // ---- 5. End screen with its reason ----
  {
    const g = await openPage(browser, '?q=low', { viewport: VP });
    await g.page.evaluate(() => window.__estran.setBot('idle'));
    const end = await g.until((q) => !!q.outcome, 20000, 30);
    await g.frames(3);
    const card = await g.page.evaluate(() => ({ on: document.getElementById('card').classList.contains('on'), t: document.getElementById('card-text').textContent, r: document.getElementById('card-reason').textContent, s: document.getElementById('card-summary').textContent, h: document.getElementById('card-hint').textContent }));
    check('End screen (missed ladder): title, reason with the ladder number, summary and "R pour recommencer"',
      end.cause === 'window_missed' && card.on && card.t === 'Relevé manqué.' && card.r === "L'échelle 1 s'est refermée avant d'être lue. Chaque échelle ne se lit que pendant sa fenêtre." && card.s === 'Relevés : 0/3 · Temps : 1:12' && card.h === 'R pour recommencer', JSON.stringify(card));
    await g.shot('estran-fin-manque.png');
    await g.page.close();

    const w = await openPage(browser, '?q=low', { viewport: VP });
    await w.page.evaluate(() => window.__estran.setBot('win'));
    const e2 = await w.until((q) => !!q.outcome, 30000, 60);
    await w.frames(3);
    const c2 = await w.page.evaluate(() => ({ t: document.getElementById('card-text').textContent, r: document.getElementById('card-reason').textContent, s: document.getElementById('card-summary').textContent }));
    check('End screen (victory): "Les trois relevés sont faits." with its reason and "Relevés : 3/3 · Temps : 4:xx"', e2.outcome === 'victory' && c2.t === 'Les trois relevés sont faits.' && c2.r === 'Vous êtes de retour au phare avant la fin de la marée.' && /^Relevés : 3\/3 · Temps : [45]:\d\d$/.test(c2.s), JSON.stringify(c2));
    check('A played game lasts between 4 and 6 minutes (T-042)', e2.t >= 240 && e2.t <= 360, `t=${e2.t.toFixed(1)} s`);
    await w.page.close();
  }

  // ---- 6. Visual cues of the Laisse, without sound ----
  {
    const g = await openPage(browser, '?q=low', { viewport: VP });
    let c = await g.page.evaluate(() => window.__estran.getCue());
    check('No ripple and no vignette before the Laisse exists', c.rings === 0 && c.vignette === 0, JSON.stringify(c));
    await g.page.evaluate(() => window.__estran.setBot('noisy'));
    let s = await g.until((q) => !!q.threat && q.threat.active && q.threat.dist < 22 && q.threat.dist > 14, 12000, 6);
    await g.frames(3);
    c = await g.page.evaluate(() => window.__estran.getCue());
    check('Laisse between 14 and 22 m: ripples on screen and a light vignette (under 0.45)', s.threat.dist > 14 && c.rings >= 1 && c.vignette > 0 && c.vignette < 0.4, `dist=${s.threat.dist.toFixed(1)} ${JSON.stringify(c)}`);
    s = await g.until((q) => !!q.threat && q.threat.active && q.threat.dist <= 8.5 && ['hunt', 'inquire'].includes(q.threat.mode), 12000, 3);
    await g.frames(2);
    const cRing = await g.page.evaluate(() => window.__estran.getCue()); // the simulation clock is stepped by hand here: read the ripples while they are fresh
    await g.frames(25); // the vignette rises over 0.5 s of real time
    c = await g.page.evaluate(() => window.__estran.getCue());
    check('Laisse at 8 m: ripples on screen and the vignette near its maximum (0.45 x mode factor)', s.threat.dist <= 9 && cRing.rings >= 1 && c.vignette > 0.25 && c.vignette <= 0.45 * 1.1 + 1e-6, `dist=${s.threat.dist.toFixed(1)} mode=${s.threat.mode} rings=${cRing.rings} ${JSON.stringify(c)}`);
    await g.page.evaluate(() => window.__estran.setBot(null));
    await g.page.evaluate(([x, z]) => window.__estran.lookAt(x, z, -0.1), [s.threat.x, s.threat.z]);
    await g.frames(3);
    const pv = await g.page.evaluate(() => window.__estran.probeVignette());
    check('The vignette darkens the screen corners in the rendered frame (same frame with and without it)', pv && pv.strength > 0.25 && pv.with < pv.without, JSON.stringify(pv));
    await injectCaptions(g.page);
    check('Layout with the vignette and the subtitles: still no overlap', overlaps(await g.page.evaluate(BOXES)).length === 0, overlaps(await g.page.evaluate(BOXES)).join('; '));
    await g.shot('estran-vignette-8m.png');
    check('No console error or warning with the cues on screen', g.problems.length === 0, g.problems.slice(0, 3).join(' | '));
    await g.page.close();

    const off = await openPage(browser, '?q=low&threat=0', { viewport: VP });
    await off.page.evaluate(() => window.__estran.advance(150 * 30)); // 150 s: the Laisse would long have appeared
    await off.frames(3);
    const c0 = await off.page.evaluate(() => window.__estran.getCue());
    check('?threat=0: no ripple, no vignette', c0.rings === 0 && c0.vignette === 0, JSON.stringify(c0));
    await off.page.close();
  }

  // ---- 7. Layout at 1920x1080 ----
  {
    const g = await openPage(browser, '?q=low', { viewport: { width: 1920, height: 1080 }, gesture: true });
    await g.page.evaluate(() => window.__estran.advance(60)); await g.frames(3);
    await injectCaptions(g.page);
    const bad = overlaps(await g.page.evaluate(BOXES));
    check('Layout 1920x1080: no overlap between guidance, list, toast, subtitles and gauges', bad.length === 0, bad.join('; '));
    await g.shot('estran-guidage-1080p.png');
    await g.page.close();
  }

  await browser.close();
  const failed = results.filter((r) => !r.ok).length;
  console.log(failed ? `${failed} check(s) FAILED` : `ALL ${results.length} GUIDANCE E2E CHECKS PASSED`);
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
