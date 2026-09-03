/* One-off, deterministic CorePass05 migration: native 1920x1080 UI geometry. */
const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, '..', 'game.json');
const game = JSON.parse(fs.readFileSync(file, 'utf8'));

game.properties.windowWidth = 1920;
game.properties.windowHeight = 1080;

for (const name of ['ui_menu_panel.png', 'ui_result_panel.png', 'ui_card.png', 'ui_hud_panel.png']) {
  const resource = `assets/game/${name}`;
  if (!game.resources.resources.some(item => item.name === resource)) {
    game.resources.resources.push({ file: resource, kind: 'image', metadata: '', name: resource, smoothed: true, userAdded: true });
  }
}
if (!game.resources.resources.some(item => item.name === 'assets/game/RussoOne-Regular.ttf')) {
  game.resources.resources.push({ file: 'assets/game/RussoOne-Regular.ttf', kind: 'font', metadata: '', name: 'assets/game/RussoOne-Regular.ttf', userAdded: true });
}

const layout = game.layouts.find(item => item.name === 'OrbitalSalvage');
const byId = new Map(layout.instances.map(item => [item.persistentUuid, item]));
const setInstance = (id, values) => Object.assign(byId.get(id), values);
const I = {
  menu: '10000000-0000-4000-8000-000000000040', playBg: '10000000-0000-4000-8000-000000000041',
  hudL: '10000000-0000-4000-8000-0000000000a0', hudR: '10000000-0000-4000-8000-0000000000a1',
  result: '10000000-0000-4000-8000-000000000042', resultL: '10000000-0000-4000-8000-000000000043', resultR: '10000000-0000-4000-8000-000000000044',
  title: '10000000-0000-4000-8000-000000000060', desc: '10000000-0000-4000-8000-000000000061', playText: '10000000-0000-4000-8000-000000000063', hint: '10000000-0000-4000-8000-000000000064',
  cargo: '10000000-0000-4000-8000-000000000070', credits: '10000000-0000-4000-8000-000000000071', hull: '10000000-0000-4000-8000-000000000072', sector: '10000000-0000-4000-8000-000000000073', objective: '10000000-0000-4000-8000-000000000074', nav: '10000000-0000-4000-8000-000000000076',
  resultTitle: '10000000-0000-4000-8000-000000000080', resultStats: '10000000-0000-4000-8000-000000000081', resultTextL: '10000000-0000-4000-8000-000000000082', resultTextR: '10000000-0000-4000-8000-000000000083',
  upgPanel: '10000000-0000-4000-8000-000000000090', upgTitle: '10000000-0000-4000-8000-000000000091',
  card1: '10000000-0000-4000-8000-00000000009c', card2: '10000000-0000-4000-8000-00000000009d', card3: '10000000-0000-4000-8000-00000000009e',
  btn1: '10000000-0000-4000-8000-000000000093', btn2: '10000000-0000-4000-8000-000000000095', btn3: '10000000-0000-4000-8000-000000000096',
  btnText1: '10000000-0000-4000-8000-000000000094', btnText2: '10000000-0000-4000-8000-000000000097', btnText3: '10000000-0000-4000-8000-000000000098',
  cardText1: '10000000-0000-4000-8000-000000000099', cardText2: '10000000-0000-4000-8000-00000000009a', cardText3: '10000000-0000-4000-8000-00000000009b',
  backBg: '10000000-0000-4000-8000-0000000000a2', backText: '10000000-0000-4000-8000-0000000000a3'
};

setInstance(I.menu, { x: 500, y: 140, width: 920, height: 760 });
setInstance(I.playBg, { x: 760, y: 660, width: 400, height: 104 });
setInstance(I.title, { x: 560, y: 310, width: 800, height: 140 });
setInstance(I.desc, { x: 600, y: 500, width: 720, height: 150 });
setInstance(I.playText, { x: 760, y: 708, width: 400, height: 68 });
setInstance(I.hint, { x: 640, y: 800, width: 640, height: 44 });
setInstance(I.hudL, { x: 40, y: 40, width: 430, height: 176 });
setInstance(I.hudR, { x: 1410, y: 40, width: 470, height: 176 });
setInstance(I.cargo, { x: 82, y: 73, width: 340, height: 42, customSize: true });
setInstance(I.hull, { x: 82, y: 141, width: 340, height: 42, customSize: true });
setInstance(I.credits, { x: 1450, y: 70, width: 380, height: 42, customSize: true });
setInstance(I.sector, { x: 1450, y: 124, width: 380, height: 70, customSize: true });
setInstance(I.objective, { x: 460, y: 968, width: 1000, height: 56, customSize: true });
setInstance(I.nav, { x: 700, y: 176, width: 520, height: 54, customSize: true });
setInstance(I.result, { x: 400, y: 170, width: 1120, height: 430 });
setInstance(I.resultTitle, { x: 500, y: 215, width: 920, height: 76 });
setInstance(I.resultStats, { x: 590, y: 320, width: 740, height: 220 });
setInstance(I.resultL, { x: 450, y: 680, width: 490, height: 104 });
setInstance(I.resultR, { x: 980, y: 680, width: 490, height: 104 });
setInstance(I.resultTextL, { x: 450, y: 725, width: 490, height: 48 });
setInstance(I.resultTextR, { x: 980, y: 725, width: 490, height: 48 });
setInstance(I.upgPanel, { x: 100, y: 55, width: 1720, height: 900 });
setInstance(I.upgTitle, { x: 200, y: 150, width: 1520, height: 76 });
for (const [card, x] of [[I.card1, 190], [I.card2, 780], [I.card3, 1370]]) setInstance(card, { x, y: 220, width: 360, height: 500 });
for (const [button, x] of [[I.btn1, 210], [I.btn2, 800], [I.btn3, 1390]]) setInstance(button, { x, y: 625, width: 320, height: 72 });
for (const [text, x] of [[I.btnText1, 210], [I.btnText2, 800], [I.btnText3, 1390]]) setInstance(text, { x, y: 680, width: 320, height: 46 });
for (const [text, x] of [[I.cardText1, 210], [I.cardText2, 800], [I.cardText3, 1390]]) setInstance(text, { x, y: 360, width: 320, height: 260 });
setInstance(I.backBg, { x: 760, y: 795, width: 400, height: 80 });
setInstance(I.backText, { x: 760, y: 812, width: 400, height: 46 });

const imageFor = { MenuPanel: 'assets/game/ui_menu_panel.png', ResultPanel: 'assets/game/ui_result_panel.png', UpgradePanel: 'assets/game/ui_menu_panel.png', UpgradeCardBg: 'assets/game/ui_card.png', HudPanel: 'assets/game/ui_hud_panel.png' };
for (const object of layout.objects) {
  if (imageFor[object.name]) object.animations[0].directions[0].sprites[0].image = imageFor[object.name];
  const sizes = { Title: 60, MenuDescription: 28, PlayText: 34, MenuHint: 22, CargoText: 26, HullText: 26, CreditsText: 26, SectorText: 24, ObjectiveText: 28, NavMarker: 26, ResultTitle: 40, ResultStats: 28, ResultText: 30, UpgradeTitle: 42, UpgradeCardText: 26, UpgradeButtonText: 28, UpgradeBackText: 28 };
  if (sizes[object.name]) { object.characterSize = sizes[object.name]; object.content.characterSize = sizes[object.name]; }
  if (object.type === 'TextObject::Text') { object.font = 'assets/game/RussoOne-Regular.ttf'; object.content.font = 'assets/game/RussoOne-Regular.ttf'; }
}

const actions = [];
const findActions = value => { if (!value || typeof value !== 'object') return; if (value.type === 'BuiltinCommonInstructions::JsCode' && Array.isArray(value.inlineCode)) actions.push(value); for (const child of Object.values(value)) if (child && typeof child === 'object') findActions(child); };
findActions(layout);
for (const action of actions) {
  let code = action.inlineCode.join('\n');
  if (code.includes("v.get('Credits').setNumber(0);}")) code = code.replace("v.get('Credits').setNumber(0);}", "v.get('Credits').setNumber(0);if(typeof window!=='undefined'&&window.location.hostname==='127.0.0.1'&&window.location.search.includes('qaCredits'))v.get('Credits').setNumber(Number(new URLSearchParams(window.location.search).get('qaCredits'))||0);}");
  code = code.replace("runtimeScene.__osCam={x:480,y:677};v.get('GameState')", "runtimeScene.__osCam={x:480,y:677};gdjs.evtTools.camera.setCameraZoom(runtimeScene,2,'World',0);v.get('GameState')");
  code = code.replace("runtimeScene.__osCam={x:480,y:677};runtimeScene.getObjects", "runtimeScene.__osCam={x:480,y:677};gdjs.evtTools.camera.setCameraZoom(runtimeScene,2,'World',0);runtimeScene.getObjects");
  code = code.replace("getCursorY(runtimeScene,'HUD',0)>=350&&gdjs.evtTools.input.getCursorY(runtimeScene,'HUD',0)<=440", "getCursorY(runtimeScene,'HUD',0)>=680&&gdjs.evtTools.input.getCursorY(runtimeScene,'HUD',0)<=784");
  code = code.replace("getCursorY(runtimeScene,'HUD',0)>=720&&gdjs.evtTools.input.getCursorY(runtimeScene,'HUD',0)<=850", "getCursorY(runtimeScene,'HUD',0)>=680&&gdjs.evtTools.input.getCursorY(runtimeScene,'HUD',0)<=784");
  code = code.replace("rx<480", "rx<960");
  code = code.replace("ux>=360&&ux<=600&&uy>=405&&uy<=465", "ux>=760&&ux<=1160&&uy>=795&&uy<=875");
  code = code.replace("uy>=280&&uy<=340", "uy>=625&&uy<=697");
  code = code.replace("ux>=125&&ux<=345", "ux>=210&&ux<=530").replace("ux>=370&&ux<=590", "ux>=800&&ux<=1120").replace("ux>=615&&ux<=835", "ux>=1390&&ux<=1710");
  code = code.replace("[135,380,625][i]&&mx<=[355,600,845][i]&&my>=286&&my<=338", "[210,800,1390][i]&&mx<=[530,1120,1710][i]&&my>=625&&my<=697");
  code = code.replace("gdjs.evtTools.camera.setCameraY(runtimeScene,cam.y,'World',0);", "gdjs.evtTools.camera.setCameraY(runtimeScene,cam.y,'World',0);gdjs.evtTools.camera.setCameraZoom(runtimeScene,2,'World',0);if(typeof window!=='undefined'&&window.location.search.includes('qaTrace')){window.__osTrace=window.__osTrace||[];window.__osTrace.push({t:performance.now(),shipX:s.x,shipY:s.y,cameraX:cam.x,cameraY:cam.y,speed:Math.hypot(s.vx,s.vy)});if(window.__osTrace.length>900)window.__osTrace.shift();}");
  code = code.replace("'ГРУЗ '+c+'/'+m", "'ГРУЗ     '+c+' / '+m").replace("'КРЕДИТЫ '+cr", "'КРЕДИТЫ     '+cr").replace("'КОРПУС '+h+'/'+hm", "'КОРПУС     '+h+' / '+hm").replace("'СЕКТОР 1\\nБЕЗОПАСНАЯ ОРБИТА'", "'СЕКТОР 1\\nБезопасная орбита'");
  code = code.replace("done[0]?'ТРЮМ\\n10 МЕСТ\\nПОЛУЧЕНО ✓':'ТРЮМ\\n'+cm+' → 10\\n100 КРЕДИТОВ',done[1]?'ДВИГАТЕЛЬ\\n+10% СКОРОСТИ\\nПОЛУЧЕНО ✓':'ДВИГАТЕЛЬ\\n+10% СКОРОСТИ\\n120 КРЕДИТОВ',done[2]?'КОРПУС\\n4 / 4\\nПОЛУЧЕНО ✓':'КОРПУС\\n'+hm+' → 4\\n150 КРЕДИТОВ'", "done[0]?'ТРЮМ\\n\\n10 МЕСТ\\n\\nПОЛУЧЕНО ✓':'ТРЮМ\\n\\n'+cm+' → 10\\n+2 МЕСТА В ТРЮМЕ\\n\\n100 КРЕДИТОВ',done[1]?'ДВИГАТЕЛЬ\\n\\n+10% СКОРОСТИ\\n\\nПОЛУЧЕНО ✓':'ДВИГАТЕЛЬ\\n\\n+10% СКОРОСТИ\\n+10% УСКОРЕНИЯ\\n\\n120 КРЕДИТОВ',done[2]?'КОРПУС\\n\\n4 / 4\\n\\nПОЛУЧЕНО ✓':'КОРПУС\\n\\n'+hm+' → 4\\n+1 ПРОЧНОСТЬ\\n\\n150 КРЕДИТОВ'");
  action.inlineCode = code.split('\n');
}

fs.writeFileSync(file, `${JSON.stringify(game, null, 2)}\n`, 'utf8');
console.log('CorePass05 HD UI migration complete');
