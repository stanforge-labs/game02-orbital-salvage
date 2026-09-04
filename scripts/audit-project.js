const fs = require('fs');
const path = require('path');

const projectPath = path.resolve(process.argv[2] || 'game.json');
const projectRoot = path.dirname(projectPath);
const project = JSON.parse(fs.readFileSync(projectPath, 'utf8'));
const layout = project.layouts.find(item => item.name === 'OrbitalSalvage') || project.layouts[0];
const objectNames = new Set(layout.objects.map(item => item.name));
const unknownInstances = layout.instances.filter(item => !objectNames.has(item.name)).map(item => item.name);
const resourceEntries = (project.resources && project.resources.resources) || [];
const resourcePaths = [...new Set(resourceEntries.map(item => item.file).filter(file => typeof file === 'string' && file.startsWith('assets/')))];
const referencedPaths = new Set(resourcePaths);
function scan(value) {
  if (typeof value === 'string' && value.startsWith('assets/')) referencedPaths.add(value.replace(/\\/g, '/'));
  else if (Array.isArray(value)) value.forEach(scan);
  else if (value && typeof value === 'object') Object.values(value).forEach(scan);
}
scan(project);
const missingResources = [...referencedPaths].filter(file => !fs.existsSync(path.join(projectRoot, file)));
const channelKeys = new Set(['r', 'g', 'b', 'v', 'ambientLightColorR', 'ambientLightColorG', 'ambientLightColorB']);
const invalidColors = [];
function auditColors(value, trail = '$') {
  if (Array.isArray(value)) return value.forEach((item, index) => auditColors(item, `${trail}[${index}]`));
  if (!value || typeof value !== 'object') return;
  for (const [key, item] of Object.entries(value)) {
    const child = `${trail}.${key}`;
    if (typeof item === 'number' && channelKeys.has(key) && (item < 0 || item > 255)) invalidColors.push({ path: child, value: item });
    if (typeof item === 'string' && /(?:color|tint)$/i.test(key) && /^\s*\d+;\d+;\d+\s*$/.test(item)) {
      const channels = item.split(';').map(Number);
      if (channels.some(channel => channel < 0 || channel > 255)) invalidColors.push({ path: child, value: item });
    }
    auditColors(item, child);
  }
}
auditColors(project);
const result = {
  jsonValid: true,
  projectPath,
  layout: layout.name,
  sceneColor: { r: layout.r, v: layout.v, b: layout.b },
  objectCount: layout.objects.length,
  instanceCount: layout.instances.length,
  unknownInstances,
  missingResources,
  invalidColors,
  resourceCount: resourceEntries.length
};
console.log(JSON.stringify(result, null, 2));
if (unknownInstances.length || missingResources.length || invalidColors.length) process.exitCode = 2;
