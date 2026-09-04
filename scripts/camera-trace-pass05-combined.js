const { chromium } = require('C:\\Users\\Станислав\\Documents\\ChatGPT\\Yandex Games\\node_modules\\playwright-core');
const fs = require('fs');

const base = process.env.COREPASS05_BASE || 'http://127.0.0.1:4189/index.html';
const csvPath = 'C:\\Yandex Games\\02 Orbital Salvage\\docs\\camera-trace-pass05.csv';
const jsonPath = 'C:\\Yandex Games\\02 Orbital Salvage\\docs\\camera-trace-pass05-combined.json';

function sleep(page, ms) { return page.waitForTimeout(ms); }

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Yandex\\YandexBrowser\\Application\\browser.exe' });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  await page.goto(`${base}?qaState=play&qaTrace=1`, { waitUntil: 'networkidle' });
  await sleep(page, 700);

  const phases = [];
  async function hold(key, ms, name) {
    phases.push({ name, start: performance.now() });
    await page.keyboard.down(key);
    await sleep(page, ms);
    await page.keyboard.up(key);
    await sleep(page, 120);
  }
  async function reverse(first, second, name) {
    phases.push({ name, start: performance.now() });
    await page.keyboard.down(first);
    await sleep(page, 900);
    await page.keyboard.down(second);
    await sleep(page, 900);
    await page.keyboard.up(first);
    await page.keyboard.up(second);
    await sleep(page, 120);
  }

  await hold('w', 3000, 'W 3 sec');
  await hold('s', 3000, 'S 3 sec');
  await reverse('w', 's', 'W→S');
  await reverse('s', 'w', 'S→W');
  await hold('d', 3000, 'D 3 sec');
  await hold('a', 3000, 'A 3 sec');
  await reverse('d', 'a', 'D→A');
  await reverse('a', 'd', 'A→D');
  await sleep(page, 250);

  const trace = await page.evaluate(() => window.__osTrace || []);
  if (trace.length < 100) throw new Error(`Telemetry too short: ${trace.length}`);
  const rows = trace.map((row, i) => ({
    time: i ? (row.t - trace[0].t) / 1000 : 0,
    shipX: row.shipX, shipY: row.shipY, cameraX: row.cameraX, cameraY: row.cameraY,
    deltaCameraX: i ? row.cameraX - trace[i - 1].cameraX : 0,
    deltaCameraY: i ? row.cameraY - trace[i - 1].cameraY : 0
  }));
  const range = key => [Math.min(...rows.map(row => row[key])), Math.max(...rows.map(row => row[key]))];
  const summary = {
    rows: rows.length,
    shipXRange: range('shipX'), shipYRange: range('shipY'),
    cameraXRange: range('cameraX'), cameraYRange: range('cameraY'),
    maxAbsDeltaX: Math.max(...rows.map(row => Math.abs(row.deltaCameraX))),
    maxAbsDeltaY: Math.max(...rows.map(row => Math.abs(row.deltaCameraY))),
    phases: phases.map(phase => phase.name),
    firstTimestamp: trace[0].t,
    lastTimestamp: trace[trace.length - 1].t
  };
  fs.writeFileSync(jsonPath, JSON.stringify({ summary, rows }, null, 2), 'utf8');
  const header = 'time,shipX,shipY,cameraX,cameraY,deltaCameraX,deltaCameraY\n';
  const body = rows.map(row => [row.time, row.shipX, row.shipY, row.cameraX, row.cameraY, row.deltaCameraX, row.deltaCameraY].join(',')).join('\n');
  fs.writeFileSync(csvPath, header + body + '\n', 'utf8');
  console.log(JSON.stringify(summary, null, 2));
  await browser.close();
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
