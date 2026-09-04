const { chromium } = require('C:\\Users\\Станислав\\Documents\\ChatGPT\\Yandex Games\\node_modules\\playwright-core');
const fs = require('fs');
const path = require('path');

const root = 'C:\\Yandex Games\\02 Orbital Salvage';
const shots = path.join(root, 'screenshots', 'CorePass05');
const base = process.env.COREPASS05_BASE || 'http://127.0.0.1:4192/index.html';
const browserPath = 'C:\\Program Files\\Yandex\\YandexBrowser\\Application\\browser.exe';

async function open(browser, query, viewport = { width: 1920, height: 1080 }, mobile = false) {
  const context = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
  page.on('console', message => { if (message.type() === 'error' && !message.text().includes('409')) errors.push(`console: ${message.text()}`); });
  await page.goto(`${base}${query}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  return { context, page, errors };
}
async function state(page) { return page.evaluate(() => window.__osQADebug || null); }
async function shot(page, name) { await page.screenshot({ path: path.join(shots, name) }); }

(async () => {
  fs.mkdirSync(shots, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: browserPath });
  const evidence = { errors: [], hull: {}, newRun: {} };

  let o = await open(browser, '?qaState=result&qaCredits=180');
  await shot(o.page, '04-result-1920x1080.png');
  evidence.errors.push(...o.errors); await o.context.close();

  o = await open(browser, '?qaState=upgrades&qaCredits=500');
  await shot(o.page, '05-upgrades-1920x1080.png');
  evidence.errors.push(...o.errors); await o.context.close();

  o = await open(browser, '?qaState=upgrades&qaCredits=0');
  await shot(o.page, '06-upgrade-disabled-1920x1080.png');
  evidence.errors.push(...o.errors); await o.context.close();

  o = await open(browser, '?qaState=upgrades&qaCredits=150&qaHullMax=3');
  evidence.hull.before = await state(o.page);
  await o.page.mouse.click(1550, 661);
  await o.page.waitForTimeout(350);
  evidence.hull.afterPurchase = await state(o.page);
  await shot(o.page, '07-upgrade-purchased-1920x1080.png');
  await o.page.mouse.click(960, 835);
  await o.page.waitForTimeout(450);
  evidence.hull.afterNewRun = await state(o.page);
  await shot(o.page, '08b-next-run-hull-1920x1080.png');
  evidence.errors.push(...o.errors); await o.context.close();

  o = await open(browser, '?qaState=upgrades&qaCredits=100&qaCargoMax=8');
  await o.page.mouse.click(350, 661);
  await o.page.waitForTimeout(350);
  await o.page.mouse.click(960, 835);
  await o.page.waitForTimeout(450);
  evidence.cargoAfterNewRun = await state(o.page);
  await shot(o.page, '08-next-run-1920x1080.png');
  evidence.errors.push(...o.errors); await o.context.close();

  o = await open(browser, '?qaState=upgrades&qaCredits=0');
  await o.page.mouse.click(960, 835);
  await o.page.waitForTimeout(450);
  evidence.newRun.mouse = await state(o.page);
  evidence.errors.push(...o.errors); await o.context.close();

  o = await open(browser, '?qaState=upgrades&qaCredits=0', { width: 1280, height: 720 }, true);
  await o.page.touchscreen.tap(640, 550);
  await o.page.waitForTimeout(450);
  evidence.newRun.touch = await state(o.page);
  evidence.errors.push(...o.errors); await o.context.close();

  o = await open(browser, '', { width: 720, height: 1280 }, true);
  await shot(o.page, '10-mobile-rotate.png');
  evidence.portrait = await o.page.evaluate(() => ({ width: innerWidth, height: innerHeight }));
  evidence.errors.push(...o.errors); await o.context.close();

  await browser.close();
  fs.writeFileSync(path.join(root, 'docs', 'corepass05-evidence-qa.json'), JSON.stringify(evidence, null, 2), 'utf8');
  console.log(JSON.stringify(evidence, null, 2));
  if (evidence.errors.length) process.exitCode = 1;
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
