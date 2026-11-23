import test from 'node:test';
import assert from 'node:assert/strict';
import { data } from './helpers.js';
import { createTide, createBands } from '../../src/sim/tide.js';

const tide = createTide(data.tide);
const bands = createBands(data.bands);

test('tide: values come from maree.csv (no hard-coded level)', () => {
  assert.equal(tide.duration, 480);
  assert.equal(tide.levelAt(0), -0.6);
  assert.equal(tide.levelAt(240), 2.4);
  assert.equal(tide.levelAt(480), -0.6);
  assert.equal(tide.levelAt(-5), -0.6);
  assert.equal(tide.levelAt(900), -0.6);
});

test('tide: linear interpolation between rows', () => {
  assert.ok(Math.abs(tide.levelAt(65) - (-0.085)) < 1e-9);
  assert.ok(Math.abs(tide.levelAt(235) - 2.395) < 1e-9);
});

test('tide: stays within [-0.60, 2.40] and matches the control formula within 1 cm', () => {
  for (let t = 0; t <= 480; t += 0.5) {
    const l = tide.levelAt(t), f = 0.9 - 1.5 * Math.cos((2 * Math.PI * t) / 480);
    assert.ok(l >= -0.6 - 1e-9 && l <= 2.4 + 1e-9);
    assert.ok(Math.abs(l - f) <= 0.011, `t=${t} table=${l} formula=${f}`);
  }
});

test('tide: trend rises, slackens at high water, then falls', () => {
  assert.equal(tide.trendAt(30), 1);
  assert.equal(tide.trendAt(240), 0);
  assert.equal(tide.trendAt(300), -1);
  assert.equal(tide.phaseAt(100), 'flot');
});

test('bands: classification follows maree_effets.csv boundaries', () => {
  const id = (d) => bands.classify(d).id;
  assert.equal(id(-3), 'zone_seche');
  assert.equal(id(-0.25), 'berge');
  assert.equal(id(0.149), 'berge');
  assert.equal(id(0.15), 'gue');
  assert.equal(id(0.6), 'eau_profonde');
  assert.equal(id(1.1), 'eau_haute');
  assert.equal(id(1.4), 'submersion');
  assert.equal(id(50), 'submersion');
  assert.equal(bands.classify(0.7).runAllowed, false);
  assert.equal(bands.classify(-1).safeFromThreat, true);
  assert.equal(bands.byId('submersion').drownTimerS, 8);
});
