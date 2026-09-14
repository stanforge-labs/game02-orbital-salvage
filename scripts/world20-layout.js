const fs=require('fs'),p=JSON.parse(fs.readFileSync('game.json')),l=p.layouts[0],m=require('../assets/game/world20/manifest.json');
const names=[...m.large,...m.medium,...m.small];
for(const n of names){const file='assets/game/world20/'+n+'.svg';if(!p.resources.resources.some(r=>r.file===file))p.resources.resources.push({name:file,file,kind:'image',smoothed:true,userAdded:true,metadata:JSON.stringify({description:'Original World20 vector environment'})});}
// GDevelop parses metadata as JSON, not a free-form attribution string.
// Preserve descriptions from previous generated resources without log spam.
for(const r of p.resources.resources)if(r.metadata){try{JSON.parse(r.metadata);}catch{r.metadata=JSON.stringify({description:r.metadata});}}
for(const [name,list]of [['ProcPOI',[...m.large,...m.medium]],['Scenic18',[...m.large,...m.medium]],['ProcDecor',m.small]]){const d=l.objects.find(o=>o.name===name).animations[0].directions[0],base=d.sprites[0];d.sprites=list.map(n=>({...structuredClone(base),image:'assets/game/world20/'+n+'.svg'}));d.looping=false;}
fs.writeFileSync('game.json',JSON.stringify(p,null,2)+'\n');
