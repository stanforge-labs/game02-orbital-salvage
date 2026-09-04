const fs = require('fs');
const crypto = require('crypto');

const projectPath = process.argv[2] || 'game.json';
const project = JSON.parse(fs.readFileSync(projectPath, 'utf8'));
const layout = project.layouts.find((item) => item.name === 'OrbitalSalvage') || project.layouts[0];

const uuid = () => crypto.randomUUID();
const hasVar = (name) => layout.variables.some((item) => item.name === name);
const addVar = (name, type, value) => {
  if (!hasVar(name)) {
    layout.variables.push({ name, persistentUuid: uuid(), type, value });
  }
};

[
  ['TechParts', 'number', 0],
  ['Mission', 'string', 'СОБЕРИТЕ 5 ЕД. МЕТАЛЛОЛОМА'],
  ['MissionType', 'string', 'scrap'],
  ['MissionProgress', 'number', 0],
  ['MissionTarget', 'number', 5],
  ['MissionReward', 'number', 30],
  ['RunCount', 'number', 0],
  ['RunDamage', 'number', 0],
  ['MagnetLevel', 'number', 0],
  ['RadarLevel', 'number', 0],
  ['InsuranceLevel', 'number', 0],
  ['RerollCount', 'number', 0],
  ['ResetCount', 'number', 0],
  ['DoubleRewardUsed', 'number', 0],
  ['SecondChanceUsed', 'number', 0],
].forEach(([name, type, value]) => addVar(name, type, value));

const byName = (name) => layout.objects.find((item) => item.name === name);
const addObject = (name, baseName, mutate) => {
  if (byName(name)) return byName(name);
  const base = byName(baseName);
  if (!base) throw new Error(`Missing base object: ${baseName}`);
  const object = JSON.parse(JSON.stringify(base));
  object.name = name;
  mutate(object);
  layout.objects.push(object);
  return object;
};
const addInstance = (name, mutate) => {
  const instance = {
    angle: 0,
    customSize: true,
    height: 60,
    layer: 'HUD',
    locked: true,
    name,
    persistentUuid: uuid(),
    width: 320,
    x: 0,
    y: 0,
    zOrder: 22,
    numberProperties: [],
    stringProperties: [],
    initialVariables: [],
  };
  mutate(instance);
  layout.instances.push(instance);
  return instance;
};

addObject('MissionPanel', 'HudPanel', (object) => {
  object.animations[0].directions[0].sprites[0].image = 'assets/game/ui_hud_panel.png';
});
addObject('MissionText', 'CargoText', (object) => {
  object.bold = true;
  object.characterSize = 21;
  object.string = 'ЗАДАНИЕ';
  object.content.text = 'ЗАДАНИЕ';
  object.content.characterSize = 21;
  object.textAlignment = 'left';
  object.content.textAlignment = 'left';
});
addObject('TechText', 'SectorText', (object) => {
  object.bold = true;
  object.characterSize = 20;
  object.string = 'ТЕХНОДЕТАЛИ  0';
  object.content.text = 'ТЕХНОДЕТАЛИ  0';
  object.content.characterSize = 20;
});
addObject('RewardButtonBg', 'ResultButtonBg', () => {});
addObject('RewardButtonText', 'ResultText', (object) => {
  object.characterSize = 22;
  object.content.characterSize = 22;
  object.string = 'УДВОИТЬ НАГРАДУ';
  object.content.text = 'УДВОИТЬ НАГРАДУ';
});
addObject('SystemButtonBg', 'UpgradeButtonBg', () => {});
addObject('SystemButtonText', 'UpgradeButtonText', (object) => {
  object.characterSize = 19;
  object.content.characterSize = 19;
  object.string = 'МОДУЛЬ';
  object.content.text = 'МОДУЛЬ';
});
addObject('ResetButtonBg', 'UpgradeBackButtonBg', () => {});
addObject('ResetButtonText', 'UpgradeBackText', (object) => {
  object.characterSize = 18;
  object.content.characterSize = 18;
  object.string = 'СБРОСИТЬ МОДУЛИ';
  object.content.text = 'СБРОСИТЬ МОДУЛИ';
});
addObject('RerollButtonBg', 'UpgradeBackButtonBg', () => {});
addObject('RerollButtonText', 'UpgradeBackText', (object) => {
  object.characterSize = 17;
  object.content.characterSize = 17;
  object.string = 'ОБНОВИТЬ ПУЛ';
  object.content.text = 'ОБНОВИТЬ ПУЛ';
});
addObject('UpgradeNotice', 'StatusText', (object) => {
  object.bold = true;
  object.characterSize = 18;
  object.content.bold = true;
  object.content.characterSize = 18;
  object.string = '';
  object.content.text = '';
  object.textAlignment = 'center';
  object.content.textAlignment = 'center';
});

const instanceCount = (name) => layout.instances.filter((item) => item.name === name).length;
if (!instanceCount('MissionPanel')) addInstance('MissionPanel', (i) => Object.assign(i, { x: 650, y: 40, width: 620, height: 132, zOrder: 20 }));
if (!instanceCount('MissionText')) addInstance('MissionText', (i) => Object.assign(i, { x: 682, y: 72, width: 556, height: 78, zOrder: 22 }));
if (!instanceCount('TechText')) addInstance('TechText', (i) => Object.assign(i, { x: 1410, y: 172, width: 440, height: 46, zOrder: 22 }));
if (!instanceCount('RewardButtonBg')) addInstance('RewardButtonBg', (i) => Object.assign(i, { x: 760, y: 405, width: 400, height: 62, zOrder: 20 }));
if (!instanceCount('RewardButtonText')) addInstance('RewardButtonText', (i) => Object.assign(i, { x: 760, y: 413, width: 400, height: 46, zOrder: 23 }));
for (const x of [210, 800, 1390]) {
  if (layout.instances.filter((item) => item.name === 'SystemButtonBg' && item.x === x).length === 0) addInstance('SystemButtonBg', (i) => Object.assign(i, { x, y: 720, width: 320, height: 64, zOrder: 20 }));
  if (layout.instances.filter((item) => item.name === 'SystemButtonText' && item.x === x).length === 0) addInstance('SystemButtonText', (i) => Object.assign(i, { x, y: 729, width: 320, height: 46, zOrder: 23 }));
}
if (!instanceCount('ResetButtonBg')) addInstance('ResetButtonBg', (i) => Object.assign(i, { x: 210, y: 815, width: 320, height: 60, zOrder: 20 }));
if (!instanceCount('ResetButtonText')) addInstance('ResetButtonText', (i) => Object.assign(i, { x: 210, y: 822, width: 320, height: 44, zOrder: 23 }));
if (!instanceCount('RerollButtonBg')) addInstance('RerollButtonBg', (i) => Object.assign(i, { x: 1590, y: 95, width: 230, height: 60, zOrder: 20 }));
if (!instanceCount('RerollButtonText')) addInstance('RerollButtonText', (i) => Object.assign(i, { x: 1590, y: 103, width: 230, height: 44, zOrder: 23 }));
if (!instanceCount('UpgradeNotice')) addInstance('UpgradeNotice', (i) => Object.assign(i, { x: 560, y: 190, width: 800, height: 34, zOrder: 24 }));

fs.writeFileSync(projectPath, JSON.stringify(project, null, 2) + '\n', 'utf8');
console.log(`Feature UI objects and variables added to ${projectPath}`);
