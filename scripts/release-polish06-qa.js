const fs = require('fs');
const path = require('path');
const { chromium } = require('C:/Users/Станислав/Documents/ChatGPT/Yandex Games/node_modules/playwright-core');

const projectRoot = 'C:/Yandex Games/02 Orbital Salvage';
const baseUrl = process.env.RELEASE06_BASE || 'http://127.0.0.1:4220/index.html';
const outDir = path.join(projectRoot, 'screenshots', 'ReleasePolish06');
const browserPath = 'C:/Users/Станислав/AppData/Local/ms-playwright/chromium-1169/chrome-win/chrome.exe';
const errors = [];

function saveData(data) {
  return {
    Credits: 0, TechParts: 0, CargoMax: 8, HullMax: 3, Hull: 3,
    EngineLevel: 0, MagnetLevel: 0, RadarLevel: 0, InsuranceLevel: 0,
    RunCount: 0, RerollCount: 0, ResetCount: 0, DoubleRewardUsed: 0,
    SecondChanceUsed: 0, SectorUnlocked: 0, CurrentSector: 1,
    OnboardingSeen: 1, MissionBonusClaimed: 0, ...data,
  };
}

async function openPage(browser, viewport, data, mobile = false, query = '') {
  const context = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile });
  await context.addInitScript((value) => localStorage.setItem('orbitalSalvageSave', JSON.stringify(value)), saveData(data));
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    const text = message.text();
    if (message.type() === 'error' && !text.includes('409') && !text.includes('Error while creating the session Response')) errors.push(`console: ${text}`);
  });
  page.on('response', (response) => {
    if (response.status() >= 400 && response.status() !== 409) errors.push(`http ${response.status()}: ${response.url()}`);
  });
  page.on('requestfailed', (request) => {
    if (!request.url().includes('/sdk.js')) errors.push(`requestfailed: ${request.url()} ${request.failure() && request.failure().errorText}`);
  });
  await page.goto(`${baseUrl}${query}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(900);
  return { context, page };
}

async function wait(page, ms = 250) { await page.waitForTimeout(ms); }
async function click(page, x, y, ms = 350) { await page.mouse.click(x, y); await wait(page, ms); }
async function tap(page, x, y, ms = 350) { await page.touchscreen.tap(x, y); await wait(page, ms); }
async function shot(page, name) { await page.screenshot({ path: path.join(outDir, name) }); }
async function qaState(page) { return page.evaluate(() => window.__osQAState || null); }

async function start(page) { await click(page, 960, 710, 450); }

async function collectOneAndReturn(page) {
  await page.keyboard.down('d');
  await page.keyboard.down('w');
  await wait(page, 650);
  await page.keyboard.up('d');
  await page.keyboard.up('w');
  await wait(page, 180);
  await page.keyboard.down('a');
  await page.keyboard.down('s');
  await wait(page, 850);
  await page.keyboard.up('a');
  await page.keyboard.up('s');
  await wait(page, 500);
}

async function collectFirstScrap(page) {
  await page.keyboard.down('d');
  await page.keyboard.down('w');
  await wait(page, 600);
  await page.keyboard.up('d');
  await page.keyboard.up('w');
  await wait(page, 260);
}

async function collectContainerAndReturn(page) {
  await page.keyboard.down('d');
  await wait(page, 5700);
  await page.keyboard.up('d');
  await wait(page, 120);
  await page.keyboard.down('w');
  await wait(page, 1200);
  await page.keyboard.up('w');
  await wait(page, 350);
  await page.keyboard.down('a');
  await wait(page, 5700);
  await page.keyboard.up('a');
  await wait(page, 120);
  await page.keyboard.down('s');
  await wait(page, 1200);
  await page.keyboard.up('s');
  await wait(page, 550);
}

async function waitForResult(page, attempts = 4) {
  for (let i = 0; i < attempts; i += 1) {
    const probe = await page.evaluate(() => window.__osQAState || null);
    if (probe && (probe.state === 'result' || probe.state === 'fail')) return probe.state;
    await wait(page, 300);
  }
  return await page.evaluate(() => window.__osQAState && window.__osQAState.state);
}

async function setState(page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem('orbitalSalvageSave') || '{}'));
}

function traceStats(rows) {
  const safe = rows.filter((row) => Number.isFinite(row.cameraX) && Number.isFinite(row.cameraY));
  const deltas = safe.slice(1).map((row, i) => ({
    dx: row.cameraX - safe[i].cameraX,
    dy: row.cameraY - safe[i].cameraY,
  }));
  const max = (key) => Math.max(...deltas.map((row) => Math.abs(row[key])), 0);
  const range = (key) => [Math.min(...safe.map((row) => row[key])), Math.max(...safe.map((row) => row[key]))];
  return {
    rows: safe.length,
    cameraXRange: range('cameraX'), cameraYRange: range('cameraY'),
    shipXRange: range('shipX'), shipYRange: range('shipY'),
    maxDeltaX: max('dx'), maxDeltaY: max('dy'),
  };
}

function writeCsv(file, rows) {
  const header = 'time,shipX,shipY,cameraX,cameraY,deltaCameraX,deltaCameraY';
  const lines = rows.map((row) => [row.time, row.shipX, row.shipY, row.cameraX, row.cameraY, row.deltaCameraX, row.deltaCameraY]
    .map((value) => Number(value).toFixed(4)).join(','));
  fs.writeFileSync(file, `${header}\n${lines.join('\n')}\n`, 'utf8');
}

async function readTrace(page) { return page.evaluate(() => window.__osCameraTrace || []); }

async function movementTrace(page) {
  const segments = [];
  const segment = async (keys, ms) => {
    const start = (await readTrace(page)).length;
    for (const key of keys) await page.keyboard.down(key);
    await wait(page, ms);
    for (const key of keys) await page.keyboard.up(key);
    await wait(page, 180);
    const rows = (await readTrace(page)).slice(start);
    const camera = rows.slice(1).map((row, i) => ({ dx: row.cameraX - rows[i].cameraX, dy: row.cameraY - rows[i].cameraY }));
    segments.push({ keys: keys.join('+').toUpperCase(), rows: rows.length, cameraXRange: traceStats(rows).cameraXRange, cameraYRange: traceStats(rows).cameraYRange, maxDeltaX: Math.max(...camera.map((row) => Math.abs(row.dx)), 0), maxDeltaY: Math.max(...camera.map((row) => Math.abs(row.dy)), 0) });
  };
  await segment(['w'], 3000);
  await segment(['s'], 3000);
  await page.keyboard.down('w'); await wait(page, 950); await page.keyboard.down('s'); await wait(page, 950);
  await page.keyboard.up('w'); await page.keyboard.up('s'); await wait(page, 180);
  await segment(['d'], 3000);
  await segment(['a'], 3000);
  await page.keyboard.down('d'); await wait(page, 950); await page.keyboard.down('a'); await wait(page, 950);
  await page.keyboard.up('d'); await page.keyboard.up('a'); await wait(page, 180);
  return { rows: await readTrace(page), segments };
}

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: browserPath });
  const qaStartedAt = Date.now();
  const report = { qaStartedAt: new Date(qaStartedAt).toISOString(), viewports: {}, states: {}, buttons: {}, progression: [], camera: {}, errors };

  let item = await openPage(browser, { width: 1920, height: 1080 }, { Credits: 0, TechParts: 0, RunCount: 2 });
  report.viewports.desktop = await item.page.evaluate(() => ({ innerWidth, innerHeight, dpr: devicePixelRatio, canvas: [...document.querySelectorAll('canvas')].map((c) => ({ width: c.width, height: c.height, clientWidth: c.clientWidth, clientHeight: c.clientHeight })) }));
  await shot(item.page, '01-menu.png');
  await start(item.page);
  await shot(item.page, '02-gameplay-sector1.png');
  await collectFirstScrap(item.page);
  await shot(item.page, '03-mission-progress.png');
  report.states.missionProgress = await qaState(item.page);
  await item.context.close();

  for (const [width, height] of [[1600, 900], [1366, 768]]) {
    const probe = await openPage(browser, { width, height }, { Credits: 0, TechParts: 0 });
    report.viewports[`${width}x${height}`] = await probe.page.evaluate(() => ({ innerWidth, innerHeight, canvas: [...document.querySelectorAll('canvas')].map((c) => ({ width: c.width, height: c.height, clientWidth: c.clientWidth, clientHeight: c.clientHeight })) }));
    await probe.context.close();
  }

  // Damage feedback is captured while the first hit notification is visible.
  item = await openPage(browser, { width: 1920, height: 1080 }, { Credits: 0, TechParts: 0, Hull: 3, HullMax: 3 });
  await start(item.page);
  await item.page.keyboard.down('d');
  let hitState = null;
  for (let elapsed = 0; elapsed < 5000; elapsed += 100) {
    await wait(item.page, 100);
    hitState = await item.page.evaluate(() => window.__osQAState || null);
    if (hitState && hitState.hull < hitState.hullMax) break;
  }
  await item.page.keyboard.up('d');
  await shot(item.page, '04-hit-feedback.png');
  report.states.hitFeedback = hitState;
  await item.context.close();

  // Result and rewarded result.
  item = await openPage(browser, { width: 1920, height: 1080 }, { Credits: 0, TechParts: 0 });
  await start(item.page); await collectOneAndReturn(item.page); await waitForResult(item.page);
  await shot(item.page, '05-result.png');
  await click(item.page, 960, 485, 350);
  await shot(item.page, '06-result-rewarded.png');
  report.states.rewarded = await setState(item.page);
  report.buttons.rewarded = await qaState(item.page);
  await item.context.close();

  // Local rewarded fallback also covers a real second-chance flow after a hull failure.
  item = await openPage(browser, { width: 1920, height: 1080 }, { Credits: 0, TechParts: 0, Hull: 1, HullMax: 1 });
  await start(item.page); await item.page.keyboard.down('d');
  let failState = null;
  for (let elapsed = 0; elapsed < 5000; elapsed += 100) {
    await wait(item.page, 100);
    failState = await qaState(item.page);
    if (failState && failState.state === 'fail') break;
  }
  await item.page.keyboard.up('d');
  if (failState && failState.state === 'fail') {
    await click(item.page, 960, 460, 400);
  }
  report.buttons.secondChance = { failed: failState, afterReward: await qaState(item.page) };
  await item.context.close();

  // Six-card upgrade screen, hover state, and explicit insufficient-resource feedback.
  item = await openPage(browser, { width: 1920, height: 1080 }, { Credits: 900, TechParts: 3 });
  await start(item.page); await collectOneAndReturn(item.page); await waitForResult(item.page); await click(item.page, 695, 580);
  await shot(item.page, '07-upgrades.png');
  await item.page.mouse.move(350, 455); await wait(item.page, 250); await shot(item.page, '08-upgrades-hover.png');
  const upgradeBefore = await qaState(item.page);
  await click(item.page, 350, 455); // Трюм.
  const cargoPurchased = await qaState(item.page);
  await click(item.page, 1010, 455); // Двигатель.
  const enginePurchased = await qaState(item.page);
  await click(item.page, 1570, 455); // Корпус.
  const hullPurchased = await qaState(item.page);
  await click(item.page, 350, 855); // Магнит.
  await click(item.page, 1010, 855); // Радар.
  const systemPurchased = await qaState(item.page);
  await click(item.page, 1570, 855); // Страховка.
  const insurancePurchased = await qaState(item.page);
  await click(item.page, 960, 965); // Новый вылет.
  await wait(item.page, 500);
  report.buttons.upgrades = {
    before: upgradeBefore,
    cargo: cargoPurchased,
    engine: enginePurchased,
    hull: hullPurchased,
    systems: systemPurchased,
    insurance: insurancePurchased,
    nextRun: await qaState(item.page),
  };
  await item.context.close();

  item = await openPage(browser, { width: 1920, height: 1080 }, { Credits: 0, TechParts: 0 });
  await start(item.page); await collectOneAndReturn(item.page); await waitForResult(item.page); await click(item.page, 695, 580);
  await click(item.page, 350, 455); await wait(item.page, 250); await shot(item.page, '09-not-enough.png');
  report.buttons.notEnough = await setState(item.page);
  report.buttons.notEnoughState = await qaState(item.page);
  await item.context.close();

  item = await openPage(browser, { width: 1920, height: 1080 }, { Credits: 500, TechParts: 3 });
  await start(item.page); await collectOneAndReturn(item.page); await waitForResult(item.page); await click(item.page, 695, 580);
  await shot(item.page, '10-techparts-actions.png');
  await click(item.page, 1680, 125); await wait(item.page, 400);
  report.buttons.techPartsAfterReroll = { save: await setState(item.page), state: await qaState(item.page) };
  await click(item.page, 350, 965); await wait(item.page, 400);
  report.buttons.techPartsAfterReset = { save: await setState(item.page), state: await qaState(item.page) };
  await item.context.close();

  item = await openPage(browser, { width: 1920, height: 1080 }, { Credits: 0, TechParts: 0 });
  await start(item.page); await collectOneAndReturn(item.page); await waitForResult(item.page); await click(item.page, 695, 580);
  await click(item.page, 1680, 125); await wait(item.page, 300); // Последняя деталь.
  await click(item.page, 1680, 125); await wait(item.page, 300); // Повторно — должна быть понятная ошибка.
  report.buttons.techPartsInsufficient = await qaState(item.page);
  await click(item.page, 350, 965); await wait(item.page, 300);
  report.buttons.resetInsufficient = await qaState(item.page);
  await item.context.close();

  // Hull purchase is kept as a separate real flow so its next-run HUD is evidence.
  item = await openPage(browser, { width: 1920, height: 1080 }, { Credits: 150, TechParts: 1 });
  await start(item.page); await collectOneAndReturn(item.page); await waitForResult(item.page); await click(item.page, 695, 580);
  const hullCreditsBefore = await qaState(item.page);
  await click(item.page, 1570, 455); await wait(item.page, 300);
  const hullPurchaseState = await qaState(item.page);
  await click(item.page, 960, 965); await wait(item.page, 500);
  const hullNextRun = await qaState(item.page);
  report.buttons.hullFlow = { before: hullCreditsBefore, afterPurchase: hullPurchaseState, nextRun: hullNextRun };
  await item.context.close();

  // A real contract completion: the first run's scrap contract is replaced by a
  // long container route only in this isolated QA context, with real keyboard input.
  item = await openPage(browser, { width: 1920, height: 1080 }, { Credits: 0, TechParts: 0, Hull: 99, HullMax: 99 });
  await start(item.page); await collectContainerAndReturn(item.page); await waitForResult(item.page);
  report.progression.push({ step: 'Контракт: доставка контейнера', elapsedSeconds: Number(((Date.now() - qaStartedAt) / 1000).toFixed(1)), state: await qaState(item.page), save: await setState(item.page) });
  await item.context.close();

  // Three real successful runs unlock sector 2 and open the sector selector.
  item = await openPage(browser, { width: 1920, height: 1080 }, { Credits: 0, TechParts: 1, RunCount: 0 });
  for (let i = 0; i < 3; i += 1) {
    if (i === 0) await start(item.page);
    else { await click(item.page, 1220, 580, 450); }
    await collectOneAndReturn(item.page);
    const resultState = await waitForResult(item.page);
    report.progression.push({ step: `Сектор 1: вылет ${i + 1}`, elapsedSeconds: Number(((Date.now() - qaStartedAt) / 1000).toFixed(1)), resultState, save: await setState(item.page) });
  }
  await click(item.page, 1220, 580, 450);
  await shot(item.page, '11-sector-select.png');
  await click(item.page, 1300, 660, 500);
  await shot(item.page, '12-sector2.png');
  report.states.sector2 = await setState(item.page);
  await item.context.close();

  // Mobile landscape touch start and portrait rotate overlay.
  item = await openPage(browser, { width: 1280, height: 720 }, { Credits: 0, TechParts: 0 }, true);
  await tap(item.page, 640, 475, 450);
  await item.page.mouse.move(640, 360); await item.page.mouse.down(); await item.page.mouse.move(840, 340, { steps: 12 }); await wait(item.page, 550); await item.page.mouse.up();
  await shot(item.page, '13-mobile-landscape.png');
  report.viewports.mobileLandscape = await item.page.evaluate(() => ({ innerWidth, innerHeight, touch: 'ontouchstart' in window, canvas: [...document.querySelectorAll('canvas')].map((c) => ({ width: c.width, height: c.height, clientWidth: c.clientWidth, clientHeight: c.clientHeight })) }));
  await item.context.close();

  item = await openPage(browser, { width: 720, height: 1280 }, { Credits: 0, TechParts: 0 }, true);
  await shot(item.page, '14-mobile-portrait.png');
  report.viewports.mobilePortrait = await item.page.evaluate(() => ({ innerWidth, innerHeight, touch: 'ontouchstart' in window }));
  await item.context.close();

  // Dynamic camera proof: all direction changes are generated by real keyboard input.
  item = await openPage(browser, { width: 1920, height: 1080 }, { Credits: 0, TechParts: 0, Hull: 99, HullMax: 99, CargoMax: 0 }, false, '?traceCamera=1');
  await start(item.page);
  const traceResult = await movementTrace(item.page);
  const trace = traceResult.rows;
  writeCsv(path.join(projectRoot, 'docs', 'camera-trace-release-polish06.csv'), trace);
  report.camera = traceStats(trace);
  report.camera.segments = traceResult.segments;
  report.camera.tracePath = 'docs/camera-trace-release-polish06.csv';
  await item.context.close();

  report.errors = errors;
  fs.writeFileSync(path.join(outDir, 'qa-report.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
  await Promise.race([browser.close().catch(() => {}), new Promise((resolve) => setTimeout(resolve, 1500))]);
  console.log(JSON.stringify(report, null, 2));
  process.exit(errors.length ? 2 : 0);
})().catch((error) => { console.error(error.stack || error); process.exit(1); });
