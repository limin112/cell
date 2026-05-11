import puppeteer from 'puppeteer';

const url = process.env.URL || 'http://localhost:5173/';
const cellEn = process.env.CELL_EN || 'Plant Cell';
const out = process.env.OUT || 'sh5-plant-glb.png';

const browser = await puppeteer.launch({
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist',
    '--enable-webgl',
    '--use-angle=swiftshader',
  ],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

page.on('console', (msg) => {
  const t = msg.type();
  if (t === 'error' || t === 'warning') console.log(`[${t}]`, msg.text());
});
page.on('pageerror', (e) => console.log('[pageerror]', e.message));

await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

// Click the target cell in the LEFT list.
const clicked = await page.evaluate((label) => {
  const btns = [...document.querySelectorAll('button')];
  const hit = btns.find((b) => (b.textContent || '').includes(label));
  if (hit) {
    hit.click();
    return true;
  }
  return false;
}, cellEn);
if (!clicked) {
  console.log('[warn] did not find cell button for', cellEn);
}

await page.waitForFunction(
  () => {
    const c = document.querySelector('canvas');
    return !!c && c.width > 0 && c.height > 0;
  },
  { timeout: 45000 }
);
await new Promise((r) => setTimeout(r, 6000));

// Debug: how many thumbnail canvases are live, and did any already snap?
const thumbInfo = await page.evaluate(() => {
  const canvases = [...document.querySelectorAll('canvas')];
  const imgs = [...document.querySelectorAll('img')].filter((i) =>
    i.src.startsWith('data:image')
  );
  const keys = [];
  try {
    for (let i = 0; i < sessionStorage.length; i++) keys.push(sessionStorage.key(i));
  } catch {}
  return { canvases: canvases.length, dataImgs: imgs.length, ssKeys: keys };
});
console.log('thumbs:', JSON.stringify(thumbInfo));

const rect = await page.evaluate(() => {
  const c = document.querySelector('canvas');
  const r = c.getBoundingClientRect();
  return { w: c.width, h: c.height, cssW: Math.round(r.width), cssH: Math.round(r.height) };
});
const header = await page.evaluate(() =>
  [...document.querySelectorAll('h2')].map((n) => n.textContent).filter(Boolean)[0]
);
console.log('canvas:', rect, 'header:', header);

await page.screenshot({ path: out, fullPage: false });
await browser.close();
console.log('screenshot ->', out);
