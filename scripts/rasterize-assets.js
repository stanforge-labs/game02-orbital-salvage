const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Yandex\\YandexBrowser\\Application\\browser.exe',
  });
  const context = await browser.newContext({ viewport: { width: 900, height: 700 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  const dir = path.resolve(__dirname, '..', 'assets', 'game');
  const files = [
    'salvage_panel', 'salvage_hull', 'salvage_satellite', 'salvage_antenna',
    'debris_field', 'danger_zone', 'rotate_device', 'ui_panel', 'ui_button',
    'ui_menu_panel', 'ui_result_panel', 'ui_card', 'ui_hud_panel',
    'station_custom', 'station_glow', 'scrap_glow', 'rare_container',
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
  console.log('HD authored assets rasterized');
  process.exit(0);
})();
