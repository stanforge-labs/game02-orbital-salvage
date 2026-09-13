const fs=require('fs'),assert=require('assert/strict'),w16=require('./release16-world'),w17=require('./release17-world'),w18=require('./polish18-world'),w19=require('./polish19-world');
const report={seeds:[],errors:[]};
for(let i=0;i<60;i++){
 const seed=130013+i*100019,sector=i%2+1,g={seed};w16(g,sector,{scrap:32,heavy:12,energy:12,data:12,decor:160,pois:76,hazards:48});w17(g,sector);w18(g);
 const gameplay=()=>JSON.stringify([g.loot,g.hazards,g.events17,g.key,g.gate,g.signal,g.graph17,g.pois.map(p=>[p.x,p.y,p.region,p.primary])]);const before=gameplay();w19(g);
 try{assert.equal(gameplay(),before);const all=[...g.pois,...g.scenic18];let min=Infinity;
 for(let a=0;a<all.length;a++)for(let b=a+1;b<all.length;b++)if(all[a].size>=90&&all[b].size>=90&&all[a].silhouette19===all[b].silhouette19)min=Math.min(min,Math.hypot(all[a].x-all[b].x,all[a].y-all[b].y));assert.ok(min>=620,'duplicate family spacing '+min);
 const copy=JSON.stringify(all);w19(g);assert.equal(JSON.stringify([...g.pois,...g.scenic18]),copy);
 report.seeds.push({seed,sector,objects:all.length,families:new Set(all.map(p=>p.family19)).size,minSameFamilyDistance:min,gameplayUnchanged:true});
 }catch(e){report.errors.push({seed,error:e.message});}
}fs.writeFileSync('docs/polish19-seeds.json',JSON.stringify(report,null,2));console.log({seeds:report.seeds.length,errors:report.errors});if(report.errors.length)process.exitCode=1;
