const fs=require('fs'),p=JSON.parse(fs.readFileSync('docs/world20-cpu-profile.json'));
const nodes=new Map(p.nodes.map(n=>[n.id,n])),times=new Map();for(let i=0;i<p.samples.length;i++)times.set(p.samples[i],(times.get(p.samples[i])||0)+(p.timeDeltas[i]||0));
const top=[...times].map(([id,us])=>({selfMs:us/1000,...nodes.get(id).callFrame})).sort((a,b)=>b.selfMs-a.selfMs).slice(0,30);fs.writeFileSync('docs/world20-cpu-summary.json',JSON.stringify(top,null,2));console.log(top.slice(0,15));
