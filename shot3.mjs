import { chromium } from 'playwright';
const out = '/sessions/great-gifted-clarke/mnt/outputs';
const b = await chromium.launch({ args: ['--no-sandbox','--disable-gpu','--disable-dev-shm-usage'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await p.goto('http://localhost:3212', { waitUntil: 'networkidle' });
// scroll through to trigger reveals
for (let y=0; y<9000; y+=700){ await p.evaluate(_y=>window.scrollTo(0,_y), y); await p.waitForTimeout(120); }
await p.evaluate(()=>window.scrollTo(0,0)); await p.waitForTimeout(800);
await p.screenshot({ path: out + '/v2_full.png', fullPage: true });
// model close-up
const fin = await p.$('#financials');
if (fin) await fin.screenshot({ path: out + '/v2_financials.png' });
const call = await p.$('#the-call');
if (call) await call.screenshot({ path: out + '/v2_thecall.png' });
await b.close();
console.log('done');
