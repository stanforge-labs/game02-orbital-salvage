const { chromium } = require('playwright-core');
const fs = require('fs');

(async () => {
  const out = 'C:\\Yandex Games\\02 Orbital Salvage\\screenshots\\CorePass02';
  const errors = [];
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Yandex\\YandexBrowser\\Application\\browser.exe' });
  const context = await browser.newContext({ viewport: { width: 960, height: 540 } });
  const page = await context.newPage();
  page.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error' && !m.text().includes('409')) errors.push(`console: ${m.text()}`); });
  await page.goto('http://127.0.0.1:4173/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${out}\\01-menu.png` });
  await page.mouse.click(480, 355);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${out}\\02-station-start.png` });

  const move = async (keys, ms) => {
    for (const key of keys) await page.keyboard.down(key);
    await page.waitForTimeout(ms);
    for (const key of keys.reverse()) await page.keyboard.up(key);
    await page.waitForTimeout(260);
  };
  await move(['ArrowRight', 'ArrowUp'], 900);
  await page.screenshot({ path: `${out}\\03-safe-salvage.png` });
  await move(['ArrowRight'], 2000);
  await page.screenshot({ path: `${out}\\04-debris-field.png` });
  await move(['ArrowDown'], 1000);
  await page.screenshot({ path: `${out}\\05-rare-container.png` });
  await move(['ArrowRight'], 2400);
  await page.screenshot({ path: `${out}\\06-station-marker.png` });
  await move(['ArrowUp'], 2600);
  await page.screenshot({ path: `${out}\\07-pickup.png` });
  await move(['ArrowDown'], 1200);
  await move(['ArrowDown'], 2500);
  await page.screenshot({ path: `${out}\\08-cargo-full.png` });

  const mobile = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Yandex\\YandexBrowser\\Application\\browser.exe' });
  const mobileContext = await mobile.newContext({ viewport: { width: 960, height: 540 }, isMobile: true, hasTouch: true });
  const mobilePage = await mobileContext.newPage();
  mobilePage.on('pageerror', e => errors.push(`mobile pageerror: ${e.message}`));
  mobilePage.on('console', m => { if (m.type() === 'error' && !m.text().includes('409')) errors.push(`mobile console: ${m.text()}`); });
  await mobilePage.goto('http://127.0.0.1:4173/index.html', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(700);
  await mobilePage.mouse.click(480, 355);
  await mobilePage.waitForTimeout(300);
  await mobilePage.mouse.move(480, 270);
  await mobilePage.mouse.down();
  await mobilePage.mouse.move(760, 270, { steps: 8 });
  await mobilePage.waitForTimeout(700);
  await mobilePage.mouse.up();
  await mobilePage.screenshot({ path: `${out}\\12-mobile-landscape.png` });
  fs.writeFileSync(`${out}\\qa-summary.txt`, errors.length ? errors.join('\n') : 'RUNTIME_ERRORS=0\n');
  process.exit(errors.length ? 1 : 0);
})();
