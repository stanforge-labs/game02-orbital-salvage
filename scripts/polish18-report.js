// Aggregate actual independent reports; do not infer success from process exit.
const fs=require('fs'),assert=require('assert/strict'),cp=require('child_process');
const read=n=>JSON.parse(fs.readFileSync('docs/polish18-'+n+'.json','utf8'));
const reports={};for(const n of ['seeds','hud','side-routes','contracts','modules','ads','save','effects','proof','responsive','world-visuals','secret-routes-6','natural-verified','performance']){
 const r=read(n);assert.ok(!r.failure,n);assert.deepEqual(r.errors,[],n+' runtime errors');for(const a of r.views||[])assert.ok(!a.failure,n+' viewport failure');reports[n]=r;
}
const n=reports['natural-verified'],event=name=>n.events.find(e=>e.name===name);
for(const name of ['unlock','sector2','signal','key','gate','secret-end','sector2-return','reload-continue'])assert.ok(event(name),'missing natural checkpoint '+name);
assert.ok(event('secret-end').state.secret.cache);assert.equal(event('secret-end').state.secret.progress,6);assert.equal(event('sector2-return').state.state,'result');
const perf=reports.performance;assert.ok(perf.seconds>=300);assert.equal(new Set(perf.samples.map(x=>x.instances)).size,1,'pool must not grow');
assert.equal(reports.contracts.contracts.length,23);assert.equal(reports.modules.purchases.length,15);
// The HUD fixture is Sector 1: its hidden key still has the editor placeholder
// dimensions. Do not misreport those as the active Sector 2 key size.
delete reports.hud.loot.G13Key;
const audit=JSON.parse(cp.execFileSync(process.execPath,['scripts/audit-project.js'],{encoding:'utf8'}));assert.equal(audit.missingResources.length+audit.unknownInstances.length+audit.invalidColors.length,0);
const g=JSON.parse(fs.readFileSync('game.json'));assert.ok(g.layouts[0].objects.filter(o=>o.type==='TextObject::Text').every(o=>o.font==='assets/game/Exo2-Variable.ttf'));
const baseline=JSON.parse(cp.execFileSync('git',['show','d4a04a3b7b86007f15c290910570208d8d3f5a8a:game.json'],{encoding:'utf8',maxBuffer:20000000}));
assert.equal(g.layouts[0].events[1].inlineCode.join('\n'),baseline.layouts[0].events[1].inlineCode.join('\n'),'core gameplay event must stay unchanged');
const seeds=reports.seeds.seeds;assert.equal(seeds.length,60);assert.equal(new Set(seeds.map(x=>x.seed)).size,60);
const summary={pass:'Polish18',baseline:'d4a04a3b7b86007f15c290910570208d8d3f5a8a',audit,world:{themes:12,variants:24,secretScenes:6,scenicMin:Math.min(...seeds.map(x=>x.scenic)),scenicMax:Math.max(...seeds.map(x=>x.scenic)),oldMaxEmptyDistance:Math.max(...seeds.map(x=>x.oldMax)),newMaxEmptyDistance:Math.max(...seeds.map(x=>x.newMax)),seeds:seeds.map(x=>x.seed)},loot:reports.hud.loot,pacing:{firstLoot:event('loot').seconds,firstReturn:event('return').seconds,firstUpgrade:event('purchase').seconds,sector2Unlock:event('unlock').seconds,sector2Enter:event('sector2').seconds,secretCache:event('secret-end').seconds,returnAfterSecret:event('sector2-return').seconds,total:n.seconds},naturalMode:n.mode,secret:{template:event('secret-end').state.secret.template,pockets:event('secret-end').state.secret.progress,cache:true,hull:event('secret-end').state.hull},performance:{seconds:perf.seconds,frames:perf.frames,instances:perf.samples[0].instances,visibleMin:Math.min(...perf.samples.map(x=>x.visible)),visibleMax:Math.max(...perf.samples.map(x=>x.visible)),heapMin:Math.min(...perf.samples.map(x=>x.heap)),heapMax:Math.max(...perf.samples.map(x=>x.heap))},screenshots:fs.readdirSync('screenshots/Polish18').filter(f=>f.endsWith('.png')).sort(),runtimeErrors:0,previousRejectedRun:'polish18-natural-rejected-initialization.json (before one-time init fix)',limitations:['No physical Android test','Local rewarded fallback, not Yandex production ads','Audio engine/settings verified; no listening test on user speakers','No new contracts, economy or threat behaviors in this visual-priority pass'],verdict:'READY FOR MANUAL FINAL TEST'};
fs.writeFileSync('docs/polish18-summary.json',JSON.stringify(summary,null,2));console.log(JSON.stringify({pacing:summary.pacing,performance:summary.performance,verdict:summary.verdict},null,2));
