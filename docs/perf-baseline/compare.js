// Compare new Lighthouse JSON runs against the pre-redesign baseline.
// Usage: node docs/perf-baseline/compare.js mobile  after-mobile-1.json after-mobile-2.json ...
//        node docs/perf-baseline/compare.js desktop after-desktop-1.json ...
// Produce runs with: lighthouse <url> --output=json --output-path=after-mobile-1.json [--preset=desktop]
const fs = require('fs');
const path = require('path');

const [formFactor, ...files] = process.argv.slice(2);
if (!['mobile', 'desktop'].includes(formFactor) || files.length === 0) {
  console.error('Usage: node compare.js <mobile|desktop> run1.json [run2.json ...]');
  process.exit(1);
}

const base = JSON.parse(fs.readFileSync(path.join(__dirname, 'baseline.json')))[formFactor];

const pick = (r) => {
  const a = r.audits;
  return {
    perf: Math.round(r.categories.performance.score * 100),
    accessibility: Math.round(r.categories.accessibility.score * 100),
    bestPractices: Math.round(r.categories['best-practices'].score * 100),
    seo: Math.round(r.categories.seo.score * 100),
    ttfbMs: Math.round(a['server-response-time'].numericValue),
    fcpS: +(a['first-contentful-paint'].numericValue / 1000).toFixed(2),
    lcpS: +(a['largest-contentful-paint'].numericValue / 1000).toFixed(2),
    speedIndexS: +(a['speed-index'].numericValue / 1000).toFixed(2),
    tbtMs: Math.round(a['total-blocking-time'].numericValue),
    cls: +a['cumulative-layout-shift'].numericValue.toFixed(3),
    ttiS: +(a['interactive'].numericValue / 1000).toFixed(2),
    totalKB: Math.round(a['total-byte-weight'].numericValue / 1024),
    requests: a['network-requests'].details.items.length,
  };
};

const runs = files.map((f) => pick(JSON.parse(fs.readFileSync(f))));
const median = (k) => {
  const v = runs.map((r) => r[k]).sort((x, y) => x - y);
  const m = Math.floor(v.length / 2);
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
};

const higherIsBetter = new Set(['perf', 'accessibility', 'bestPractices', 'seo']);
const rows = Object.keys(base).map((k) => {
  const after = median(k);
  const delta = +(after - base[k]).toFixed(3);
  const better = higherIsBetter.has(k) ? delta > 0 : delta < 0;
  return { metric: k, baseline: base[k], after, delta, verdict: delta === 0 ? '=' : better ? 'better' : 'WORSE' };
});
console.log(`${formFactor}: median of ${runs.length} run(s) vs baseline`);
console.table(rows);
