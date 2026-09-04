const { chromium } = require('C:\\Users\\Станислав\\Documents\\ChatGPT\\Yandex Games\\node_modules\\playwright-core');
const fs = require('fs');
const path = require('path');

const root = 'C:\\Yandex Games\\02 Orbital Salvage';
const base = process.env.COREPASS05_BASE || 'http://127.0.0.1:4189/index.html';
const shots = path.join(root, 'screenshots', 'CorePass05');
const browserPath = 'C:\\Program Files\\Yandex\\YandexBrowser\\Application\\browser.exe';
const errors = [];

async function makePage(browser, viewport, mobile = false) {
  const context = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile });
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().includes('409')) errors.push(`console: ${message.text()}`);
  });
  return { context, page };
}

async function open(browser, query = '', viewport = { width: 1920, height: 1080 }, mobile = false) {
  const result = await makePage(browser, viewport, mobile);
  await result.page.goto(`${base}${query}`, { waitUntil: 'networkidle' });
  await result.page.waitForTimeout(700);
  return result;
}

async function hold(page, key, ms) {
  await page.keyboard.down(key);
  await page.waitForTimeout(ms);
  await page.keyboard.up(key);
  await page.waitForTimeout(120);
}

async function save(page, name) {
  await page.screenshot({ path: path.join(shots, name) });
}

function traceStats(trace) {
  const rows = trace.map((r, i) => ({ ...r, deltaCameraX: i ? r.cameraX - trace[i - 1].cameraX : 0, deltaCameraY: i ? r.cameraY - trace[i - 1].cameraY : 0 }));
  const max = (key) => rows.reduce((m, r) => Math.max(m, Math.abs(r[key] || 0)), 0);
  const range = (key) => [Math.min(...rows.map((r) => r[key])), Math.max(...rows.map((r) => r[key]))];
  return { rows, maxDX: max('deltaCameraX'), maxDY: max('deltaCameraY'), cameraXRange: range('cameraX'), cameraYRange: range('cameraY'), shipXRange: range('shipX'), shipYRange: range('shipY'), maxSpeed: Math.max(...rows.map((r) => r.speed || 0)) };
}

(async () => {
  fs.mkdirSync(shots, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: browserPath });

  let opened = await open(browser);
  await save(opened.page, '01-menu-1920x1080.png');
  await opened.context.close();

  opened = await open(browser);
  await opened.page.mouse.click(960, 740);
  await opened.page.waitForTimeout(450);
  await save(opened.page, '02-gameplay-1920x1080.png');
  await opened.page.mouse.move(960, 540);
  await opened.page.mouse.down();
  await opened.page.mouse.move(1290, 540, { steps: 12 });
  await opened.page.waitForTimeout(250);
  await opened.page.mouse.up();
  await save(opened.page, '03-hud-closeup-1920x1080.png');
  await opened.context.close();

  opened = await open(browser, '?qaState=result&qaCredits=180');
  await save(opened.page, '04-result-1920x1080.png');
  await opened.context.close();

  opened = await open(browser, '?qaState=upgrades&qaCredits=0');
  await save(opened.page, '05-upgrades-1920x1080.png');
  await save(opened.page, '06-upgrade-disabled-1920x1080.png');
  await opened.context.close();

  // Real Hull purchase: the click is performed on the runtime button, then New Run.
  opened = await open(browser, '?qaState=upgrades&qaCredits=150&qaHullMax=3');
  await opened.page.mouse.click(1550, 680);
  await opened.page.waitForTimeout(350);
  await save(opened.page, '07-upgrade-purchased-1920x1080.png');
  await opened.page.mouse.click(960, 835);
  await opened.page.waitForTimeout(450);
  await save(opened.page, 'docs-hull-next-run-qa.png');
  await opened.context.close();

  // Real Cargo purchase: the click is performed on the runtime button, then New Run.
  opened = await open(browser, '?qaState=upgrades&qaCredits=100&qaCargoMax=8');
  await opened.page.mouse.click(350, 680);
  await opened.page.waitForTimeout(350);
  await opened.page.mouse.click(960, 835);
  await opened.page.waitForTimeout(450);
  await save(opened.page, '08-next-run-1920x1080.png');
  await opened.context.close();

  opened = await open(browser, '', { width: 1280, height: 720 }, true);
  await opened.page.mouse.click(640, 490);
  await opened.page.waitForTimeout(300);
  await opened.page.mouse.move(640, 360);
  await opened.page.mouse.down();
  await opened.page.mouse.move(880, 360, { steps: 10 });
  await opened.page.waitForTimeout(600);
  await opened.page.mouse.up();
  await save(opened.page, '09-mobile-landscape.png');
  await opened.context.close();

  opened = await open(browser, '', { width: 720, height: 1280 }, true);
  await save(opened.page, '10-mobile-rotate.png');
  await opened.context.close();

  // Dynamic horizontal camera evidence.
  opened = await open(browser, '?qaState=play&qaTrace=1');
  await hold(opened.page, 'd', 4000);
  await hold(opened.page, 'a', 4000);
  await opened.page.keyboard.down('d');
  await opened.page.waitForTimeout(1050);
  await opened.page.keyboard.down('a');
  await opened.page.waitForTimeout(1050);
  await opened.page.keyboard.up('d');
  await opened.page.keyboard.up('a');
  await opened.page.waitForTimeout(180);
  const horizontal = traceStats(await opened.page.evaluate(() => window.__osTrace || []));
  fs.writeFileSync(path.join(root, 'docs', 'camera-trace-pass05-horizontal-qa.json'), JSON.stringify(horizontal.rows, null, 2));
  await opened.context.close();

  // Dynamic vertical camera evidence.
  opened = await open(browser, '?qaState=play&qaTrace=1');
  await hold(opened.page, 'w', 3000);
  await hold(opened.page, 's', 3000);
  await opened.page.keyboard.down('w');
  await opened.page.waitForTimeout(950);
  await opened.page.keyboard.down('s');
  await opened.page.waitForTimeout(950);
  await opened.page.keyboard.up('w');
  await opened.page.keyboard.up('s');
  await opened.page.waitForTimeout(180);
  const vertical = traceStats(await opened.page.evaluate(() => window.__osTrace || []));
  fs.writeFileSync(path.join(root, 'docs', 'camera-trace-pass05-vertical.json'), JSON.stringify(vertical.rows, null, 2));
  await opened.context.close();

  // Engine before/after: max speed is measured from the same runtime trace.
  const engineMeasurements = {};
  for (const level of [0, 1]) {
    opened = await open(browser, `?qaState=play&qaTrace=1&qaEngine=${level}`);
    await hold(opened.page, 'd', 3000);
    engineMeasurements[level] = traceStats(await opened.page.evaluate(() => window.__osTrace || [])).maxSpeed;
    await opened.context.close();
  }

  await browser.close();
  const report = {
    horizontal: { frames: horizontal.rows.length, maxDeltaX: horizontal.maxDX, maxDeltaY: horizontal.maxDY, cameraXRange: horizontal.cameraXRange, shipXRange: horizontal.shipXRange },
    vertical: { frames: vertical.rows.length, maxDeltaX: vertical.maxDX, maxDeltaY: vertical.maxDY, cameraYRange: vertical.cameraYRange, shipYRange: vertical.shipYRange },
    engine: { before: engineMeasurements[0], after: engineMeasurements[1], difference: engineMeasurements[1] - engineMeasurements[0], percent: ((engineMeasurements[1] / engineMeasurements[0]) - 1) * 100 },
    runtimeErrors: errors,
  };
  fs.writeFileSync(path.join(root, 'docs', 'corepass05-final-qa.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  process.exit(errors.length ? 1 : 0);
})().catch((error) => { console.error(error); process.exit(1); });
