// Mechanical title normalization only; retain original JSON formatting.
const fs=require('fs');const path='game.json';let s=fs.readFileSync(path,'utf8');
s=s.replaceAll('КОСМИЧЕСКИЙ СБОРЩИК','Космический сборщик')
 .replaceAll('КОСМИЧЕСКИЙ\\nСБОРЩИК','Космический сборщик')
 .replaceAll('КОСМИЧЕСКИЙ\\\\nСБОРЩИК','Космический сборщик')
 .replaceAll('ORBITAL SALVAGE · СЛУЖБА СБОРА','СЛУЖБА ОРБИТАЛЬНОГО СБОРА');
JSON.parse(s);fs.writeFileSync(path,s);
