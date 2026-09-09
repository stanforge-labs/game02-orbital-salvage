const fs=require('fs'),assert=require('assert/strict'),w16=require('./release16-world'),w17=require('./release17-world'),secret=require('./release16-secret-model');
const report={seeds:[],secret:[],failures:[]},limits={scrap:32,heavy:12,energy:12,data:12,decor:160,pois:76,hazards:48};
for(let i=0;i<60;i++){const seed=130013+i*100019,sector=i%2+1,g={seed},again={seed};w16(g,sector,limits);w17(g,sector);w16(again,sector,limits);w17(again,sector);try{
 assert.deepEqual(g,again);assert.equal(g.structures.length,0);assert.ok(g.validation.stationSafe);assert.ok(g.pois.length<=76);
 for(const p of [...g.loot,g.key,g.gate,g.signal])assert.ok(p.x>100&&p.x<6100&&p.y>70&&p.y<2930);
 for(const kind of ['scrap','heavy','energy','data'])assert.ok(g.loot.filter(o=>o.kind===kind).length>=(kind==='scrap'?6:2));
 assert.ok(g.loot.filter(o=>o.kind!=='scrap'&&g.regions[o.region].haz>=3).length>=2,'high-risk mission supply');
 let maxEmpty=0,minLoot=Infinity;for(let x=200;x<6100;x+=100)for(let y=150;y<2900;y+=100){const d=Math.min(...g.pois.map(p=>Math.hypot(p.x-x,p.y-y)),Math.hypot(x-260,y-700));maxEmpty=Math.max(maxEmpty,d);}assert.ok(maxEmpty<590,'unmarked open space '+maxEmpty);
 for(let j=0;j<g.loot.length;j++)for(let k=j+1;k<g.loot.length;k++)minLoot=Math.min(minLoot,Math.hypot(g.loot[j].x-g.loot[k].x,g.loot[j].y-g.loot[k].y));assert.ok(minLoot>50,'overlap');
 const connected=new Set([0]);for(let pass=0;pass<g.regions.length;pass++)for(const [a,b]of g.graph17)if(connected.has(a)||connected.has(b)){connected.add(a);connected.add(b);}assert.equal(connected.size,g.regions.length);
 report.seeds.push({...g.validation,sector,maxEmptyDistance:Math.round(maxEmpty),minLootDistance:Math.round(minLoot),connected:connected.size});
 }catch(e){report.failures.push({seed,sector,error:e.message});}}
for(let i=0;i<8;i++){const m=secret(i);assert.equal(m.route.length,6);assert.ok(m.walls.length<=48);for(const p of m.points)assert.ok(m.walls.every(([x,y,w,h])=>p[0]<x-20||p[0]>x+w+20||p[1]<y-20||p[1]>y+h+20));report.secret.push({template:i,pockets:6,length:m.points.slice(1).reduce((n,p,i)=>n+Math.hypot(p[0]-m.points[i][0],p[1]-m.points[i][1]),0)});}
fs.writeFileSync('docs/release17-seeds.json',JSON.stringify(report,null,2));console.log('SEEDS',report.seeds.length,'FAILURES',report.failures);
