const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Yandex\\YandexBrowser\\Application\\browser.exe',
  });
  const page = await browser.newPage({ viewport: { width: 900, height: 700 } });
  const dir = path.resolve(__dirname, '..', 'assets', 'game');
  const files = [
    'salvage_panel', 'salvage_hull', 'salvage_satellite', 'salvage_antenna',
    'debris_field', 'danger_zone', 'rotate_device',
  ];
  for (const name of files) {
    await page.setContent(fs.readFileSync(path.join(dir, `${name}.svg`), 'utf8'));
    const box = await page.locator('svg').boundingBox();
    await page.screenshot({
      path: path.join(dir, `${name}.png`),
      omitBackground: true,
      clip: { x: 0, y: 0, width: box.width, height: box.height },
    });
  }
  await browser.close();
})();
