const { chromium } = require('C:\\Users\\Станислав\\Documents\\ChatGPT\\Yandex Games\\node_modules\\playwright-core');
const fs = require('fs');

function stats(rows) {
  const deltas = rows.map((row, i) => i ? row.cameraX - rows[i - 1].cameraX : 0);
  return { frames: rows.length, shipX: [Math.min(...rows.map((r) => r.shipX)), Math.max(...rows.map((r) => r.shipX))], cameraX: [Math.min(...rows.map((r) => r.cameraX)), Math.max(...rows.map((r) => r.cameraX))], maxDeltaX: Math.max(...deltas.map(Math.abs)) };
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Yandex\\YandexBrowser\\Application\\browser.exe' });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4185/index.html?qaState=play&qaTrace=1', { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  await page.keyboard.down('a');
  await page.waitForTimeout(4000);
  await page.keyboard.up('a');
  await page.waitForTimeout(120);
  await page.keyboard.down('d');
  await page.waitForTimeout(4000);
  await page.keyboard.up('d');
  await page.waitForTimeout(180);
  const rows = await page.evaluate(() => window.__osTrace || []);
  fs.writeFileSync('C:\\Yandex Games\\02 Orbital Salvage\\docs\\camera-trace-pass05-a-to-d.json', JSON.stringify(rows.map((row, i) => ({ ...row, deltaCameraX: i ? row.cameraX - rows[i - 1].cameraX : 0, deltaCameraY: i ? row.cameraY - rows[i - 1].cameraY : 0 })), null, 2));
  console.log(JSON.stringify(stats(rows), null, 2));
  await browser.close();
})().catch((error) => { console.error(error); process.exitCode = 1; });
