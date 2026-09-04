const { chromium } = require('C:\\Users\\Станислав\\Documents\\ChatGPT\\Yandex Games\\node_modules\\playwright-core');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Yandex\\YandexBrowser\\Application\\browser.exe' });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => { if (message.type() === 'error' && !message.text().includes('409')) errors.push(`console: ${message.text()}`); });
  await page.goto('http://127.0.0.1:4184/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  const menu = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    return { innerWidth, innerHeight, devicePixelRatio, canvasCss: canvas && [canvas.clientWidth, canvas.clientHeight], canvasBacking: canvas && [canvas.width, canvas.height] };
  });
  await page.mouse.click(960, 740);
  await page.waitForTimeout(650);
  await page.keyboard.down('d');
  await page.waitForTimeout(900);
  await page.keyboard.up('d');
  await page.waitForTimeout(250);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  await page.mouse.click(960, 740);
  await page.waitForTimeout(650);
  await page.keyboard.down('w');
  await page.waitForTimeout(450);
  await page.keyboard.up('w');
  await page.waitForTimeout(250);
  const gameplay = await page.evaluate(() => ({ state: document.visibilityState, canvases: [...document.querySelectorAll('canvas')].map((canvas) => ({ css: [canvas.clientWidth, canvas.clientHeight], backing: [canvas.width, canvas.height] })) }));
  await browser.close();
  console.log(JSON.stringify({ menu, gameplay, errors }, null, 2));
  if (errors.length) process.exitCode = 1;
})().catch((error) => { console.error(error); process.exitCode = 1; });
