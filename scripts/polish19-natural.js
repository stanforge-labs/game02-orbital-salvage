// Same natural navigation as Release17: read-only coordinates + real inputs.
// Adds fresh pause/arcade checks and a continuous performance trace, not cheats.
const fs=require('fs'),Module=require('module'),path=require('path');process.env.OS_QA_PORT='4236';
const file=path.join(__dirname,'release17-natural.js');let source=fs.readFileSync(file,'utf8').replaceAll('release17-natural-','polish19-natural-');
source=source.replace("fs.mkdirSync(out,{recursive:true});",`fs.mkdirSync(out,{recursive:true});
const profiles=[];await p.evaluate(require('./polish19-profile'));
const cdp=await q.context.newCDPSession(p);await cdp.send('Performance.enable');const metrics=await cdp.send('Performance.getMetrics');const traceOffsetUs=metrics.metrics.find(m=>m.name==='Timestamp').value*1000000-(await p.evaluate(()=>performance.now()))*1000;await cdp.send('Tracing.start',{categories:'devtools.timeline,v8,disabled-by-default-v8.gc',transferMode:'ReturnAsStream'});
await p.screenshot({path:'screenshots/Polish19/01-menu.png'});
await p.getByRole('button',{name:'ОРБИТАЛЬНЫЙ ПАТРУЛЬ',exact:true}).click();await p.keyboard.down('a');await p.waitForTimeout(1500);await p.keyboard.up('a');await p.waitForTimeout(1500);await p.screenshot({path:'screenshots/Polish19/17-arcade.png'});
await p.getByRole('button',{name:'ВЫЙТИ ИЗ ПАТРУЛЯ',exact:true}).click();
`);
source=source.replace("await log('start');",`await log('start');await p.screenshot({path:'screenshots/Polish19/02-sector1-start.png'});
await p.keyboard.press('Escape');const paused=(await read(p)).runTime;await p.waitForTimeout(700);if((await read(p)).runTime!==paused)throw Error('Pause time advanced');await p.screenshot({path:'screenshots/Polish19/16-pause.png'});await p.getByRole('button',{name:'ПРОДОЛЖИТЬ',exact:true}).click();`);
source=source.replace("console.log(name,",`const shots={'purchase':'18-upgrades','unlock':'19-sector-select','sector2':'20-sector2-start','signal':'23-secret-signal','gate':'24-secret-gate','secret-end':'27-secret-cache','sector2-return':'28-result','reload-continue':'29-reload-continue'};if(shots[name])await p.screenshot({path:'screenshots/Polish19/'+shots[name]+'.png'});console.log(name,`);
source=source.replace('await p.reload();',`profiles.push(await p.evaluate(()=>window.__perf19));await p.reload();`);
source=source.replace('}finally{fs.writeFileSync',`}finally{
if(!profiles.length)profiles.push(await p.evaluate(()=>window.__perf19));
fs.writeFileSync('docs/polish19-traversal-performance.json',JSON.stringify(profiles));
const traceDone=new Promise(resolve=>cdp.once('Tracing.tracingComplete',resolve));await cdp.send('Tracing.end');const {stream}=await traceDone;let trace='';for(;;){const part=await cdp.send('IO.read',{handle:stream,size:4194304});trace+=part.data;if(part.eof)break;}await cdp.send('IO.close',{handle:stream});
const entries=JSON.parse(trace).traceEvents;const notable=entries.filter(e=>e.dur>=1000&&/GC|Decode|Paint|Raster|Compile|Layout|UpdateLayer|Audio/.test(e.name));fs.writeFileSync('docs/polish19-trace-events.json',JSON.stringify({traceOffsetUs,categories:'devtools.timeline,v8,disabled-by-default-v8.gc',events:notable}));await cdp.detach();
fs.writeFileSync`);
const mod=new Module(file,module);mod.filename=file;mod.paths=Module._nodeModulePaths(__dirname);mod._compile(source,file);
