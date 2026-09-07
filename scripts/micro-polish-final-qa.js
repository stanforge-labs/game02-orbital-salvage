const { fs, path, root, launch, click, sleep } = require('./smart08-play');
const assert = require('assert/strict');
const out = path.join(root, 'screenshots', 'MicroPolishFinal');
const url = 'http://127.0.0.1:4230/index.html?dev=1';
fs.mkdirSync(out, { recursive: true });

async function attach(page) {
  await page.evaluate(() => {
    if (window.__microHook) return;
    window.__microHook = true;
    const proto = gdjs.RuntimeScene.prototype;
    const original = proto.renderAndStep;
    proto.renderAndStep = function (...args) {
      window.__microScene = this;
      return original.apply(this, args);
    };
  });
  await page.waitForFunction(() => window.__microScene && window.__osQAState);
}

async function objectClick(page, name, index = 0) {
  const point = await page.evaluate(([name, index]) => {
    const object = window.__microScene.getObjects(name)[index];
    return { x: object.getX() + object.getWidth() / 2, y: object.getY() + object.getHeight() / 2 };
  }, [name, index]);
  await click(page, point.x, point.y);
}

async function setResult(page, delivered, bonus) {
  await page.evaluate(({ delivered, bonus }) => {
    const scene = window.__microScene;
    const vars = scene.getVariables();
    vars.get('DeliveredValue').setNumber(delivered);
    vars.get('CargoValue').setNumber(delivered);
    vars.get('ContractRewardEarned').setNumber(bonus);
    vars.get('ScrapCount').setNumber(delivered ? 3 : 0);
    vars.get('ContainerCount').setNumber(0);
    vars.get('GameState').setString('result');
  }, { delivered, bonus });
  await sleep(page, 180);
}

(async () => {
  const session = await launch(url, { width: 1920, height: 1080 }, false, {
    SectorUnlocked: 1,
    CurrentSector: 1,
    ContractsCompleted: 5,
    Credits: 100,
    CargoMax: 10,
    HullMax: 4,
    Hull: 4,
  });
  try {
    const page = session.p;
    await attach(page);
    await objectClick(page, 'ButtonBg');
    await page.evaluate(() => {
      const scene = window.__microScene;
      scene.__os.floatText = 'СЕРИЯ x3\nБОНУС +5';
      scene.__os.floatLife = 1.05;
    });
    await sleep(page, 100);
    await page.screenshot({ path: path.join(out, '02-floating-text-after.png') });
    const floatingGap = await page.evaluate(() => {
      const scene = window.__microScene;
      const ship = scene.getObjects('Ship')[0];
      const text = scene.getObjects('PickupText')[0];
      return ship.getCenterYInScene() - (text.getY() + text.getHeight());
    });
    assert(floatingGap > 20, `floating text overlaps ship: gap ${floatingGap}`);

    await page.keyboard.press('F11');
    await sleep(page, 100);
    const productionDevText = await page.evaluate(() => {
      const scene = window.__microScene;
      return scene.getObjects('StatusText').map((o) => o.getString()).join(' ');
    });
    assert(!productionDevText.includes('DEV'));

    const exclusion = await page.evaluate(() => {
      const scene = window.__microScene;
      const cam = scene.__osCam;
      scene.__g13.pois[0].x = cam.x - 740;
      scene.__g13.pois[0].y = cam.y - 440;
      return true;
    });
    assert(exclusion);
    await sleep(page, 80);
    const poiHidden = await page.evaluate(() => window.__microScene.getObjects('ProcPOI')[0].isHidden());
    assert(poiHidden, 'large POI remained visible behind top HUD');
    await page.screenshot({ path: path.join(out, '03-top-hud-exclusion-after.png') });

    await setResult(page, 0, 0);
    const emptyTitle = await page.evaluate(() => window.__microScene.getObjects('ResultTitle')[0].getString());
    assert.equal(emptyTitle, 'ВОЗВРАЩЕНИЕ ЗАВЕРШЕНО');
    await page.screenshot({ path: path.join(out, '04-empty-return-after.png') });

    await setResult(page, 36, 0);
    const lootTitle = await page.evaluate(() => window.__microScene.getObjects('ResultTitle')[0].getString());
    assert.equal(lootTitle, 'ГРУЗ ДОСТАВЛЕН');
    await page.screenshot({ path: path.join(out, '05-loot-return-after.png') });
    assert.equal(session.errors.length, 0, session.errors.join('\n'));
    fs.writeFileSync(path.join(root, 'docs', 'micro-polish-final-report.json'), JSON.stringify({
      floatingGap,
      productionDevLabelsHidden: true,
      topHudExclusion: poiHidden,
      emptyReturnTitle: emptyTitle,
      lootReturnTitle: lootTitle,
      seeds: [130013, 230027, 330037, 430049, 530051],
      runtimeErrors: session.errors,
    }, null, 2));
  } finally {
    await session.browser.close();
  }
})().catch((error) => { console.error(error.stack); process.exit(1); });
