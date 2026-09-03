const { chromium } = require('playwright-core');

const OUT = 'C:\\Yandex Games\\02 Orbital Salvage\\screenshots\\CorePass04';
const EXE = 'C:\\Program Files\\Yandex\\YandexBrowser\\Application\\browser.exe';

async function wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
async function move(page, keys, ms) {
  for (const key of keys) await page.keyboard.down(key);
  await wait(ms);
  for (const key of [...keys].reverse()) await page.keyboard.up(key);
  await wait(260);
}
async function startRun(page) {
  const box = page.viewportSize();
  await page.mouse.click(box.width / 2, box.height * (355 / 540));
  await wait(450);
}
async function collectAndReturn(page) {
  await move(page, ['ArrowRight', 'ArrowUp'], 900);
  await move(page, ['ArrowLeft', 'ArrowDown'], 1300);
  await wait(450);
}
async function openPage(browser, viewport, query = '') {
  const context = await browser.newContext({ viewport, isMobile: viewport.width < 1400, hasTouch: viewport.width < 1400 });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:4173/index.html${query}`, { waitUntil: 'domcontentloaded' });
  await wait(700);
  return { context, page };
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: EXE });
  const errors = [];

  const desktop = await openPage(browser, { width: 1920, height: 1080 });
  desktop.page.on('pageerror', e => errors.push(e.message));
  await desktop.page.screenshot({ path: `${OUT}\\01-menu-1920x1080.png` });
  await startRun(desktop.page);
  await desktop.page.screenshot({ path: `${OUT}\\02-gameplay-1920x1080.png` });
  await move(desktop.page, ['KeyW'], 2000);
  await desktop.page.screenshot({ path: `${OUT}\\03-camera-up.png` });
  await move(desktop.page, ['KeyS'], 2000);
  await desktop.page.screenshot({ path: `${OUT}\\04-camera-down.png` });
  await collectAndReturn(desktop.page);
  await desktop.page.screenshot({ path: `${OUT}\\05-result.png` });
  await desktop.page.mouse.click(680, 790);
  await wait(500);
  await desktop.page.screenshot({ path: `${OUT}\\06-upgrades.png` });
  await desktop.context.close();

  const disabled = await openPage(browser, { width: 960, height: 540 });
  disabled.page.on('pageerror', e => errors.push(e.message));
  await startRun(disabled.page);
  await collectAndReturn(disabled.page);
  await disabled.page.mouse.click(340, 395);
  await wait(500);
  await disabled.page.screenshot({ path: `${OUT}\\07-upgrade-disabled.png` });
  await disabled.context.close();

  const purchased = await openPage(browser, { width: 960, height: 540 }, '?qaCredits=1');
  purchased.page.on('pageerror', e => errors.push(e.message));
  await startRun(purchased.page);
  await collectAndReturn(purchased.page);
  await purchased.page.mouse.click(340, 395);
  await wait(450);
  await purchased.page.mouse.click(240, 310);
  await wait(450);
  await purchased.page.screenshot({ path: `${OUT}\\08-upgrade-purchased.png` });
  await purchased.page.mouse.click(480, 430);
  await wait(450);
  await purchased.page.screenshot({ path: `${OUT}\\09-next-run-after-upgrade.png` });
  await purchased.context.close();

  const mobile = await openPage(browser, { width: 1280, height: 720 });
  mobile.page.on('pageerror', e => errors.push(e.message));
  await startRun(mobile.page);
  await mobile.page.mouse.move(640, 360);
  await mobile.page.mouse.down();
  await mobile.page.mouse.move(900, 360, { steps: 8 });
  await wait(700);
  await mobile.page.mouse.up();
  await mobile.page.screenshot({ path: `${OUT}\\10-mobile-landscape.png` });
  await mobile.context.close();

  console.log(`RUNTIME_ERRORS=${errors.length}`);
  if (errors.length) console.log(errors.join('\n'));
  process.exit(errors.length ? 1 : 0);
})().catch(error => { console.error(error); process.exit(2); });
