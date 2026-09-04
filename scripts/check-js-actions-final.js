const fs = require('fs');
const game = JSON.parse(fs.readFileSync('game.json', 'utf8'));
const layout = game.layouts.find(item => item.name === 'OrbitalSalvage');
const actions = [];
function visit(value) {
  if (!value || typeof value !== 'object') return;
  if (value.type === 'BuiltinCommonInstructions::JsCode' && Array.isArray(value.inlineCode)) actions.push(value.inlineCode.join('\n'));
  for (const child of Object.values(value)) visit(child);
}
visit(layout);
const errors = [];
actions.forEach((code, index) => { try { new Function('gdjs', 'runtimeScene', code); } catch (error) { errors.push({ action: index + 1, message: error.message }); } });
console.log(JSON.stringify({ actions: actions.length, syntaxErrors: errors }, null, 2));
if (errors.length) process.exitCode = 1;
