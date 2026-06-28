import { chromium } from 'playwright';
const out = '/sessions/great-gifted-clarke/mnt/outputs';
const b = await chromium.launch({ args: ['--no-sandbox','--disable-gpu','--disable-dev-shm-usage'] });
// desktop
let p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await p.goto('http://localhost:3210', { waitUntil: 'networkidle' });
await p.waitForTimeout(2500);
await p.screenshot({ path: out + '/hero_desktop.png' });
// full page
await p.screenshot({ path: out + '/full_desktop.png', fullPage: true });
// mobile
let m = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await m.goto('http://localhost:3210', { waitUntil: 'networkidle' });
await m.waitForTimeout(2500);
await m.screenshot({ path: out + '/hero_mobile.png' });
await b.close();
console.log('shots done');
