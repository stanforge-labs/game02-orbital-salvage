const fs=require('fs'),assert=require('assert/strict'),cp=require('child_process');
const read=n=>JSON.parse(fs.readFileSync('docs/polish19-'+n+'.json','utf8'));
const tests={};for(const n of ['hud','visual','safe-responsive','contracts','modules','save','ads','effects','seeds','menu-check']){
 const r=read(n);assert.ok(!r.failure,n);assert.deepEqual(r.errors,[],n);for(const v of r.views||[])assert.ok(!v.failure,n+' view');tests[n]=r;
}
const natural=read('natural-final');assert.deepEqual(natural.errors,[]);assert.ok(!natural.events.some(e=>e.failure));
const checkpoint=n=>natural.events.find(e=>e.name===n);
for(const n of ['start','purchase','unlock','sector2','signal','key','gate','secret-end','sector2-return','reload-continue'])assert.ok(checkpoint(n),n);
assert.equal(checkpoint('secret-end').state.secret.progress,6);assert.ok(checkpoint('secret-end').state.secret.cache);assert.equal(checkpoint('sector2-return').state.state,'result');assert.equal(checkpoint('sector2-return').state.credits,checkpoint('reload-continue').state.credits);
assert.equal(tests.contracts.contracts.length,23);assert.equal(tests.modules.purchases.length,15);
const profiles=read('traversal-performance'),p=profiles[0],trace=read('trace-events');
// rAF subtraction can turn exactly 33.3 into 33.30000000004. Normalize to
// microsecond precision before strict threshold counts; raw frames stay intact.
const times=p.frames.map(t=>Math.round(t*1000)/1000).sort((a,b)=>a-b),count=n=>times.filter(t=>t>n).length;
const seconds=p.frames.reduce((a,b)=>a+b,0)/1000;assert.ok(seconds>=300);assert.equal(new Set(p.samples.map(s=>s.instances)).size,1);
const spikes=p.spikes.map(s=>{
 const related=trace.events.filter(e=>{const t=(e.ts-trace.traceOffsetUs)/1000;return t<s.t+2&&t+e.dur/1000>s.t-s.dt;});
 const names=[...new Set(related.filter(e=>!/BACKGROUND|PARALLEL/.test(e.name)).map(e=>e.name))];
 return {...s,traceCorrelation:names,explanation:s.events.some(e=>e.name.includes('world generation'))?'world/UI transition':s.events.some(e=>e.name.includes('audio unlock')&&e.ms>20)?'audio unlock':names.some(n=>/GC/.test(n))?'GC coincides; correlation, not exclusive cause':names.some(n=>/Layout|Paint/.test(n))?'UI/layout work coincides':'isolated scheduling interval; no instrumented long handler'};
});
const performanceReport={seconds,frames:times.length,thresholds:{over20:count(20),over25:count(25),over33_3:count(33.3),over50:count(50),over100:count(100)},median:times[Math.floor(times.length*.5)],p95:times[Math.floor(times.length*.95)],p99:times[Math.floor(times.length*.99)],max:times.at(-1),instances:p.samples[0].instances,heapMin:Math.min(...p.samples.map(s=>s.heap)),heapMax:Math.max(...p.samples.map(s=>s.heap)),objectCreations:p.events.filter(e=>e.name==='object creation').length,svgDecodeEventsOver1ms:trace.events.filter(e=>/Decode/.test(e.name)).length,maxSaveMs:Math.max(0,...p.events.filter(e=>e.name==='save write').map(e=>e.ms)),maxGenerationMs:Math.max(0,...p.events.filter(e=>e.name==='world generation').map(e=>e.ms)),maxAudioUnlockMs:Math.max(0,...p.events.filter(e=>e.name==='audio unlock/context creation').map(e=>e.ms)),spikes,method:'Chromium rAF + handler timings + CDP trace. Read-only coordinate navigator and screenshots add measurement overhead. GC correlation is not proof of exclusive causation.'};
fs.writeFileSync('docs/polish19-performance-analysis.json',JSON.stringify(performanceReport,null,2));
const base=JSON.parse(cp.execFileSync('git',['show','b42bd30ff6effdbe5362a05224b3d1cc0c905cc7:game.json'],{maxBuffer:30000000})),game=JSON.parse(fs.readFileSync('game.json'));
const oldPlay=base.layouts[0].events[1].inlineCode.join('\n'),newPlay=game.layouts[0].events[1].inlineCode.join('\n').replace(/\n const safeW19=[\s\S]*?\n const smooth=/,'const smooth=');assert.equal(oldPlay,newPlay,'only composition insertion permitted in play event');
const visualReview=read('visual-review');const screenshots=fs.readdirSync('screenshots/Polish19').filter(n=>n.endsWith('.png'));assert.ok(screenshots.every(n=>visualReview.files.includes(n)),'unreviewed screenshot');
const summary={base:'b42bd30ff6effdbe5362a05224b3d1cc0c905cc7',changes:{safeZone:'existing exponential follow + velocity lead; no world-position clamp',familySpacing:620,families:12,silhouetteGroups:8,updatedSVGs:6,newInstances:0,unchangedGameplayApartFromCameraComposition:true},tests,performance:performanceReport,natural:{method:natural.mode,seconds:checkpoint('reload-continue').seconds,checkpoints:natural.events.filter(e=>['start','purchase','unlock','sector2','signal','key','gate','secret-end','sector2-return','reload-continue'].includes(e.name)).map(e=>({name:e.name,seconds:e.seconds,seed:e.state.seed,hull:e.state.hull,credits:e.state.credits}))},screenshots,limitations:['Browser/touch simulation, not physical Android.','Local rewarded stub, not Yandex production ads.','No promise of zero OS/browser scheduling jitter.'],verdict:'READY FOR USER FINAL MANUAL TEST'};
fs.writeFileSync('docs/polish19-summary.json',JSON.stringify(summary,null,2));console.log({seconds:summary.natural.seconds,performance:performanceReport.thresholds,screenshots:screenshots.length,verdict:summary.verdict});
