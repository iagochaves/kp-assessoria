// Measures when tracking fires on a landing URL (median per network profile, Pixel 7 emulation).
// Meta /tr and Clarity beacons are intercepted and aborted, so runs never reach production analytics.
// Usage: npm run measure -- [url] [runs]
import { chromium, devices } from 'playwright';

const TARGET = process.argv[2] || 'https://diagnostico.assessoriakp.com.br/';
const RUNS = Number(process.argv[3] || 3);
const PROFILES = {
  'sem-throttle': null,
  '4G': { lat: 85, down: 9e6 / 8, up: 1.5e6 / 8, cpu: 2 },
  'slow-4G': { lat: 150, down: 1.6e6 / 8, up: 0.75e6 / 8, cpu: 4 },
  '3G': { lat: 400, down: 0.4e6 / 8, up: 0.4e6 / 8, cpu: 4 },
};
const SCEN = ['parado'];

const browser = await chromium.launch();
const out = [];
for (const [pname, p] of Object.entries(PROFILES)) {
  for (const scen of SCEN) {
    for (let r = 0; r < RUNS; r++) {
      const ctx = await browser.newContext({ ...devices['Pixel 7'] });
      const page = await ctx.newPage();
      const cdp = await ctx.newCDPSession(page);
      await cdp.send('Network.enable');
      await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
      if (p) {
        await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: p.lat, downloadThroughput: p.down, uploadThroughput: p.up });
        await cdp.send('Emulation.setCPUThrottlingRate', { rate: p.cpu });
      }
      const t = {};
      let t0;
      const mark = (k) => { if (t[k] == null) t[k] = Date.now() - t0; };
      await page.route(/facebook\.com\/tr|clarity\.ms\/collect|\.clarity\.ms\/collect/, (route) => {
        const u = route.request().url();
        if (/facebook\.com\/tr/.test(u)) {
          const ev = new URL(u).searchParams.get('ev') || (route.request().postData() || '').match(/ev=([^&]+)/)?.[1];
          mark('fb_' + ev);
        } else mark('clarity_collect');
        route.abort();
      });
      page.on('request', (rq) => {
        const u = rq.url();
        if (u.includes('googletagmanager.com/gtm.js')) mark('gtm_req');
        if (u.includes('fbevents.js')) mark('fbevents_req');
        if (u.includes('clarity.ms/tag')) mark('clarity_tag');
      });
      t0 = Date.now();
      const nav = page.goto(TARGET, { waitUntil: 'load', timeout: 90000 });
      await nav;
      // wait up to 20s for PageView
      const until = Date.now() + 20000;
      while (t['fb_PageView'] == null && Date.now() < until) await page.waitForTimeout(200);
      const perf = await page.evaluate(() => {
        const n = performance.getEntriesByType('navigation')[0];
        const fcp = performance.getEntriesByName('first-contentful-paint')[0];
        return { ttfb: Math.round(n.responseStart), dcl: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd), fcp: fcp && Math.round(fcp.startTime) };
      });
      const lcp = await page.evaluate(() => new Promise((res) => {
        new PerformanceObserver((l) => { const e = l.getEntries(); res(Math.round(e[e.length - 1].startTime)); }).observe({ type: 'largest-contentful-paint', buffered: true });
        setTimeout(() => res(null), 500);
      }));
      const row = { profile: pname, scen, run: r + 1, ...perf, lcp, ...t };
      out.push(row);
      console.log(JSON.stringify(row));
      await ctx.close();
    }
  }
}
await browser.close();
const med = (a) => { a = a.filter((x) => x != null).sort((x, y) => x - y); return a.length ? a[Math.floor(a.length / 2)] : null; };
console.log('\nMEDIANAS');
for (const pname of Object.keys(PROFILES)) for (const scen of SCEN) {
  const rows = out.filter((r) => r.profile === pname && r.scen === scen);
  const keys = ['ttfb', 'fcp', 'lcp', 'load', 'gtm_req', 'fbevents_req', 'fb_PageView', 'clarity_tag'];
  console.log(pname.padEnd(13), scen.padEnd(10), keys.map((k) => `${k}=${med(rows.map((r) => r[k]))}`).join(' '), `pv_miss=${rows.filter((r) => r.fb_PageView == null).length}/${rows.length}`);
}
