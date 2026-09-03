const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Yandex\\YandexBrowser\\Application\\browser.exe' });
  const context = await browser.newContext({ viewport: { width: 540, height: 960 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/index.html', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'C:\\Yandex Games\\02 Orbital Salvage\\screenshots\\CorePass03\\11-rotate-device.png' });
  process.exit(0);
})();
