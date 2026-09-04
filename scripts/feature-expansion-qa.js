const fs = require('fs');
const path = require('path');
const { chromium } = require('C:/Users/Станислав/Documents/ChatGPT/Yandex Games/node_modules/playwright-core');

const port = process.argv[2] || '4213';
const outDir = path.resolve(process.argv[3] || 'screenshots/FeatureExpansion');
fs.mkdirSync(outDir, { recursive: true });
const baseUrl = `http://127.0.0.1:${port}`;

function isExternalNoise(text) {
  return text.includes('responded with a status of 409') || text.includes('Error while creating the session');
}

async function open(browser, viewport, save, query = '') {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('pageerror', e => errors.push(`page: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error' && !isExternalNoise(m.text())) errors.push(`console: ${m.text()}`); });
  await page.addInitScript((value) => localStorage.setItem('orbitalSalvageSave', JSON.stringify(value)), save);
  await page.goto(`${baseUrl}/${query}`, { waitUntil: 'domcontentloaded', timeout: 10000 });
  await page.waitForTimeout(1000);
  return { page, errors };
}

async function start(page, x = 960, y = 720) {
  await page.mouse.click(x, y);
  await page.waitForTimeout(700);
}

async function collectAndReturn(page) {
  await page.keyboard.down('d');
  await page.keyboard.down('w');
  await page.waitForTimeout(950);
  await page.keyboard.up('d');
  await page.keyboard.up('w');
  await page.waitForTimeout(250);
  await page.keyboard.down('a');
  await page.keyboard.down('s');
  await page.waitForTimeout(1150);
  await page.keyboard.up('a');
  await page.keyboard.up('s');
  await page.waitForTimeout(650);
}

async function collectAndReturnUntilSaved(page) {
  for (let attempt = 0; attempt < 3; attempt++) {
    await collectAndReturn(page);
    const savedRun = await page.evaluate(() => {
      try { return Number(JSON.parse(localStorage.getItem('orbitalSalvageSave') || '{}').RunCount || 0); } catch (_) { return 0; }
    });
    if (savedRun > 0) return true;
    await page.keyboard.down('a'); await page.keyboard.down('s'); await page.waitForTimeout(1400);
    await page.keyboard.up('a'); await page.keyboard.up('s'); await page.waitForTimeout(500);
  }
  return false;
}

async function click(page, x, y) {
  await page.mouse.click(x, y);
  await page.waitForTimeout(300);
}

function writeTrace(file, rows) {
  const header = 'time,shipX,shipY,cameraX,cameraY,deltaCameraX,deltaCameraY';
  const lines = rows.map(r => [r.time, r.shipX, r.shipY, r.cameraX, r.cameraY, r.deltaCameraX, r.deltaCameraY].map(v => Number(v).toFixed(4)).join(','));
  fs.writeFileSync(file, `${header}\n${lines.join('\n')}\n`, 'utf8');
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Yandex/YandexBrowser/Application/browser.exe' });
  const allErrors = [];
  const report = { viewports: {}, states: {}, upgrades: {}, camera: {}, errors: allErrors };

  const menu = await open(browser, { width: 1920, height: 1080 }, { Credits: 0, TechParts: 0 });
  allErrors.push(...menu.errors); await menu.page.screenshot({ path: path.join(outDir, '01-menu-1920x1080.png') });
  await start(menu.page); await menu.page.screenshot({ path: path.join(outDir, '02-gameplay-1920x1080.png') });
  await menu.page.screenshot({ path: path.join(outDir, '03-hud-1920x1080.png') });
  await menu.page.close();

  for (const size of [[1600, 900], [1366, 768]]) {
    const probe = await open(browser, { width: size[0], height: size[1] }, { Credits: 0, TechParts: 0 });
    allErrors.push(...probe.errors);
    report.viewports[`${size[0]}x${size[1]}`] = await probe.page.evaluate(() => ({
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      canvas: [...document.querySelectorAll('canvas')].map(c => ({ width: c.width, height: c.height, clientWidth: c.clientWidth, clientHeight: c.clientHeight }))
    }));
    await probe.page.close();
  }

  const run = await open(browser, { width: 1920, height: 1080 }, { Credits: 300, TechParts: 3 });
  allErrors.push(...run.errors); await start(run.page); await collectAndReturn(run.page);
  await run.page.screenshot({ path: path.join(outDir, '04-result-1920x1080.png') });
  report.states.result = await run.page.evaluate(() => localStorage.getItem('orbitalSalvageSave'));
  await click(run.page, 695, 540);
  await run.page.screenshot({ path: path.join(outDir, '05-upgrades-1920x1080.png') });
  await click(run.page, 370, 660);
  await run.page.screenshot({ path: path.join(outDir, '06-cargo-purchased-1920x1080.png') });
  report.upgrades.cargoPurchased = await run.page.evaluate(() => JSON.parse(localStorage.getItem('orbitalSalvageSave')));
  await click(run.page, 960, 840);
  await run.page.screenshot({ path: path.join(outDir, '07-next-run-after-cargo-1920x1080.png') });
  await run.page.close();

  const disabled = await open(browser, { width: 1920, height: 1080 }, { Credits: 0, TechParts: 0 });
  allErrors.push(...disabled.errors); await start(disabled.page); await collectAndReturn(disabled.page); await click(disabled.page, 695, 540);
  await disabled.page.screenshot({ path: path.join(outDir, '08-upgrade-disabled-1920x1080.png') });
  await click(disabled.page, 370, 660);
  await disabled.page.screenshot({ path: path.join(outDir, '09-not-enough-feedback-1920x1080.png') });
  report.states.notEnough = await disabled.page.evaluate(() => localStorage.getItem('orbitalSalvageSave'));
  await disabled.page.close();

  const hull = await open(browser, { width: 1920, height: 1080 }, { Credits: 150, TechParts: 1 }, '?traceCamera');
  allErrors.push(...hull.errors); await start(hull.page); await collectAndReturnUntilSaved(hull.page); await click(hull.page, 695, 540); await click(hull.page, 1550, 660); await click(hull.page, 960, 840);
  await hull.page.screenshot({ path: path.join(outDir, '10-hull-next-run-1920x1080.png') });
  report.upgrades.hullPurchased = await hull.page.evaluate(() => JSON.parse(localStorage.getItem('orbitalSalvageSave')));
  await hull.page.close();

  const measureEngine = async (save) => {
    const run = await open(browser, { width: 1920, height: 1080 }, save, '?traceCamera');
    allErrors.push(...run.errors); await start(run.page);
    await run.page.waitForTimeout(250);
    await run.page.keyboard.down('d'); await run.page.waitForTimeout(1800); await run.page.keyboard.up('d'); await run.page.waitForTimeout(200);
    const trace = await run.page.evaluate(() => window.__osCameraTrace || []);
    await run.page.close();
    return trace;
  };
  const beforeTrace = await measureEngine({ Credits: 120, TechParts: 1, HullMax: 99, Hull: 99, CargoMax: 0, EngineLevel: 0 });
  const afterTrace = await measureEngine({ Credits: 0, EngineLevel: 1, HullMax: 99, Hull: 99, CargoMax: 0 });
  const speed = (rows) => rows.slice(1).map((r, i) => Math.abs(r.shipX - rows[i].shipX) / Math.max(0.001, r.time - rows[i].time)).filter(Number.isFinite);
  const beforeSpeed = Math.max(...speed(beforeTrace), 0), afterSpeed = Math.max(...speed(afterTrace), 0);
  report.upgrades.engineSpeed = { before: beforeSpeed, after: afterSpeed, changePercent: beforeSpeed ? ((afterSpeed / beforeSpeed) - 1) * 100 : null, beforeRows: beforeTrace.length, afterRows: afterTrace.length };

  const camera = await open(browser, { width: 1920, height: 1080 }, { Credits: 0, TechParts: 0, HullMax: 99, Hull: 99, CargoMax: 0 }, '?traceCamera');
  allErrors.push(...camera.errors); await start(camera.page);
  const segment = async (keys, ms) => { for (const k of keys) await camera.page.keyboard.down(k); await camera.page.waitForTimeout(ms); for (const k of keys) await camera.page.keyboard.up(k); await camera.page.waitForTimeout(220); };
  await segment(['d'], 3000); await segment(['a'], 3000); await segment(['d'], 1300); await segment(['a'], 1300);
  await segment(['w'], 3000); await segment(['s'], 3000); await segment(['w'], 1300); await segment(['s'], 1300);
  const rows = await camera.page.evaluate(() => window.__osCameraTrace || []);
  writeTrace(path.join(outDir, 'camera-trace-feature-expansion.csv'), rows);
  const dx = rows.map(r => Math.abs(r.deltaCameraX)); const dy = rows.map(r => Math.abs(r.deltaCameraY));
  report.camera = { rows: rows.length, cameraXMin: Math.min(...rows.map(r => r.cameraX)), cameraXMax: Math.max(...rows.map(r => r.cameraX)), cameraYMin: Math.min(...rows.map(r => r.cameraY)), cameraYMax: Math.max(...rows.map(r => r.cameraY)), maxDeltaX: Math.max(...dx), maxDeltaY: Math.max(...dy) };
  await camera.page.close();

  const mobile = await open(browser, { width: 1280, height: 720 }, { Credits: 0, TechParts: 0 });
  allErrors.push(...mobile.errors); await start(mobile.page, 640, 480); await mobile.page.mouse.move(640, 360); await mobile.page.mouse.down(); await mobile.page.mouse.move(760, 300, { steps: 12 }); await mobile.page.waitForTimeout(450); await mobile.page.mouse.up(); await mobile.page.screenshot({ path: path.join(outDir, '11-mobile-landscape.png') }); await mobile.page.close();
  const portrait = await open(browser, { width: 720, height: 1280 }, { Credits: 0, TechParts: 0 });
  allErrors.push(...portrait.errors); await portrait.page.screenshot({ path: path.join(outDir, '12-mobile-portrait.png') }); await portrait.page.close();

  report.errors = allErrors;
  fs.writeFileSync(path.join(outDir, 'qa-report.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify(report, null, 2));
  process.exit(allErrors.length ? 2 : 0);
})().catch(error => { console.error(error.stack || error); process.exit(1); });
