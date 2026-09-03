/* Restores UTF-8 text after gdexporter corrupts non-ASCII literals on this Windows setup. */
const fs = require('fs');
const [dataPath, sourcePath] = process.argv.slice(2);
const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const raw = fs.readFileSync(dataPath, 'utf8');
const prefix = 'gdjs.projectData = ';
const suffix = ';\ngdjs.runtimeGameOptions = {}';
const start = raw.indexOf(prefix) + prefix.length;
const end = raw.lastIndexOf(suffix);
if (start < prefix.length || end < start) throw new Error('Unexpected gdexporter data.js format');
const exported = JSON.parse(raw.slice(start, end));
const hasCyrillic = value => typeof value === 'string' && /[А-Яа-яЁё]/.test(value);
const restore = (from, to) => {
  if (hasCyrillic(from)) return from;
  if (Array.isArray(from) && Array.isArray(to)) {
    for (let i = 0; i < Math.min(from.length, to.length); i++) to[i] = restore(from[i], to[i]);
  } else if (from && to && typeof from === 'object' && typeof to === 'object') {
    for (const key of Object.keys(from)) if (Object.hasOwn(to, key)) to[key] = restore(from[key], to[key]);
  }
  return to;
};
restore(source, exported);
fs.writeFileSync(dataPath, `${prefix}${JSON.stringify(exported)}${suffix};\n`, 'utf8');
console.log('UTF-8 runtime text restored');
