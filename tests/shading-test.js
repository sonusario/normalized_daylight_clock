// Day/night shading check: for 7 places (north, south, equator, both poles' polar day
// and night) at 5 moments, both main hand sets, snapped and smooth rate, 12- and 24-hour
// dials, every 3 minutes of the hour hand's next full turn is compared with the sun's altitude from an
// independent formula. Serve the repo (python3 -m http.server 8765) and run: node tests/shading-test.js
const { chromium } = require('playwright');
const LOCS = { 'New York': [40.71, -74.0], 'Sydney': [-33.87, 151.21], 'Longyearbyen': [78.22, 15.65], 'McMurdo': [-77.85, 166.67], 'Tromso': [69.65, 18.96], 'Ushuaia': [-54.8, -68.3], 'Quito': [-0.18, -78.47] };
const TIMES = ['2026-11-04T15:00:00Z', '2026-11-04T03:00:00Z', '2026-06-20T12:00:00Z', '2026-06-21T00:30:00Z', '2026-03-20T09:00:00Z'];
(async () => {
  const b = await chromium.launch();
  let fails = 0, total = 0, cases = 0;
  for (const [name, [lat, lon]] of Object.entries(LOCS)) for (const iso of TIMES) for (const filled of ['real', 'norm']) for (const smooth of [false, true]) for (const dial12 of [true, false]) {
    const p = await b.newPage({ viewport: { width: 700, height: 900 } });
    await p.addInitScript(([T, prefs]) => { const s = performance.now(); Date.now = () => T + (performance.now() - s);
      localStorage.setItem('daylightClock', JSON.stringify(prefs)); },
      [Date.parse(iso), { lat, lon, name, src: 'pick', prefs: 6, filled, smooth, dial12 }]);
    await p.goto((process.env.URL || 'http://localhost:8765/')); await p.waitForTimeout(500);
    const r = await p.evaluate(([lat, lon]) => {
      const D = window.__dlc, RAD = Math.PI / 180, DAY = 86400000;
      function elev(ms) {
        const jd = ms / DAY + 2440587.5, T = (jd - 2451545) / 36525;
        const L0 = ((280.46646 + T * 36000.76983) % 360 + 360) % 360, M = (357.52911 + T * 35999.05029) * RAD, e = 0.016708634;
        const C = Math.sin(M) * 1.914602 + Math.sin(2 * M) * 0.019993, lam = (L0 + C - 0.00569) * RAD, eps = 23.439 * RAD;
        const dec = Math.asin(Math.sin(eps) * Math.sin(lam)), y = Math.tan(eps / 2) ** 2, L = L0 * RAD;
        const eq = 4 / RAD * (y * Math.sin(2 * L) - 2 * e * Math.sin(M) + 4 * e * y * Math.sin(M) * Math.cos(2 * L));
        const utcMin = ((ms % DAY) + DAY) % DAY / 60000, ha = ((utcMin + eq + 4 * lon) / 4 - 180) * RAD;
        return Math.asin(Math.sin(lat * RAD) * Math.sin(dec) + Math.cos(lat * RAD) * Math.cos(dec) * Math.cos(ha)) / RAD;
      }
      const up = t => elev(t) > -0.833;
      const now = Date.now(), dial12 = document.getElementById('togDial').getAttribute('aria-pressed') === 'true';
      const half = dial12 ? 12 : 24, nf = D.filled === 'norm', F0 = nf ? D.dayHourAt(now) : now / 3.6e6;
      const timeAt = dh => { if (!nf) return now + dh * 3.6e6; let a = now - 2 * DAY, z = now + 2 * DAY; for (let k = 0; k < 60; k++) { const m = (a + z) / 2; if (D.dayHourAt(m) < F0 + dh) a = m; else z = m; } return (a + z) / 2; };
      const df = document.getElementById('dayFill'), nfl = document.getElementById('nightFill');
      let bad = [], n = 0;
      for (let dh = 0.04; dh < half - 0.04; dh += 0.05) {
        const t = timeAt(dh), u = up(t);
        if (up(t - 6e5) !== u || up(t + 6e5) !== u) continue; // too close to a sun event to judge
        const deg = D.hourDeg(D.vNow + dh) * RAD, P = new DOMPoint(100 + 50 * Math.sin(deg), 100 - 50 * Math.cos(deg));
        const inD = df.isPointInFill(P), inN = nfl.isPointInFill(P); n++;
        if (inD === inN || inD !== u) bad.push(`${dh.toFixed(2)}h: sun ${u ? 'up' : 'down'}, shaded ${inD ? 'day' : ''}${inN ? 'night' : ''}`);
      }
      return { n, bad: bad.slice(0, 3), nbad: bad.length, rise: document.querySelectorAll('#linesReal line').length };
    }, [lat, lon]);
    cases++; total += r.n; fails += r.nbad;
    if (r.nbad) console.log('FAIL', name, iso, filled, smooth ? 'smooth' : 'snap', dial12 ? '12h' : '24h', r.nbad + '/' + r.n, r.bad.join(' | '));
    await p.close();
  }
  console.log(`cases ${cases}, points ${total}, mismatches ${fails}`);
  await b.close();
})();
