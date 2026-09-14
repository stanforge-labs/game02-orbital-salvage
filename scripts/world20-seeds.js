const fs=require('fs'),assert=require('assert/strict'),w16=require('./release16-world'),w17=require('./release17-world'),w18=require('./polish18-world'),w19=require('./polish19-world'),w20=require('./world20-world');
const report={method:'100 deterministic seed/sector cases; conservative presentation disks and unchanged gameplay snapshot; coverage is a geometry proxy, not artistic proof',seeds:[],errors:[]};
for(let i=0;i<100;i++){
 const seed=130013+i*100019,sector=i%2+1,g={seed};w16(g,sector,{scrap:32,heavy:12,energy:12,data:12,decor:160,pois:76,hazards:48});w17(g,sector);w18(g);w19(g);
 const snapshot=()=>JSON.stringify([g.loot,g.hazards,g.events17,g.key,g.gate,g.signal,g.graph17,g.pois]);const before=snapshot();w20(g);
 try{assert.equal(snapshot(),before);assert.ok(g.env20.length<=110);assert.ok(g.micro20.length<=160);let minimum=Infinity;
 assert.ok(g.validation.stationSafe);
 assert.ok(g.loot.every(p=>g.hazards.every(h=>Math.hypot(p.x-h.x,p.y-h.y)>180)));
 assert.ok([g.key,g.gate,g.signal].every(p=>p.x>70&&p.x<6130&&p.y>70&&p.y<2930&&g.hazards.every(h=>Math.hypot(p.x-h.x,p.y-h.y)>210)));
 const reached=new Set([0]);for(let n=0;n<g.regions.length;n++)for(const[a,b]of g.graph17){if(reached.has(a))reached.add(b);if(reached.has(b))reached.add(a);}assert.equal(reached.size,g.regions.length);
 const protectedPoints=[...g.loot,...g.events17,g.signal,g.key,g.gate,{x:260,y:700,r:300}];
 for(const d of g.env20){assert.ok(protectedPoints.every(p=>Math.hypot(p.x-d.x,p.y-d.y)>=d.radius+(p.r||72)));assert.ok(g.hazards.every(p=>Math.hypot(p.x-d.x,p.y-d.y)>=d.radius+(p.size||45)+60));}
 for(let a=0;a<g.env20.length;a++)for(let b=a+1;b<g.env20.length;b++){const A=g.env20[a],B=g.env20[b],d=Math.hypot(A.x-B.x,A.y-B.y);assert.ok(d>=A.radius+B.radius+45);if(A.tier==='large'&&B.tier==='large'&&A.family===B.family)minimum=Math.min(minimum,d);}assert.ok(minimum>=800);
 let maxEmpty=0,covered=0,total=0;for(let x=350;x<6000;x+=200)for(let y=200;y<2900;y+=200){const nearest=Math.min(...g.env20.map(d=>Math.max(0,Math.hypot(d.x-x,d.y-y)-d.radius)));maxEmpty=Math.max(maxEmpty,nearest);if(nearest<420)covered++;total++;}
 const copy=JSON.stringify([g.env20,g.micro20]);w20(g);assert.equal(JSON.stringify([g.env20,g.micro20]),copy);
 report.seeds.push({seed,sector,...g.art20,minSameFamilyDistance:Number.isFinite(minimum)?minimum:null,maxDistanceToScenery:Math.round(maxEmpty),coverageWithin420:covered/total,gameplayUnchanged:true,stationSafe:g.validation.stationSafe});
 }catch(e){report.errors.push({seed,error:e.stack});}
}fs.writeFileSync('docs/world20-seeds.json',JSON.stringify(report,null,2));console.log({checked:report.seeds.length,errors:report.errors,maximumGap:Math.max(...report.seeds.map(s=>s.maxDistanceToScenery))});if(report.errors.length)process.exitCode=1;
