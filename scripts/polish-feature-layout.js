const fs = require('fs');
const file = process.argv[2] || 'game.json';
const project = JSON.parse(fs.readFileSync(file, 'utf8'));
const layout = project.layouts.find((item) => item.name === 'OrbitalSalvage') || project.layouts[0];
const instances = (name) => layout.instances.filter((item) => item.name === name);
instances('MissionText').forEach((item) => Object.assign(item, { x: 692, y: 86, width: 536, height: 58 }));
instances('MissionPanel').forEach((item) => Object.assign(item, { x: 650, y: 40, width: 620, height: 132 }));
instances('TechText').forEach((item) => Object.assign(item, { x: 1410, y: 103, width: 170, height: 44 }));
instances('RerollButtonBg').forEach((item) => Object.assign(item, { x: 1590, y: 95, width: 230, height: 60 }));
instances('RerollButtonText').forEach((item) => Object.assign(item, { x: 1590, y: 103, width: 230, height: 44 }));
const resultButtons = instances('ResultButtonBg');
if (resultButtons[0]) Object.assign(resultButtons[0], { x: 450, y: 500, width: 490, height: 78 });
if (resultButtons[1]) Object.assign(resultButtons[1], { x: 980, y: 500, width: 490, height: 78 });
const resultTexts = instances('ResultText');
if (resultTexts[0]) Object.assign(resultTexts[0], { x: 450, y: 550, width: 490, height: 46 });
if (resultTexts[1]) Object.assign(resultTexts[1], { x: 980, y: 550, width: 490, height: 46 });
const rewardTexts = instances('RewardButtonText');
if (rewardTexts[0]) Object.assign(rewardTexts[0], { x: 760, y: 444, width: 400, height: 46 });
instances('SystemButtonText').forEach((item) => Object.assign(item, { y: 746, height: 38 }));
instances('ResetButtonText').forEach((item) => Object.assign(item, { y: 838, height: 34 }));
instances('RerollButtonText').forEach((item) => Object.assign(item, { y: 115, height: 34 }));
instances('UpgradeNotice').forEach((item) => Object.assign(item, { x: 560, y: 188, width: 800, height: 34 }));
const missionText = layout.objects.find((item) => item.name === 'MissionText');
if (missionText) {
  missionText.characterSize = 18;
  missionText.content.characterSize = 18;
  missionText.content.lineHeight = 4;
}
const techText = layout.objects.find((item) => item.name === 'TechText');
if (techText) {
  techText.characterSize = 18;
  techText.content.characterSize = 18;
}
fs.writeFileSync(file, JSON.stringify(project, null, 2) + '\n', 'utf8');
console.log('Feature layout spacing polished');
