const { chromium } = require('C:\\Users\\Станислав\\Documents\\ChatGPT\\Yandex Games\\node_modules\\playwright-core');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Yandex\\YandexBrowser\\Application\\browser.exe' });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4185/index.html?qaState=play&qaTrace=1', { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  await page.keyboard.down('s');
  await page.waitForTimeout(3000);
  await page.keyboard.up('s');
  await page.waitForTimeout(120);
  await page.keyboard.down('w');
  await page.waitForTimeout(3000);
  await page.keyboard.up('w');
  await page.waitForTimeout(180);
  const rows = await page.evaluate(() => window.__osTrace || []);
  const output = rows.map((row, i) => ({ ...row, deltaCameraX: i ? row.cameraX - rows[i - 1].cameraX : 0, deltaCameraY: i ? row.cameraY - rows[i - 1].cameraY : 0 }));
  fs.writeFileSync('C:\\Yandex Games\\02 Orbital Salvage\\docs\\camera-trace-pass05-s-to-w.json', JSON.stringify(output, null, 2));
  console.log(JSON.stringify({ frames: output.length, shipY: [Math.min(...output.map((r) => r.shipY)), Math.max(...output.map((r) => r.shipY))], cameraY: [Math.min(...output.map((r) => r.cameraY)), Math.max(...output.map((r) => r.cameraY))], maxDeltaY: Math.max(...output.map((r) => Math.abs(r.deltaCameraY))) }, null, 2));
  await browser.close();
})().catch((error) => { console.error(error); process.exitCode = 1; });
