import test from 'node:test';
import assert from 'node:assert/strict';
import { percentile, createPerfMeter } from '../../src/render/perfstats.js';
import { QUALITY, MOMENTS, blendMoments, qualityFromUrl, momentFromUrl } from '../../src/render/quality.js';

test('percentile: interpolates, handles empty and extreme values', () => {
  assert.equal(percentile([], 95), 0);
  assert.equal(percentile([5], 95), 5);
  assert.equal(percentile([1, 2, 3, 4, 5], 50), 3);
  assert.equal(percentile([1, 2, 3, 4, 5], 100), 5);
  assert.equal(percentile([10, 20], 50), 15);
  const v = Array.from({ length: 100 }, (_, i) => i + 1);
  assert.ok(Math.abs(percentile(v, 95) - 95.05) < 1e-9);
});

test('perf meter: average rate, p95, hitches; ignores gaps over one second; rolling window', () => {
  const m = createPerfMeter(100);
  for (let i = 0; i < 95; i++) m.record(16.6667, 2);
  for (let i = 0; i < 5; i++) m.record(50, 4);
  m.record(5000, 9); // hidden tab: ignored
  const s = m.summary();
  assert.equal(s.frames, 100);
  assert.ok(Math.abs(s.avgFrameMs - (95 * 16.6667 + 250) / 100) < 1e-6);
  assert.ok(s.p95FrameMs >= 16.6 && s.p95FrameMs <= 50);
  assert.equal(s.hitches33ms, 5);
  assert.equal(s.maxFrameMs, 50);
  m.record(10, 1); // 101st frame: the oldest one drops out
  assert.equal(m.summary().frames, 100);
  assert.equal(m.summary().framesTotal, 101);
  m.reset();
  assert.equal(m.summary().frames, 0);
  assert.equal(m.summary().avgFps, 0);
});

test('quality levels: three of them, URL parsing, monotonic cost, fog never depends on the level', () => {
  assert.deepEqual(Object.keys(QUALITY).sort(), ['high', 'low', 'medium']);
  assert.equal(qualityFromUrl('?q=low'), 'low');
  assert.equal(qualityFromUrl('?q=medium'), 'medium');
  assert.equal(qualityFromUrl('?q=bogus'), 'high');
  assert.equal(qualityFromUrl(''), 'high');
  for (const k of ['pixelRatioMax', 'rockDetail', 'waterOctaves', 'beamSegments', 'laisseRadial', 'laisseTendrils']) {
    assert.ok(QUALITY.low[k] <= QUALITY.medium[k] && QUALITY.medium[k] <= QUALITY.high[k], k);
  }
  // Settings that decide what can be seen of the threat are not part of the quality table.
  for (const q of Object.values(QUALITY)) assert.ok(!('fog' in q) && !('rocks' in q) && !('lampIntensity' in q));
  assert.equal(momentFromUrl('?moment=dawn'), 'dawn');
  assert.equal(momentFromUrl('?moment=zzz'), 'night');
});

test('lighting moments follow the GDD 12 brief and blend field by field', () => {
  assert.equal(MOMENTS.night.bg, 0x101c2a); assert.equal(MOMENTS.night.fog, 0.018);
  assert.equal(MOMENTS.dawn.bg, 0x6e7c8c); assert.equal(MOMENTS.dawn.fog, 0.012);
  assert.equal(MOMENTS.day.bg, 0x8a9499); assert.equal(MOMENTS.day.fog, 0.010);
  assert.equal(MOMENTS.night.beam, 1); assert.equal(MOMENTS.dawn.beam, 0); assert.equal(MOMENTS.day.beam, 0);
  assert.deepEqual(Object.keys(MOMENTS.dawn), Object.keys(MOMENTS.night));
  assert.deepEqual(Object.keys(MOMENTS.day), Object.keys(MOMENTS.night));
  const a = blendMoments(MOMENTS.night, MOMENTS.dawn, 0), b = blendMoments(MOMENTS.night, MOMENTS.dawn, 1), h = blendMoments(MOMENTS.night, MOMENTS.dawn, 0.5);
  assert.equal(a.bg, MOMENTS.night.bg); assert.equal(b.bg, MOMENTS.dawn.bg); assert.equal(b.fog, MOMENTS.dawn.fog);
  assert.ok(Math.abs(h.fog - 0.015) < 1e-9);
  assert.ok(h.bg > MOMENTS.night.bg && h.bg < MOMENTS.dawn.bg);
});
