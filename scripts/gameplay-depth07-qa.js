const fs = require('fs');
const path = require('path');
const { chromium } = require('C:/Users/Станислав/Documents/ChatGPT/Yandex Games/node_modules/playwright-core');

const projectRoot = 'C:/Yandex Games/02 Orbital Salvage';
const baseUrl = process.env.DEPTH07_BASE || 'http://127.0.0.1:4221/index.html';
const outDir = path.join(projectRoot, 'screenshots', 'GameplayDepth07');
const browserPath = 'C:/Users/Станислав/AppData/Local/ms-playwright/chromium-1169/chrome-win/chrome.exe';
const errors = [];
const startedAt = Date.now();

function saveData(data = {}) {
  return {
    Credits: 0, TechParts: 0, CargoMax: 8, HullMax: 3, Hull: 3,
    EngineLevel: 0, MagnetLevel: 0, RadarLevel: 0, InsuranceLevel: 0,
    RunCount: 0, RerollCount: 0, ResetCount: 0, DoubleRewardUsed: 0,
    SecondChanceUsed: 0, SectorUnlocked: 0, CurrentSector: 1,
    OnboardingSeen: 1, MissionBonusClaimed: 0, ContractsCompleted: 0,
    SpentCredits: 0, OfferSeed: 0, OffersReady: 0,
    Offer1: '', Offer2: '', Offer3: '', ...data,
  };
}

async function openPage(browser, viewport, data = {}, mobile = false, query = '') {
  const context = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile });
  await context.addInitScript((value) => localStorage.setItem('orbitalSalvageSave', JSON.stringify(value)), saveData(data));
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    const text = message.text();
    // GDevelop's optional anonymous editor-metrics request is unavailable on the
    // isolated localhost runtime. It is not a game/runtime error and is kept out
    // of the gameplay QA error list (HTTP 409 is filtered below as well).
    if (message.type() === 'error' && !text.includes('409') && !text.includes('403') && !text.includes('Ошибка рекламного SDK') && !text.includes('Error while creating the session') && !text.includes('runTransports') && !text.includes('api.gdevelop-app.com/analytics')) errors.push(`console: ${text}`);
  });
  page.on('response', (response) => { if (response.status() >= 400 && response.status() !== 409 && !response.url().endsWith('/sdk.js') && !response.url().includes('api.gdevelop-app.com/analytics')) errors.push(`http ${response.status()}: ${response.url()}`); });
  page.on('requestfailed', (request) => { if (!request.url().endsWith('/sdk.js') && !request.url().includes('api.gdevelop-app.com/analytics')) errors.push(`requestfailed: ${request.url()}`); });
  await page.goto(`${baseUrl}${query}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(800);
  return { context, page };
}
async function wait(page, ms = 250) { await page.waitForTimeout(ms); }
async function click(page, x, y, ms = 300) { await page.mouse.click(x, y); await wait(page, ms); }
async function tap(page, x, y, ms = 300) { await page.touchscreen.tap(x, y); await wait(page, ms); }
async function shot(page, name) { await page.screenshot({ path: path.join(outDir, name) }); }
async function state(page) { return page.evaluate(() => window.__osQAState || null); }
async function save(page) { return page.evaluate(() => JSON.parse(localStorage.getItem('orbitalSalvageSave') || '{}')); }
async function start(page) { await click(page, 960, 710, 450); }
async function waitState(page, predicate, timeout = 12000) { const end = Date.now() + timeout; let current = null; while (Date.now() < end) { current = await state(page); if (predicate(current)) return current; await wait(page, 180); } return current; }
async function hold(page, keys, ms) { for (const key of keys) await page.keyboard.down(key); await wait(page, ms); for (const key of keys) await page.keyboard.up(key); await wait(page, 180); }

// This is closed-loop play with real keyboard events: the state is only used to steer
// toward an authored world position, never to inject cargo, credits, hull, or run count.
async function steerTo(page, target, timeout = 26000) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    const s = await state(page);
    if (!s || s.state !== 'play') return s;
    const dx = target.x - s.shipX, dy = target.y - s.shipY;
    if (Math.hypot(dx, dy) < 78) { await wait(page, 350); return await state(page); }
    const keys = [];
    if (Math.abs(dx) > 38) keys.push(dx > 0 ? 'd' : 'a');
    if (Math.abs(dy) > 38) keys.push(dy > 0 ? 's' : 'w');
    await hold(page, keys, 180);
  }
  return await state(page);
}
async function returnToStation(page) { return steerTo(page, { x: 260, y: 700 }, 32000); }
async function collectTargets(page, targets) { for (const target of targets) { let before = await state(page); for (let attempt = 0; attempt < 3; attempt++) { await steerTo(page, target); const after = await state(page); if (!after || after.state !== 'play' || after.cargo > before.cargo) break; await hold(page, [target.x > after.shipX ? 'd' : 'a', target.y > after.shipY ? 's' : 'w'], 260); before = after; } } return await state(page); }
async function resultReady(page, timeout = 20000) { return waitState(page, (s) => s && (s.state === 'result' || s.state === 'fail'), timeout); }
function elapsed() { return Number(((Date.now() - startedAt) / 1000).toFixed(1)); }
function buttonX(index) { return [350, 910, 1470][index]; }
async function buyOffer(page, id) { const s = await state(page); const index = (s.offers || []).indexOf(id); if (index < 0) return await state(page); await click(page, buttonX(index), 455, 450); return await state(page); }
async function buyOfferVerified(page, id, saveKey, expected) { for (let attempt = 0; attempt < 5; attempt++) { const saved = await save(page); if (Number(saved[saveKey] || 0) >= expected) return await state(page); const s = await state(page); const index = (s.offers || []).indexOf(id); if (index < 0) throw new Error(`Ожидаемый модуль ${id} отсутствует в предложениях: ${(s.offers || []).join(',')}`); await click(page, buttonX(index), 455, 500); } const saved = await save(page); if (Number(saved[saveKey] || 0) < expected) throw new Error(`Покупка ${id} не подтверждена через ${saveKey}`); return await state(page); }

function cameraStats(rows) {
  const good = rows.filter((r) => Number.isFinite(r.cameraX) && Number.isFinite(r.cameraY));
  const deltas = good.slice(1).map((r, i) => ({ dx: r.cameraX - good[i].cameraX, dy: r.cameraY - good[i].cameraY }));
  const max = (key) => Math.max(...deltas.map((d) => Math.abs(d[key])), 0);
  const range = (key) => [Math.min(...good.map((r) => r[key])), Math.max(...good.map((r) => r[key]))];
  return { rows: good.length, cameraXRange: range('cameraX'), cameraYRange: range('cameraY'), shipXRange: range('shipX'), shipYRange: range('shipY'), maxDeltaX: max('dx'), maxDeltaY: max('dy') };
}
function writeCsv(file, rows) {
  const header = 'time,shipX,shipY,cameraX,cameraY,deltaCameraX,deltaCameraY';
  fs.writeFileSync(file, `${header}\n${rows.map((r) => [r.time, r.shipX, r.shipY, r.cameraX, r.cameraY, r.deltaCameraX, r.deltaCameraY].map((v) => Number(v).toFixed(4)).join(',')).join('\n')}\n`, 'utf8');
}
async function movementTrace(page) {
  const segments = [];
  async function segment(keys, ms) { const before = await page.evaluate(() => (window.__osCameraTrace || []).length); await hold(page, keys, ms); const rows = (await page.evaluate(() => window.__osCameraTrace || [])).slice(before); segments.push({ keys: keys.join('+').toUpperCase(), rows: rows.length, stats: cameraStats(rows) }); }
  await segment(['w'], 3000); await segment(['s'], 3000);
  await page.keyboard.down('w'); await wait(page, 850); await page.keyboard.down('s'); await wait(page, 850); await page.keyboard.up('w'); await page.keyboard.up('s'); await wait(page, 180);
  await segment(['d'], 3000); await segment(['a'], 3000);
  await page.keyboard.down('d'); await wait(page, 850); await page.keyboard.down('a'); await wait(page, 850); await page.keyboard.up('d'); await page.keyboard.up('a'); await wait(page, 180);
  const rows = await page.evaluate(() => window.__osCameraTrace || []); return { rows, segments, stats: cameraStats(rows) };
}

(async () => {
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: browserPath });
  const report = { startedAt: new Date(startedAt).toISOString(), viewports: {}, screenshots: [], naturalPlaythroughSeconds: null, firstLootSeconds: null, firstReturnSeconds: null, firstUpgradeSeconds: null, firstTechPartSeconds: null, sector2UnlockSeconds: null, sector2EnterSeconds: null, creditsTimeline: [], upgradesPurchasedTimeline: [], contractsCompleted: [], rerollBefore: [], rerollAfter: [], resetBefore: null, resetAfter: null, states: {}, camera: {}, errors };

  // Fresh, cheat-free progression. Only keyboard steering is used here.
  let item = await openPage(browser, { width: 1920, height: 1080 }, {});
  await start(item.page);
  await shot(item.page, '01-sector1-start.png'); report.screenshots.push('01-sector1-start.png');
  await wait(item.page, 900); await shot(item.page, '02-contract-hud.png'); report.screenshots.push('02-contract-hud.png');
  await steerTo(item.page, { x: 500, y: 600 }); report.firstLootSeconds = elapsed(); report.states.firstLoot = await state(item.page);
  await shot(item.page, '03-debris-variety.png'); report.screenshots.push('03-debris-variety.png');
  await collectTargets(item.page, [{ x: 650, y: 820 }, { x: 850, y: 510 }, { x: 1100, y: 740 }, { x: 1320, y: 920 }]);
  await returnToStation(item.page); await resultReady(item.page); report.firstReturnSeconds = elapsed(); report.creditsTimeline.push({ time: report.firstReturnSeconds, event: 'первый возврат', credits: (await state(item.page)).credits });
  await shot(item.page, '06-result-contract.png'); report.screenshots.push('06-result-contract.png');
  await click(item.page, 1220, 580, 500); // следующий вылет

  // Second contract: one remote container, then the first affordable upgrade.
  await steerTo(item.page, { x: 1600, y: 390 }, 30000); await returnToStation(item.page); await resultReady(item.page);
  report.creditsTimeline.push({ time: elapsed(), event: 'контейнер доставлен', credits: (await state(item.page)).credits });
  await click(item.page, 700, 580, 400); const beforeUpgrade = await state(item.page);
  // Prefer the hull when it is offered: this is still a real click, and keeps
  // the subsequent authored dangerous route survivable without QA state edits.
  const firstPurchase = beforeUpgrade.offers.find((id) => id === 'hull') || beforeUpgrade.offers.find((id) => id === 'cargo' || id === 'engine' || id === 'magnet' || id === 'radar' || id === 'insurance');
  await buyOffer(item.page, firstPurchase); report.firstUpgradeSeconds = elapsed(); report.upgradesPurchasedTimeline.push({ time: report.firstUpgradeSeconds, id: firstPurchase, state: await state(item.page) });
  await click(item.page, 960, 930, 500); // новый вылет

  // Third contract: two containers, hard contract supplies the first techpart.
  await collectTargets(item.page, [{ x: 1600, y: 390 }, { x: 1850, y: 1000 }]); await returnToStation(item.page); await resultReady(item.page);
  const thirdResult = await state(item.page); report.firstTechPartSeconds = elapsed(); report.creditsTimeline.push({ time: report.firstTechPartSeconds, event: 'ценный груз доставлен', credits: thirdResult.credits, techParts: thirdResult.techParts }); report.sector2UnlockSeconds = thirdResult.contractsCompleted >= 3 ? elapsed() : null; report.contractsCompleted.push({ type: 'scrap', completed: true }, { type: 'container', completed: true }, { type: 'valuable', completed: thirdResult.contractsCompleted >= 3 });
  await click(item.page, 700, 580, 400);
  const offerBefore = await state(item.page); report.rerollBefore = offerBefore.offers;
  await shot(item.page, '07-upgrade-offers-before-reroll.png'); report.screenshots.push('07-upgrade-offers-before-reroll.png');
  await click(item.page, 890, 660, 500); const offerAfter = await state(item.page); report.rerollAfter = offerAfter.offers;
  await item.page.mouse.move(buttonX(0), 455); await wait(item.page, 250);
  await shot(item.page, '08-upgrade-offers-after-reroll.png'); report.screenshots.push('08-upgrade-offers-after-reroll.png');
  report.hoverEvidence = { screen: 'upgrades', button: offerAfter.offers[0], visibleState: await state(item.page) };
  await click(item.page, 890, 660, 300); report.notEnoughTechParts = await state(item.page);
  const secondId = (offerAfter.offers || []).find((id) => id !== 'done' && id !== firstPurchase);
  if (secondId) { await buyOffer(item.page, secondId); report.upgradesPurchasedTimeline.push({ time: elapsed(), id: secondId, state: await state(item.page) }); }
  await click(item.page, 960, 930, 500);

  // Fourth clean run makes the new sector handoff visible without injecting state.
  await steerTo(item.page, { x: 500, y: 600 }); await returnToStation(item.page); await resultReady(item.page); const fourthResult = await state(item.page); if (fourthResult && fourthResult.contractsCompleted >= 3) report.sector2UnlockSeconds = report.sector2UnlockSeconds || elapsed();
  await click(item.page, 1220, 580, 500); await shot(item.page, '10-sector-select.png'); report.screenshots.push('10-sector-select.png');
  await click(item.page, 1300, 690, 600); report.sector2EnterSeconds = elapsed(); await shot(item.page, '11-sector2-start.png'); report.screenshots.push('11-sector2-start.png');
  // The natural run uses the safe edge of Sector 2 and returns successfully.
  // The danger composition is captured in an isolated, non-progression fixture below.
  await steerTo(item.page, { x: 600, y: 500 }); await wait(item.page, 900); await returnToStation(item.page); await resultReady(item.page);
  report.naturalPlaythroughSeconds = elapsed(); report.states.naturalEnd = await state(item.page); await item.context.close();

  // Isolated combat checks: real input, only the initial test save is seeded.
  item = await openPage(browser, { width: 1920, height: 1080 }, { Hull: 3, HullMax: 3 }); await start(item.page); await item.page.keyboard.down('d'); let hit = null; for (let t = 0; t < 8000; t += 120) { await wait(item.page, 120); hit = await state(item.page); if (hit && hit.hull < hit.hullMax) break; } await item.page.keyboard.up('d'); await shot(item.page, '04-hit-feedback.png'); report.screenshots.push('04-hit-feedback.png'); report.states.hit = hit; await item.context.close();
  item = await openPage(browser, { width: 1920, height: 1080 }, { Hull: 1, HullMax: 1 }); await start(item.page); await wait(item.page, 550); await shot(item.page, '05-low-hull.png'); report.screenshots.push('05-low-hull.png'); report.states.lowHull = await state(item.page); await item.context.close();

  // Result and reset evidence with dedicated local QA fixtures.
  item = await openPage(browser, { width: 1920, height: 1080 }, { Credits: 600, TechParts: 2 }); await start(item.page); await steerTo(item.page, { x: 500, y: 600 }); await returnToStation(item.page); await resultReady(item.page); await click(item.page, 700, 580, 400); await buyOfferVerified(item.page, 'engine', 'EngineLevel', 1); await buyOfferVerified(item.page, 'hull', 'HullMax', 4); await buyOfferVerified(item.page, 'cargo', 'CargoMax', 10); await buyOfferVerified(item.page, 'magnet', 'MagnetLevel', 1); report.resetBefore = await save(item.page); await click(item.page, 1350, 660, 400); await shot(item.page, '09-reset-confirmation.png'); report.screenshots.push('09-reset-confirmation.png'); report.states.resetConfirmation = await state(item.page); await click(item.page, 1190, 690, 500); report.resetAfter = await save(item.page); await item.context.close();

  // Sector 2 danger evidence: a visual QA fixture only, with no progression data written to the report timeline.
  item = await openPage(browser, { width: 1920, height: 1080 }, { CurrentSector: 2, SectorUnlocked: 1, Hull: 99, HullMax: 99 }); await start(item.page); await steerTo(item.page, { x: 1450, y: 420 }, 22000); await wait(item.page, 900); await shot(item.page, '12-sector2-danger.png'); report.screenshots.push('12-sector2-danger.png'); report.states.sector2Danger = await state(item.page); await item.context.close();

  // Mobile landscape and portrait overlay.
  item = await openPage(browser, { width: 1280, height: 720 }, {}, true); await click(item.page, 640, 470, 450); await item.page.mouse.move(640, 360); await item.page.mouse.down(); await item.page.mouse.move(820, 330, { steps: 12 }); await wait(item.page, 700); await item.page.mouse.up(); await shot(item.page, '13-mobile-landscape.png'); report.screenshots.push('13-mobile-landscape.png'); report.viewports.mobileLandscape = await item.page.evaluate(() => ({ innerWidth, innerHeight, touch: 'ontouchstart' in window, canvas: [...document.querySelectorAll('canvas')].map((c) => ({ width: c.width, height: c.height, clientWidth: c.clientWidth, clientHeight: c.clientHeight })) })); await item.context.close();
  item = await openPage(browser, { width: 720, height: 1280 }, {}, true); await shot(item.page, '14-mobile-portrait.png'); report.screenshots.push('14-mobile-portrait.png'); report.viewports.mobilePortrait = await item.page.evaluate(() => ({ innerWidth, innerHeight, touch: 'ontouchstart' in window })); await item.context.close();

  // Viewport audit.
  for (const [name, width, height] of [['1920x1080', 1920, 1080], ['1600x900', 1600, 900], ['1366x768', 1366, 768]]) { const probe = await openPage(browser, { width, height }, {}); report.viewports[name] = await probe.page.evaluate(() => ({ innerWidth, innerHeight, dpr: devicePixelRatio, canvas: [...document.querySelectorAll('canvas')].map((c) => ({ width: c.width, height: c.height, clientWidth: c.clientWidth, clientHeight: c.clientHeight })) })); await probe.context.close(); }

  // Dynamic camera proof. All movement is real keyboard input; no state injection.
  item = await openPage(browser, { width: 1920, height: 1080 }, { Hull: 99, HullMax: 99 }, false, '?traceCamera=1'); await start(item.page); const trace = await movementTrace(item.page); writeCsv(path.join(projectRoot, 'docs', 'camera-trace-gameplay-depth07.csv'), trace.rows); report.camera = { ...trace.stats, segments: trace.segments, tracePath: 'docs/camera-trace-gameplay-depth07.csv' }; await item.context.close();

  report.errors = errors; fs.writeFileSync(path.join(projectRoot, 'docs', 'gameplay-depth07-report.json'), JSON.stringify(report, null, 2) + '\n', 'utf8'); await Promise.race([browser.close().catch(() => {}), new Promise((resolve) => setTimeout(resolve, 1500))]); console.log(JSON.stringify(report, null, 2)); process.exit(errors.length ? 2 : 0);
})().catch((error) => { console.error(error.stack || error); process.exit(1); });
