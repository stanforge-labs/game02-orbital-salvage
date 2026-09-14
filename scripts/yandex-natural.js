// Existing keyboard navigator, fresh context, no gameplay writes.
const fs=require('fs'),Module=require('module'),path=require('path');
const file=path.join(__dirname,'release17-natural.js');
let source=fs.readFileSync(file,'utf8').replace("require('./release17-qa-lib')","require('./yandex-qa-lib')").replaceAll('release17-natural-','yandex-natural-');
source=source.replace("await log('start');","await log('start');await p.screenshot({path:'screenshots/FinalYandexRelease/02-sector1.png'});");
source=source.replace('console.log(name,',`const shots={'loot':'03-loot','purchase':'08-upgrades','unlock':'09-sector-select','sector2':'10-sector2','signal':'11-secret-signal','key':'12-key','gate':'13-gate','secret-end':'16-cache','sector2-return':'07-result'};if(shots[name])await p.screenshot({path:'screenshots/FinalYandexRelease/'+shots[name]+'.png'});console.log(name,`);
fs.mkdirSync('screenshots/FinalYandexRelease',{recursive:true});
if(process.argv[2]==='2'){
 source=source.replace("fs.mkdirSync(out,{recursive:true});","fs.mkdirSync(out,{recursive:true});await p.evaluate(require('./polish19-profile'));");
 source=source.replace('await p.reload();',"fs.writeFileSync('docs/yandex-performance.json',JSON.stringify(await p.evaluate(()=>window.__perf19)));await p.reload();");
 source=source.replace('await steer(p,...pt,16);',"await steer(p,...pt,16);if(i===1||i===3||i===5)await p.screenshot({path:'screenshots/FinalYandexRelease/'+(i===1?'14-secret-room':i===3?'15-lasers':'16-cache')+'.png'});");
}
const mod=new Module(file,module);mod.filename=file;mod.paths=Module._nodeModulePaths(__dirname);mod._compile(source,file);
