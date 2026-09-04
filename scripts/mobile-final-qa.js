const { chromium } = require('C:\\Users\\Станислав\\Documents\\ChatGPT\\Yandex Games\\node_modules\\playwright-core');
const base = process.env.COREPASS05_BASE || 'http://127.0.0.1:4193/index.html';
const browserPath = 'C:\\Program Files\\Yandex\\YandexBrowser\\Application\\browser.exe';

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: browserPath });
  const errors = [];
  const landscapeContext = await browser.newContext({ viewport: { width: 1280, height: 720 }, isMobile: true, hasTouch: true });
  const landscape = await landscapeContext.newPage();
  landscape.on('pageerror', error => errors.push(`landscape pageerror: ${error.message}`));
  landscape.on('console', message => { if (message.type() === 'error' && !message.text().includes('409')) errors.push(`landscape console: ${message.text()}`); });
  await landscape.goto(base, { waitUntil: 'networkidle' });
  await landscape.waitForTimeout(700);
  await landscape.touchscreen.tap(640, 490);
  await landscape.waitForTimeout(350);
  const cdp = await landscapeContext.newCDPSession(landscape);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 640, y: 360, radiusX: 1, radiusY: 1 }] });
  for (let i = 1; i <= 10; i++) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 640 + i * 18, y: 360, radiusX: 1, radiusY: 1 }] });
    await landscape.waitForTimeout(30);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await landscape.waitForTimeout(250);
  const landscapeCanvas = await landscape.evaluate(() => { const c = document.querySelector('canvas'); return { css: [c.clientWidth, c.clientHeight], backing: [c.width, c.height] }; });
  await landscapeContext.close();

  const portraitContext = await browser.newContext({ viewport: { width: 720, height: 1280 }, isMobile: true, hasTouch: true });
  const portrait = await portraitContext.newPage();
  portrait.on('pageerror', error => errors.push(`portrait pageerror: ${error.message}`));
  portrait.on('console', message => { if (message.type() === 'error' && !message.text().includes('409')) errors.push(`portrait console: ${message.text()}`); });
  await portrait.goto(base, { waitUntil: 'networkidle' });
  await portrait.waitForTimeout(600);
  const portraitCanvas = await portrait.evaluate(() => { const c = document.querySelector('canvas'); return { css: [c.clientWidth, c.clientHeight], backing: [c.width, c.height] }; });
  await portraitContext.close();
  await browser.close();
  console.log(JSON.stringify({ landscapeCanvas, portraitCanvas, errors }, null, 2));
  if (errors.length) process.exitCode = 1;
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
