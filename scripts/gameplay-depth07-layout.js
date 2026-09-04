const fs = require('fs');
const crypto = require('crypto');

const file = process.argv[2] || 'game.json';
const project = JSON.parse(fs.readFileSync(file, 'utf8'));
const layout = project.layouts.find((item) => item.name === 'OrbitalSalvage') || project.layouts[0];
const uuid = () => crypto.randomUUID();
const object = (name) => layout.objects.find((item) => item.name === name);
const hasObject = (name) => Boolean(object(name));
const instances = (name) => layout.instances.filter((item) => item.name === name);
const hasVar = (name) => layout.variables.some((item) => item.name === name);
const addVar = (name, type, value) => {
  if (!hasVar(name)) layout.variables.push({ name, persistentUuid: uuid(), type, value });
};
const addResource = (fileName, kind = 'image') => {
  if (!project.resources.resources.some((item) => item.file === fileName)) {
    project.resources.resources.push({ file: fileName, kind, metadata: '', name: fileName, smoothed: true, userAdded: true });
  }
};
const cloneObject = (name, baseName, mutate = () => {}) => {
  if (hasObject(name)) return object(name);
  const clone = JSON.parse(JSON.stringify(object(baseName)));
  clone.name = name;
  mutate(clone);
  layout.objects.push(clone);
  return clone;
};
const addInstance = (name, props) => {
  const instance = { angle: 0, customSize: true, height: 60, layer: 'HUD', locked: true, name, persistentUuid: uuid(), width: 320, x: 0, y: 0, zOrder: 22, numberProperties: [], stringProperties: [], initialVariables: [] };
  Object.assign(instance, props);
  layout.instances.push(instance);
  return instance;
};
const setAll = (name, props) => instances(name).forEach((item) => Object.assign(item, props));
const setText = (name, props) => Object.assign(object(name), props, { content: Object.assign(object(name).content, props.content || {}) });
const setSprite = (name, image) => {
  const obj = object(name);
  if (obj?.animations?.[0]?.directions?.[0]?.sprites?.[0]) obj.animations[0].directions[0].sprites[0].image = image;
};
const appendSprite = (name, image) => {
  const obj = object(name);
  const sprites = obj?.animations?.[0]?.directions?.[0]?.sprites;
  if (!sprites || sprites.some((sprite) => sprite.image === image)) return;
  sprites.push({ hasCustomCollisionMask: false, image, points: [], originPoint: { name: 'origine', x: 0, y: 0 }, centerPoint: { automatic: true, name: 'centre', x: 0, y: 0 }, customCollisionMask: [] });
};

[
  'assets/game/salvage_engine.svg', 'assets/game/salvage_beam.svg',
  'assets/game/asteroid_small.svg', 'assets/game/asteroid_medium.svg', 'assets/game/asteroid_large.svg', 'assets/game/asteroid_crystal.svg',
  'assets/game/sector2_haze.svg', 'assets/game/sector2_wreck.svg', 'assets/game/sector2_wreck2.svg'
].forEach((fileName) => {
  addResource(fileName, 'image');
  const resource = project.resources.resources.find((item) => item.file === fileName);
  if (resource) {
    resource.kind = 'image';
    resource.name = fileName;
  }
});

['ContractsCompleted', 'SpentCredits', 'OfferSeed', 'MissionTimeLimit', 'MissionTechReward', 'MissionZoneTarget', 'ResetRefund'].forEach((name) => addVar(name, 'number', 0));
['Offer1', 'Offer2', 'Offer3'].forEach((name) => addVar(name, 'string', 'cargo'));

appendSprite('CommonSalvage', 'assets/game/salvage_engine.svg');
appendSprite('CommonSalvage', 'assets/game/salvage_beam.svg');
['assets/game/asteroid_small.svg', 'assets/game/asteroid_medium.svg', 'assets/game/asteroid_large.svg', 'assets/game/asteroid_crystal.svg'].forEach((image) => appendSprite('Debris', image));
appendSprite('FastDebris', 'assets/game/asteroid_crystal.svg');

cloneObject('TechPanel', 'UpgradeCardBg', (o) => { o.name = 'TechPanel'; });
cloneObject('TechHint', 'UpgradeCardText', (o) => { o.name = 'TechHint'; o.characterSize = 18; o.content.characterSize = 18; o.string = 'СПЕЦИАЛЬНЫЕ ДЕЙСТВИЯ'; o.content.text = o.string; });
cloneObject('ResetConfirmPanel', 'UpgradePanel');
cloneObject('ResetConfirmTitle', 'UpgradeTitle');
cloneObject('ResetConfirmText', 'ResultStats', (o) => { o.characterSize = 22; o.content.characterSize = 22; });
cloneObject('ResetConfirmCancelBg', 'UpgradeBackButtonBg');
cloneObject('ResetConfirmCancelText', 'UpgradeBackText');
cloneObject('ResetConfirmOkBg', 'UpgradeButtonBg');
cloneObject('ResetConfirmOkText', 'UpgradeButtonText');
cloneObject('SectorCardBg', 'UpgradeCardBg');
cloneObject('Sector2Dust', 'Sector2Band', (o) => { setSprite('Sector2Dust', 'assets/game/sector2_haze.svg'); });
cloneObject('Sector2Wreck', 'Sector2Band', (o) => { setSprite('Sector2Wreck', 'assets/game/sector2_wreck.svg'); });
cloneObject('Sector2Wreck2', 'Sector2Band', (o) => { setSprite('Sector2Wreck2', 'assets/game/sector2_wreck2.svg'); });

// The three offers occupy the upper row. Lower card slots become one compact system block.
setAll('UpgradePanel', { x: 60, y: 28, width: 1800, height: 1020 });
const topXs = [140, 700, 1260];
instances('UpgradeCardBg').slice(0, 3).forEach((item, i) => Object.assign(item, { x: topXs[i], y: 160, width: 520, height: 320, zOrder: 20 }));
instances('UpgradeCardText').slice(0, 3).forEach((item, i) => Object.assign(item, { x: topXs[i] + 20, y: 270, width: 480, height: 180, zOrder: 23 }));
instances('UpgradeButtonBg').slice(0, 3).forEach((item, i) => Object.assign(item, { x: topXs[i] + 35, y: 420, width: 450, height: 70, zOrder: 24 }));
instances('UpgradeButtonText').slice(0, 3).forEach((item, i) => Object.assign(item, { x: topXs[i] + 35, y: 438, width: 450, height: 38, zOrder: 25 }));
setAll('UpgradeTitle', { x: 300, y: 72, width: 1000, height: 60 });
setAll('TechText', { x: 1380, y: 72, width: 360, height: 70 });
setAll('UpgradeNotice', { x: 500, y: 132, width: 900, height: 34 });
setAll('RerollButtonBg', { x: 680, y: 620, width: 420, height: 78 });
setAll('RerollButtonText', { x: 680, y: 640, width: 420, height: 42 });
setAll('ResetButtonBg', { x: 1140, y: 620, width: 420, height: 78 });
setAll('ResetButtonText', { x: 1140, y: 640, width: 420, height: 42 });
setAll('UpgradeBackButtonBg', { x: 735, y: 900, width: 450, height: 60 });
setAll('UpgradeBackText', { x: 735, y: 914, width: 450, height: 38 });
if (!instances('TechPanel').length) addInstance('TechPanel', { x: 140, y: 560, width: 1640, height: 170, zOrder: 18 });
if (!instances('TechHint').length) addInstance('TechHint', { x: 210, y: 615, width: 400, height: 42, zOrder: 23 });
setAll('TechPanel', { x: 140, y: 560, width: 1640, height: 170, zOrder: 18 });
setAll('TechHint', { x: 210, y: 615, width: 400, height: 42, zOrder: 23 });
setAll('RerollButtonBg', { x: 680, y: 600, width: 420, height: 74 });
setAll('RerollButtonText', { x: 680, y: 622, width: 420, height: 40 });
setAll('ResetButtonBg', { x: 1140, y: 600, width: 420, height: 74 });
setAll('ResetButtonText', { x: 1140, y: 622, width: 420, height: 40 });

// Compact contract card.
setAll('MissionPanel', { x: 700, y: 28, width: 520, height: 145 });
setAll('MissionText', { x: 725, y: 62, width: 470, height: 100 });
setText('MissionText', { characterSize: 16, textAlignment: 'center', bold: true, content: { characterSize: 16, textAlignment: 'center', bold: true, lineHeight: 0 } });

// Sector select receives two real card backgrounds.
if (instances('SectorCardBg').length < 2) {
  addInstance('SectorCardBg', { x: 300, y: 330, width: 620, height: 390, zOrder: 31 });
  addInstance('SectorCardBg', { x: 1000, y: 330, width: 620, height: 390, zOrder: 31 });
}
instances('SectorCardBg').forEach((item, i) => Object.assign(item, { x: i === 0 ? 300 : 1000, y: 330, width: 620, height: 390, zOrder: 31 }));
instances('SectorSelectText').forEach((item, i) => Object.assign(item, { x: i === 0 ? 350 : 1050, y: 430, width: 520, height: 230, zOrder: 34 }));
setAll('SectorSelectButtonBg', { y: 630, height: 78 });
setAll('SectorSelectButtonText', { y: 654, height: 40 });
setAll('SectorSelectBackBg', { y: 820 });
setAll('SectorSelectBackText', { y: 839 });

// Reset confirmation modal, centered on the 1920×1080 HUD canvas.
if (!instances('ResetConfirmPanel').length) addInstance('ResetConfirmPanel', { x: 440, y: 295, width: 1040, height: 490, zOrder: 70 });
if (!instances('ResetConfirmTitle').length) addInstance('ResetConfirmTitle', { x: 540, y: 350, width: 840, height: 58, zOrder: 74 });
if (!instances('ResetConfirmText').length) addInstance('ResetConfirmText', { x: 560, y: 430, width: 800, height: 150, zOrder: 74 });
if (!instances('ResetConfirmCancelBg').length) addInstance('ResetConfirmCancelBg', { x: 545, y: 650, width: 360, height: 74, zOrder: 72 });
if (!instances('ResetConfirmCancelText').length) addInstance('ResetConfirmCancelText', { x: 545, y: 672, width: 360, height: 40, zOrder: 75 });
if (!instances('ResetConfirmOkBg').length) addInstance('ResetConfirmOkBg', { x: 1015, y: 650, width: 360, height: 74, zOrder: 72 });
if (!instances('ResetConfirmOkText').length) addInstance('ResetConfirmOkText', { x: 1015, y: 672, width: 360, height: 40, zOrder: 75 });
setSprite('ResetConfirmPanel', 'assets/game/ui_full_screen.svg');
setSprite('ResetConfirmCancelBg', 'assets/game/ui_full_button.svg');
setSprite('ResetConfirmOkBg', 'assets/game/ui_full_button.svg');
setText('ResetConfirmTitle', { characterSize: 30, textAlignment: 'center', content: { characterSize: 30, textAlignment: 'center' } });
setText('ResetConfirmText', { characterSize: 22, textAlignment: 'center', content: { characterSize: 22, textAlignment: 'center' } });
setText('ResetConfirmCancelText', { characterSize: 20, textAlignment: 'center', content: { characterSize: 20, textAlignment: 'center' } });
setText('ResetConfirmOkText', { characterSize: 20, textAlignment: 'center', content: { characterSize: 20, textAlignment: 'center' } });

// Sector 2 gets a distinct cool haze and two large wreck silhouettes.
setSprite('Sector2Dust', 'assets/game/sector2_haze.svg');
setSprite('Sector2Wreck', 'assets/game/sector2_wreck.svg');
setSprite('Sector2Wreck2', 'assets/game/sector2_wreck2.svg');
if (!instances('Sector2Dust').length) addInstance('Sector2Dust', { x: 1020, y: 130, width: 1000, height: 820, layer: 'World', zOrder: 1 });
if (!instances('Sector2Wreck').length) addInstance('Sector2Wreck', { x: 1180, y: 270, width: 420, height: 260, layer: 'World', zOrder: 2 });
if (!instances('Sector2Wreck2').length) addInstance('Sector2Wreck2', { x: 1600, y: 900, width: 360, height: 230, layer: 'World', zOrder: 2 });

// Keep world labels below the HUD safe area when the camera is over the
// dangerous pocket; they remain readable without being clipped at the top.
setAll('Sector2Label', { x: 1180, y: 360, width: 520, height: 52 });
setAll('DangerLabel', { x: 1500, y: 650, width: 280, height: 42 });

setText('UpgradeTitle', { string: 'ПРЕДЛОЖЕНИЯ МОДУЛЕЙ', content: { text: 'ПРЕДЛОЖЕНИЯ МОДУЛЕЙ' } });
setText('TechText', { string: 'ТЕХНОДЕТАЛИ\n🔧 0', content: { text: 'ТЕХНОДЕТАЛИ\n🔧 0' } });
setText('ResetConfirmTitle', { string: 'СБРОСИТЬ УЛУЧШЕНИЯ?', content: { text: 'СБРОСИТЬ УЛУЧШЕНИЯ?' } });
setText('ResetConfirmText', { string: 'Все установленные модули будут сняты.\nВы получите обратно 75% потраченных кредитов.\nСтоимость: 🔧 1', content: { text: 'Все установленные модули будут сняты.\nВы получите обратно 75% потраченных кредитов.\nСтоимость: 🔧 1' } });
setText('ResetConfirmCancelText', { string: 'ОТМЕНА', content: { text: 'ОТМЕНА' } });
setText('ResetConfirmOkText', { string: 'СБРОСИТЬ', content: { text: 'СБРОСИТЬ' } });

// Reuse existing button sprites for the system block and make the lower row invisible at runtime.
setSprite('TechPanel', 'assets/game/ui_full_card.svg');
setSprite('SectorCardBg', 'assets/game/ui_full_card.svg');

// These legacy result controls duplicated the sector/new-run action in the result card.
// Remove both their instances and object definitions so the source project cannot revive them.
const obsoleteResultControls = new Set(['ResultSectorButtonBg', 'ResultSectorButtonText']);
layout.instances = layout.instances.filter((item) => !obsoleteResultControls.has(item.name));
layout.objects = layout.objects.filter((item) => !obsoleteResultControls.has(item.name));

fs.writeFileSync(file, JSON.stringify(project, null, 2) + '\n', 'utf8');
console.log('Gameplay Depth 07 layout prepared');
