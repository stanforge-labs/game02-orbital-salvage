const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const game = JSON.parse(fs.readFileSync(path.join(root, 'game.json'), 'utf8'));
const layout = game.layouts.find((item) => item.name === 'OrbitalSalvage');
const resourceNames = new Set((game.resources?.resources || []).map((item) => item.name));
const referencedImages = new Set();
const referencedFonts = new Set();
const objectNames = new Set((layout.objects || []).map((item) => item.name));
const unknownInstances = (layout.instances || []).filter((item) => !objectNames.has(item.name)).map((item) => item.name);
function visit(value) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.image === 'string' && value.image) referencedImages.add(value.image);
  if (typeof value.font === 'string' && value.font) referencedFonts.add(value.font);
  for (const child of Object.values(value)) visit(child);
}
visit(layout);
const referencedResources = [...referencedImages, ...referencedFonts];
const missingResources = referencedResources.filter((name) => {
  const clean = name.replace(/^assets[\\/]+/, '');
  return resourceNames.has(name) ? !fs.existsSync(path.join(root, name.replaceAll('/', path.sep))) : !fs.existsSync(path.join(root, 'assets', 'game', clean));
});
const jsCodes = [];
function collectJs(value) {
  if (!value || typeof value !== 'object') return;
  if (value.type === 'BuiltinCommonInstructions::JsCode' && Array.isArray(value.inlineCode)) jsCodes.push(value.inlineCode.join('\n'));
  for (const child of Object.values(value)) collectJs(child);
}
collectJs(layout);
const sourceText = fs.readFileSync(path.join(root, 'game.json'), 'utf8');
const result = {
  jsonValid: true,
  layoutColor: { r: layout.r, v: layout.v, b: layout.b },
  colorValid: [layout.r, layout.v, layout.b].every((value) => Number.isInteger(value) && value >= 0 && value <= 255),
  unknownInstances,
  missingResources,
  jsActions: jsCodes.length,
  qaHooksRemaining: /qaCredits|qaState|qaCargoMax|qaHullMax|qaEngine|qaTrace/.test(sourceText),
  customCanvasMarker: sourceText.includes('__orbitalVisual'),
  customCanvasCalls: sourceText.includes('getContext('),
  exportIndex: fs.existsSync(path.join(root, 'exports', 'core-pass05-final4', 'index.html')),
};
console.log(JSON.stringify(result, null, 2));
if (!result.colorValid || result.unknownInstances.length || result.missingResources.length || result.qaHooksRemaining || result.customCanvasMarker || result.customCanvasCalls || !result.exportIndex) process.exitCode = 1;
