const fs = require('fs');
const crypto = require('crypto');

const file = process.argv[2] || 'game.json';
const project = JSON.parse(fs.readFileSync(file, 'utf8'));
const layout = project.layouts.find((item) => item.name === 'OrbitalSalvage') || project.layouts[0];
const uuid = () => crypto.randomUUID();
const object = (name) => layout.objects.find((item) => item.name === name);
const hasObject = (name) => Boolean(object(name));
const hasVar = (name) => layout.variables.some((item) => item.name === name);
const addVar = (name, type, value) => {
  if (!hasVar(name)) layout.variables.push({ name, persistentUuid: uuid(), type, value });
};
const cloneObject = (name, baseName, mutate = () => {}) => {
  if (hasObject(name)) return object(name);
  const clone = JSON.parse(JSON.stringify(object(baseName)));
  clone.name = name;
  mutate(clone);
  layout.objects.push(clone);
  return clone;
};
const instances = (name) => layout.instances.filter((item) => item.name === name);
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
  if (obj && obj.animations && obj.animations[0] && obj.animations[0].directions[0] && obj.animations[0].directions[0].sprites[0]) {
    obj.animations[0].directions[0].sprites[0].image = image;
  }
};
if (!project.resources.resources.some((item) => item.file === 'assets/game/ui_damage_flash.svg')) {
  project.resources.resources.push({ file: 'assets/game/ui_damage_flash.svg', kind: 'image', metadata: '', name: 'assets/game/ui_damage_flash.svg', smoothed: true, userAdded: true });
}

addVar('SectorUnlocked', 'number', 0);
addVar('CurrentSector', 'number', 1);
addVar('OnboardingSeen', 'number', 0);
addVar('MissionBonusClaimed', 'number', 0);

cloneObject('DamageFlash', 'Haze', (o) => { o.animations[0].directions[0].sprites[0].image = 'assets/game/ui_damage_flash.svg'; });
cloneObject('OnboardingText', 'MissionText', (o) => {
  o.bold = true; o.characterSize = 18; o.content.bold = true; o.content.characterSize = 18;
  o.string = 'WASD / СТРЕЛКИ — ДВИЖЕНИЕ\nСОБИРАЙТЕ ЛОМ\nВОЗВРАЩАЙТЕСЬ НА СТАНЦИЮ';
  o.content.text = o.string; o.textAlignment = 'left'; o.content.textAlignment = 'left';
});
cloneObject('SectorSelectPanel', 'UpgradePanel');
cloneObject('SectorSelectTitle', 'UpgradeTitle', (o) => { o.string = 'ВЫБЕРИТЕ СЕКТОР'; o.content.text = o.string; });
cloneObject('SectorSelectText', 'UpgradeCardText', (o) => { o.characterSize = 22; o.content.characterSize = 22; });
cloneObject('SectorSelectButtonBg', 'UpgradeButtonBg');
cloneObject('SectorSelectButtonText', 'UpgradeButtonText', (o) => { o.characterSize = 22; o.content.characterSize = 22; });
cloneObject('SectorSelectHint', 'MissionText', (o) => { o.characterSize = 18; o.content.characterSize = 18; });
cloneObject('SectorSelectBackBg', 'UpgradeBackButtonBg');
cloneObject('SectorSelectBackText', 'UpgradeBackText', (o) => { o.characterSize = 22; o.content.characterSize = 22; });
cloneObject('ResultSectorButtonBg', 'ResultButtonBg');
cloneObject('ResultSectorButtonText', 'ResultText', (o) => { o.characterSize = 20; o.content.characterSize = 20; });
cloneObject('Sector2Band', 'DangerZone', (o) => { o.animations[0].directions[0].sprites[0].image = 'assets/game/debris_field.png'; });
cloneObject('Sector2Label', 'DangerLabel', (o) => { o.string = 'ПОЯС ОБЛОМКОВ'; o.content.text = o.string; });

// Second row of independent upgrade cards. The existing system buttons become their card buttons.
if (instances('UpgradeCardBg').length < 6) {
  [170, 730, 1290].forEach((x) => addInstance('UpgradeCardBg', { x, y: 555, width: 520, height: 340, zOrder: 20 }));
}
if (instances('UpgradeCardText').length < 6) {
  [170, 730, 1290].forEach((x) => addInstance('UpgradeCardText', { x: x + 20, y: 620, width: 480, height: 180, zOrder: 23 }));
}

// Clean two-row upgrade layout.
setAll('UpgradePanel', { x: 60, y: 28, width: 1800, height: 1020 });
const topXs = [140, 700, 1260];
instances('UpgradeCardBg').slice(0, 3).forEach((item, i) => Object.assign(item, { x: topXs[i], y: 155, width: 520, height: 340 }));
instances('UpgradeCardText').slice(0, 3).forEach((item, i) => Object.assign(item, { x: topXs[i] + 20, y: 270, width: 480, height: 180 }));
instances('UpgradeCardBg').slice(3, 6).forEach((item, i) => Object.assign(item, { x: topXs[i], y: 530, width: 520, height: 340 }));
instances('UpgradeCardText').slice(3, 6).forEach((item, i) => Object.assign(item, { x: topXs[i] + 20, y: 645, width: 480, height: 180 }));
instances('UpgradeButtonBg').slice(0, 3).forEach((item, i) => Object.assign(item, { x: topXs[i] + 35, y: 420, width: 450, height: 70, zOrder: 24 }));
instances('UpgradeButtonText').slice(0, 3).forEach((item, i) => Object.assign(item, { x: topXs[i] + 35, y: 438, width: 450, height: 38, zOrder: 25 }));
instances('SystemButtonBg').forEach((item, i) => Object.assign(item, { x: topXs[i] + 35, y: 790, width: 450, height: 62, zOrder: 24 }));
instances('SystemButtonText').forEach((item, i) => Object.assign(item, { x: topXs[i] + 35, y: 805, width: 450, height: 38, zOrder: 25 }));
setAll('UpgradeTitle', { x: 300, y: 82, width: 1320, height: 56 });
setAll('TechText', { x: 1280, y: 82, width: 260, height: 70 });
setAll('RerollButtonBg', { x: 1550, y: 92, width: 270, height: 64 });
setAll('RerollButtonText', { x: 1550, y: 105, width: 270, height: 38 });
setAll('ResetButtonBg', { x: 175, y: 900, width: 450, height: 60 });
setAll('ResetButtonText', { x: 175, y: 914, width: 450, height: 38 });
setAll('UpgradeBackButtonBg', { x: 735, y: 900, width: 450, height: 60 });
setAll('UpgradeBackText', { x: 735, y: 914, width: 450, height: 38 });
setAll('UpgradeNotice', { x: 520, y: 145, width: 880, height: 34 });

// Result panel has room for an explicit sector action after unlock.
setAll('ResultPanel', { x: 400, y: 140, width: 1120, height: 620 });
setAll('ResultTitle', { x: 500, y: 185, width: 920, height: 70 });
setAll('ResultStats', { x: 590, y: 290, width: 740, height: 220 });
instances('ResultButtonBg').forEach((item, i) => Object.assign(item, { x: i === 0 ? 450 : 980, y: 540, width: 490, height: 78 }));
instances('ResultText').forEach((item, i) => Object.assign(item, { x: i === 0 ? 450 : 980, y: 565, width: 490, height: 42 }));
setAll('RewardButtonBg', { x: 760, y: 455, width: 400, height: 62 });
setAll('RewardButtonText', { x: 760, y: 468, width: 400, height: 40 });
if (!instances('ResultSectorButtonBg').length) addInstance('ResultSectorButtonBg', { x: 760, y: 635, width: 400, height: 68, zOrder: 20 });
if (!instances('ResultSectorButtonText').length) addInstance('ResultSectorButtonText', { x: 760, y: 650, width: 400, height: 38, zOrder: 23 });

// Sector selection overlay.
if (!instances('SectorSelectPanel').length) addInstance('SectorSelectPanel', { x: 180, y: 85, width: 1560, height: 910, zOrder: 30 });
if (!instances('SectorSelectTitle').length) addInstance('SectorSelectTitle', { x: 420, y: 190, width: 1080, height: 60, zOrder: 34 });
if (instances('SectorSelectText').length < 2) {
  addInstance('SectorSelectText', { x: 350, y: 350, width: 520, height: 260, zOrder: 34 });
  addInstance('SectorSelectText', { x: 1050, y: 350, width: 520, height: 260, zOrder: 34 });
}
if (instances('SectorSelectButtonBg').length < 2) {
  addInstance('SectorSelectButtonBg', { x: 380, y: 620, width: 460, height: 78, zOrder: 32 });
  addInstance('SectorSelectButtonBg', { x: 1060, y: 620, width: 460, height: 78, zOrder: 32 });
}
if (instances('SectorSelectButtonText').length < 2) {
  addInstance('SectorSelectButtonText', { x: 380, y: 640, width: 460, height: 42, zOrder: 35 });
  addInstance('SectorSelectButtonText', { x: 1060, y: 640, width: 460, height: 42, zOrder: 35 });
}
if (!instances('SectorSelectHint').length) addInstance('SectorSelectHint', { x: 420, y: 260, width: 1080, height: 70, zOrder: 34 });
if (!instances('SectorSelectBackBg').length) addInstance('SectorSelectBackBg', { x: 735, y: 790, width: 450, height: 72, zOrder: 32 });
if (!instances('SectorSelectBackText').length) addInstance('SectorSelectBackText', { x: 735, y: 808, width: 450, height: 38, zOrder: 35 });

// First-run helper and damage overlay.
if (!instances('OnboardingText').length) addInstance('OnboardingText', { x: 60, y: 850, width: 560, height: 128, zOrder: 28 });
if (!instances('DamageFlash').length) addInstance('DamageFlash', { x: 0, y: 0, width: 1920, height: 1080, layer: 'HUD', zOrder: 80 });

// Extra rare containers are still the same object/mechanic, only more visible in sector 2.
if (instances('RareContainer').length < 3) {
  addInstance('RareContainer', { x: 1600, y: 390, width: 92, height: 92, layer: 'World', zOrder: 7 });
  addInstance('RareContainer', { x: 1750, y: 960, width: 92, height: 92, layer: 'World', zOrder: 7 });
}

// Sector 2 visual band and label.
if (!instances('Sector2Band').length) addInstance('Sector2Band', { x: 920, y: 170, width: 760, height: 520, layer: 'World', zOrder: 2 });
if (!instances('Sector2Label').length) addInstance('Sector2Label', { x: 1180, y: 190, width: 520, height: 52, layer: 'World', zOrder: 12 });

setText('TechText', { string: 'ТЕХНОДЕТАЛИ\n🔧 0', content: { text: 'ТЕХНОДЕТАЛИ\n🔧 0' } });
setAll('MissionPanel', { x: 650, y: 25, width: 620, height: 150 });
setAll('MissionText', { x: 680, y: 78, width: 560, height: 86 });
setText('MissionText', { characterSize: 16, textAlignment: 'center', bold: true, content: { characterSize: 16, textAlignment: 'center', bold: true, lineHeight: 0 } });
setSprite('MissionPanel', 'assets/game/ui_full_card.svg');
setSprite('RotatePanel', 'assets/game/ui_full_screen.svg');
setAll('RotatePanel', { x: 35, y: 325, width: 520, height: 430 });
setAll('RotateDevice', { x: 255, y: 370, width: 80, height: 64 });
setAll('RotateTitle', { x: 95, y: 500, width: 400, height: 72 });
setAll('RotateHint', { x: 75, y: 610, width: 440, height: 70 });
setText('SectorSelectHint', { string: 'Выберите маршрут вылета', content: { text: 'Выберите маршрут вылета' } });
setText('OnboardingText', { string: 'WASD / СТРЕЛКИ — ДВИЖЕНИЕ\nСОБИРАЙТЕ ЛОМ\nВОЗВРАЩАЙТЕСЬ НА СТАНЦИЮ', content: { text: 'WASD / СТРЕЛКИ — ДВИЖЕНИЕ', lineHeight: 0 } });

fs.writeFileSync(file, JSON.stringify(project, null, 2) + '\n', 'utf8');
console.log('Release Polish 06 layout prepared');
