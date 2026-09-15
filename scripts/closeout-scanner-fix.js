// Restore the purchased scanner's early-warning effect in the active HUD handler.
const fs=require('fs');
const from="Math.hypot(s.x-lane.x,s.y-lane.y)<640&&g.secret.stage<4";
const to="Math.hypot(s.x-lane.x,s.y-lane.y)<(v.get('ScannerLevel').getAsNumber()>0?800:640)&&g.secret.stage<4";
for(const file of ['game.json','scripts/release16-ui.js']){
 let s=fs.readFileSync(file,'utf8');
 if(!s.includes(from))throw Error('Scanner handler not found: '+file);
 s=s.replaceAll(from,to).replaceAll('Раньше видит метеоры и сигналы','Раньше предупреждает о метеорном потоке');
 fs.writeFileSync(file,s);
}
