// Earlier layout generators clone these instance templates. Retain one hidden
// template per retired pool so the full source pipeline remains repeatable.
const fs=require('fs'),crypto=require('crypto'),p=JSON.parse(fs.readFileSync('game.json')),l=p.layouts[0];
for(const name of ['CommonSalvage','ScrapGlow','RareContainer','Debris','FastDebris','LaserBeam','LaserEmitter','CorridorWreck'])if(!l.instances.some(i=>i.name===name)){const base=l.instances.find(i=>i.name==='ProcScrap');if(!base)throw Error('Missing procedural template');l.instances.push({...structuredClone(base),name,persistentUuid:crypto.randomUUID()});}
fs.writeFileSync('game.json',JSON.stringify(p,null,2)+'\n');
