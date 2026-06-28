import { chromium } from 'playwright';
const out = '/sessions/great-gifted-clarke/mnt/outputs';
const b = await chromium.launch({ args: ['--no-sandbox','--disable-gpu','--disable-dev-shm-usage'] });
const p = await b.newPage({ viewport: { width: 1440, height: 980 }, deviceScaleFactor: 2 });
await p.goto('http://localhost:3212', { waitUntil: 'networkidle' });
// bring The Call into view and let reveals settle
await p.evaluate(()=>document.querySelector('#the-call')?.scrollIntoView({block:'start'}));
await p.waitForTimeout(1400);
const call = await p.$('#the-call'); if (call) await call.screenshot({ path: out+'/v2_thecall2.png' });
await p.evaluate(()=>document.querySelector('#catalysts')?.scrollIntoView({block:'start'}));
await p.waitForTimeout(1400);
const cat = await p.$('#catalysts'); if (cat) await cat.screenshot({ path: out+'/v2_catalysts.png' });
await p.evaluate(()=>document.querySelector('#risks')?.scrollIntoView({block:'start'}));
await p.waitForTimeout(1400);
const rk = await p.$('#risks'); if (rk) await rk.screenshot({ path: out+'/v2_risks.png' });
await b.close(); console.log('done');
