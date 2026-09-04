/* Remove localhost-only QA injection/telemetry hooks after CorePass05 evidence is captured. */
const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '..', 'game.json');
const game = JSON.parse(fs.readFileSync(file, 'utf8'));
const layout = game.layouts.find((item) => item.name === 'OrbitalSalvage');
if (!layout) throw new Error('OrbitalSalvage layout not found');

const trace = "if(typeof window!=='undefined'&&window.location.search.includes('qaTrace')){window.__osTrace=window.__osTrace||[];window.__osTrace.push({t:performance.now(),shipX:s.x,shipY:s.y,cameraX:cam.x,cameraY:cam.y,speed:Math.hypot(s.vx,s.vy)});if(window.__osTrace.length>900)window.__osTrace.shift();}";
let changed = 0;
function visit(value) {
  if (!value || typeof value !== 'object') return;
  if (value.type === 'BuiltinCommonInstructions::JsCode' && Array.isArray(value.inlineCode)) {
    let code = value.inlineCode.join('\n');
    const before = code;
    code = code.replace(/if\(typeof window!=='undefined'&&window\.location\.hostname==='127\.0\.0\.1'\)\{const q=new URLSearchParams\(window\.location\.search\);[^}]*\}/g, '');
    code = code.replace(/if\(typeof window!=='undefined'&&window\.location\.hostname==='127\.0\.0\.1'&&window\.location\.search\.includes\('qaCredits'\)\)v\.get\('Credits'\)\.setNumber\(Number\(new URLSearchParams\(window\.location\.search\)\.get\('qaCredits'\)\)\|\|0\);/g, '');
    code = code.replace(/if\(q\.has\('qaEngine'\)\)v\.get\('EngineLevel'\)\.setNumber\(Number\(q\.get\('qaEngine'\)\)\|\|0\);\}\}/g, '');
    while (code.includes(trace)) code = code.replace(trace, '');
    code = code.replace(/(?:gdjs\.evtTools\.camera\.setCameraZoom\(runtimeScene,2,'World',0\);){2,}/g, "gdjs.evtTools.camera.setCameraZoom(runtimeScene,2,'World',0);");
    if (code !== before) {
      value.inlineCode = code.split('\n');
      changed++;
    }
  }
  for (const child of Object.values(value)) visit(child);
}
visit(layout);
fs.writeFileSync(file, `${JSON.stringify(game, null, 2)}\n`, 'utf8');
console.log(`Removed CorePass05 QA hooks from ${changed} JavaScript action(s).`);
