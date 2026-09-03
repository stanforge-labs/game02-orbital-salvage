const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Yandex\\YandexBrowser\\Application\\browser.exe' });
  const page = await (await browser.newContext({ viewport: { width: 960, height: 540 } })).newPage();
  await page.goto('http://127.0.0.1:4173/index.html', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(600);
  await page.mouse.click(480, 355);
  const move = async (keys, ms) => { for (const k of keys) await page.keyboard.down(k); await page.waitForTimeout(ms); for (const k of keys) await page.keyboard.up(k); await page.waitForTimeout(300); };
  await move(['ArrowRight', 'ArrowUp'], 900);
  await move(['ArrowLeft', 'ArrowDown'], 1300);
  await page.waitForTimeout(350);
  await page.screenshot({ path: 'C:\\Yandex Games\\02 Orbital Salvage\\screenshots\\CorePass03\\08-result.png' });
  await page.mouse.click(480, 395);
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:\\Yandex Games\\02 Orbital Salvage\\screenshots\\CorePass03\\09-upgrades.png' });
  process.exit(0);
})();
