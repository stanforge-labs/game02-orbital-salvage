const { chromium } = require('C:\\Users\\Станислав\\Documents\\ChatGPT\\Yandex Games\\node_modules\\playwright-core');
const base = process.env.COREPASS05_BASE || 'http://127.0.0.1:4192/index.html';
const browserPath = 'C:\\Program Files\\Yandex\\YandexBrowser\\Application\\browser.exe';

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: browserPath });
  const result = {};
  for (const level of [0, 1]) {
    const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
    page.on('console', message => { if (message.type() === 'error' && !message.text().includes('409')) errors.push(`console: ${message.text()}`); });
    await page.goto(`${base}?qaState=play&qaTrace=1&qaEngine=${level}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    await page.keyboard.down('d');
    await page.waitForTimeout(3000);
    await page.keyboard.up('d');
    await page.waitForTimeout(180);
    const trace = await page.evaluate(() => window.__osTrace || []);
    const maxSpeed = Math.max(...trace.map(row => row.speed || 0));
    result[level ? 'after' : 'before'] = { maxSpeed, frames: trace.length, errors };
    await context.close();
  }
  result.difference = result.after.maxSpeed - result.before.maxSpeed;
  result.changePercent = (result.difference / result.before.maxSpeed) * 100;
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
