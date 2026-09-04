const fs = require('fs');
const input = JSON.parse(fs.readFileSync('docs/camera-trace-pass05-combined.json', 'utf8'));
const rows = input.rows;
const windows = [
  ['W 3 sec', 0, 3.12], ['S 3 sec', 3.12, 6.24], ['W→S', 6.24, 8.16], ['S→W', 8.16, 10.08],
  ['D 3 sec', 10.08, 13.20], ['A 3 sec', 13.20, 16.32], ['D→A', 16.32, 18.24], ['A→D', 18.24, 21.00]
];
const stat = (name, start, end) => {
  const part = rows.filter(row => row.time >= start && row.time < end);
  const maxX = Math.max(...part.map(row => Math.abs(row.deltaCameraX)));
  const maxY = Math.max(...part.map(row => Math.abs(row.deltaCameraY)));
  return { name, rows: part.length, cameraXRange: [Math.min(...part.map(row => row.cameraX)), Math.max(...part.map(row => row.cameraX))], cameraYRange: [Math.min(...part.map(row => row.cameraY)), Math.max(...part.map(row => row.cameraY))], maxAbsDeltaX: maxX, maxAbsDeltaY: maxY };
};
const output = { ...input.summary, directionStats: windows.map(([name, start, end]) => stat(name, start, end)) };
fs.writeFileSync('docs/camera-trace-pass05-analysis.json', JSON.stringify(output, null, 2), 'utf8');
console.log(JSON.stringify(output, null, 2));
