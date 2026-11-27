// Scenarios on the ASSEMBLED P2 file (dist/estran-p2.html): single file, size, no network, licences, start screen,
// questionnaire and copy fallbacks, locked-frame behaviour (no dialogs, blocked storage), hooks hidden by default,
// one game played by a scripted player. Usage: node tests/e2e/p2.cjs (after npm run build).
const { chromium, check, results, openPage, base, root } = require('./harness.cjs');
const fs = require('node:fs');
const path = require('node:path');

const file = path.join(root, 'dist/estran-p2.html');
const driverNoise = /GL Driver Message .*GPU stall due to ReadPixels/;

function watch(page) {
  const w = { problems: [], requests: [], dialogs: [] };
  page.on('console', (m) => { if ((m.type() === 'error' || m.type() === 'warning') && !driverNoise.test(m.text())) w.problems.push(`${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => w.problems.push(`pageerror: ${e}`));
  page.on('request', (r) => { if (!/^(data|blob|about):/.test(r.url()) && r.url().split('#')[0].split('?')[0] !== 'file://' + file) w.requests.push(r.url()); });
  page.on('dialog', async (d) => { w.dialogs.push(d.type()); await d.dismiss(); });
  return w;
}

(async () => {
  // ---- 1. The file itself ----
  const html = fs.readFileSync(file, 'utf8');
  const size = fs.statSync(file).size;
  check('estran-p2.html is at most 1.5 MiB (single weight limit, docs/tech/BUDGETS.md)', size <= 1.5 * 1048576, `${(size / 1024).toFixed(0)} KiB`);
  check('Licence: "three.js authors" present in estran-p2.html', html.includes('three.js authors'));
  check('Licence: "Permission is hereby granted" present in estran-p2.html', html.includes('Permission is hereby granted'));
  const lic = fs.readFileSync(path.join(root, 'node_modules/three/LICENSE'), 'utf8').trim();
  check('Licence: the full MIT text of node_modules/three/LICENSE is in the file', html.includes(lic.split('\n').slice(0, 3).join('\n')) && html.includes(lic.split('\n').slice(-3).join('\n')));
  check('File is self-contained: no external script, stylesheet, image or url()', !/<script[^>]+src=|<link[^>]+href=|<img[^>]+src=|@import|url\(\s*['"]?https?:/i.test(html));
  check('No alert, confirm or prompt call in the game sources', !fs.readdirSync(path.join(root, 'src'), { recursive: true }).filter((f) => f.endsWith('.js') && !f.includes('generated')).some((f) => /\b(?:window\.)?(?:alert|confirm|prompt)\s*\(/.test(fs.readFileSync(path.join(root, 'src', f), 'utf8'))));
  check('Expected answers of the questionnaire are not in the file', !/Réponses attendues|Idée-clé|idée-clé|comptabilisé pour la porte/i.test(html));

  const browser = await chromium.launch();

  // ---- 2. Start screen, hooks hidden, no network, blocked storage, blocked clipboard ----
  {
    const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
    const w = watch(page);
    // Locked frame: localStorage throws, the clipboard API and execCommand both refuse.
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('blocked', 'SecurityError'); } });
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('blocked')) } });
      document.execCommand = () => false;
    });
    await page.goto(base.replace('?test=1', ''));
    await page.waitForSelector('#intro:not(.hidden)');
    await page.waitForTimeout(1500);
    check('Hooks hidden by default: window.__estran is undefined without ?test=1', await page.evaluate(() => typeof window.__estran === 'undefined'));
    const intro = await page.evaluate(() => document.getElementById('intro').innerText);
    check('Start screen is in French and lists the keys', /Cliquer pour commencer \(avec le son\)/.test(intro) && /ZQSD/.test(intro) && /F2/.test(intro) && /Maj/.test(intro) && /\bM\b/.test(intro) && /\bK\b/.test(intro), JSON.stringify(intro.slice(0, 120)));
    check('Start screen has the 3 buttons (questionnaire, performance report, credits)', (await page.$$('#p2-form, #p2-perf, #p2-credits')).length === 3);
    check('Start screen gives the sound advice (headphones, volume, test sound) and never names the creature', /Casque recommandé/.test(intro) && /un court son de test va jouer/.test(intro) && !/Laisse|menace|monstre/i.test(intro), '');

    // Performance report button: copy blocked -> visible, selected text area with the JSON.
    await page.click('#p2-perf');
    await page.waitForTimeout(300);
    const perf = await page.evaluate(() => ({ shown: getComputedStyle(document.getElementById('p2-out')).display, v: document.getElementById('p2-out').value, msg: document.getElementById('p2-msg').textContent }));
    let rep = null; try { rep = JSON.parse(perf.v); } catch { /* checked below */ }
    check('Performance button: copy blocked -> text area shown with the JSON report and a message', perf.shown === 'block' && rep && rep.report === 'estran-perf' && /Copie bloquée/.test(perf.msg), perf.msg);
    check('Clicking the buttons did not start the game', await page.evaluate(() => !document.getElementById('intro').classList.contains('hidden')));

    // Questionnaire.
    await page.click('#p2-form');
    check('Questionnaire opens', await page.evaluate(() => document.getElementById('qform').classList.contains('on')));
    const nq = await page.evaluate(() => document.querySelectorAll('#qform fieldset').length);
    check('Questionnaire has the 3 one-word questions of the new try (T-043)', nq === 3, `fieldsets=${nq}`);
    const formText = await page.evaluate(() => document.getElementById('qform').innerText);
    check('Questionnaire wording: no expected answers, no claim that the beam covers the far ladders', !/Réponses attendues|idée-clé/i.test(formText) && !/repousse la chose|protège les échelles|partout/i.test(formText));
    // Typing letters that are game shortcuts (R, M, K, F) must not trigger anything.
    await page.check('input[name="f-Q1-a"][value="oui"]');
    await page.check('input[name="f-Q2-a"][value="un peu"]');
    await page.check('input[name="f-Q3-a"][value="pas compris"]');
    await page.click('#f-Q3-r');
    await page.keyboard.type('Rmkf mer ');
    await page.click('#qform-copy');
    await page.waitForTimeout(300);
    const out = await page.evaluate(() => ({ v: document.getElementById('qform-out').value, shown: getComputedStyle(document.getElementById('qform-out')).display, sel: document.getElementById('qform-out').selectionEnd - document.getElementById('qform-out').selectionStart }));
    check('Questionnaire copy (blocked clipboard): text area shown, selected, and holds the answers',
      out.shown === 'block' && out.sel === out.v.length && /Précisions : Rmkf mer/.test(out.v) && /Réponse : oui/.test(out.v) && /Réponse : un peu/.test(out.v) && /Réponse : pas compris/.test(out.v), '');
    check('The 3 questions are the ones of PORTE_P2.md; the copy button stays', ['1. Avez-vous entendu le son dès le début ?', '2. Avez-vous eu peur ou été inquiété ?', '3. Avez-vous joué jusqu\'à la fin ? Sinon, pourquoi ?'].every((q) => out.v.includes(q)) && (await page.$$('#qform-copy')).length === 1 && /Copier mes réponses/.test(await page.textContent('#qform-copy')));
    await page.click('#qform-copy');
    await page.waitForTimeout(200);
    await page.fill('#f-Q3-r', '');
    await page.check('input[name="f-Q1-a"][value="coupé"]');
    await page.click('#qform-copy');
    await page.waitForTimeout(200);
    const out2 = await page.evaluate(() => document.getElementById('qform-out').value);
    check('Unanswered fields are marked "(sans réponse)" and a changed answer is copied', /Précisions : \(sans réponse\)/.test(out2) && /Réponse : coupé/.test(out2));
    check('Typing in the form did not touch the game (still on the start screen, sound option unchanged)', await page.evaluate(() => !document.getElementById('intro').classList.contains('hidden') && !document.getElementById('opt-mute').checked));
    await page.click('#qform-back');
    check('Questionnaire closes', await page.evaluate(() => !document.getElementById('qform').classList.contains('on')));

    // Credits.
    await page.click('#p2-credits');
    await page.click('#credits summary');
    const cred = await page.evaluate(() => document.getElementById('credits').innerText);
    check('Credits screen shows three.js (MIT), "three.js authors" and the licence text', /three\.js \(licence MIT\)/.test(cred) && cred.includes('three.js authors') && cred.includes('Permission is hereby granted'));
    await page.click('#credits-back');

    // Clipboard that works: the message says copied.
    await page.evaluate(() => { Object.defineProperty(navigator, 'clipboard', { value: { writeText: (t) => { window.__copied = t; return Promise.resolve(); } }, configurable: true }); });
    await page.click('#p2-perf');
    await page.waitForTimeout(200);
    check('Performance button: working clipboard -> "Copié"', await page.evaluate(() => /^Copié/.test(document.getElementById('p2-msg').textContent)));

    check('No network request at load or while using the screens', w.requests.length === 0, w.requests.slice(0, 3).join(' | '));
    check('No alert / confirm / prompt dialog opened', w.dialogs.length === 0, w.dialogs.join());
    check('No console error or warning (storage and clipboard blocked)', w.problems.length === 0, w.problems.slice(0, 3).join(' | '));
    await page.close();
  }

  // ---- 3. A game played by a scripted player on the assembled file (hooks through ?test=1) ----
  {
    const g = await openPage(browser, '?q=low');
    const w = watch(g.page);
    await g.page.evaluate(() => window.__estran.setBot('win'));
    const end = await g.until((s) => !!s.outcome, 30000, 60);
    check('Assembled file: the scripted player plays a whole game (victory)', end.outcome === 'victory' && end.readCount === 3, `t=${end.t.toFixed(1)} s outcome=${end.outcome}`);
    await g.frames(2);
    check('Victory card shown in the assembled file', await g.page.evaluate(() => document.getElementById('card').classList.contains('on')));
    check('No network request during the game', w.requests.length === 0, w.requests.slice(0, 3).join(' | '));
    check('No console error or warning during the game', g.problems.length === 0 && w.problems.length === 0, g.problems.concat(w.problems).slice(0, 3).join(' | '));
    await g.page.close();
  }

  await browser.close();
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  process.exit(failed.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
