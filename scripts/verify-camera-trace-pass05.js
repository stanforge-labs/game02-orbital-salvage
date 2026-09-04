const fs = require('fs');
const lines = fs.readFileSync('docs/camera-trace-pass05.csv', 'utf8').trim().split(/\r?\n/);
const header = lines.shift().split(',');
const rows = lines.map(line => Object.fromEntries(line.split(',').map((value, index) => [header[index], Number(value)])));
const range = key => [Math.min(...rows.map(row => row[key])), Math.max(...rows.map(row => row[key]))];
const maxDelta = key => Math.max(...rows.map(row => Math.abs(row[key])));
const result = { columns: header, rows: rows.length, shipXRange: range('shipX'), shipYRange: range('shipY'), cameraXRange: range('cameraX'), cameraYRange: range('cameraY'), maxAbsDeltaX: maxDelta('deltaCameraX'), maxAbsDeltaY: maxDelta('deltaCameraY') };
console.log(JSON.stringify(result, null, 2));
if (rows.length < 100 || result.cameraXRange[0] === result.cameraXRange[1] || result.cameraYRange[0] === result.cameraYRange[1] || result.maxAbsDeltaX > 10 || result.maxAbsDeltaY > 10) process.exitCode = 1;
