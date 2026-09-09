const fs=require('fs'),crypto=require('crypto'),p=JSON.parse(fs.readFileSync('game.json')),l=p.layouts[0],obj=n=>l.objects.find(o=>o.name===n);
for(let i=0;i<16;i++){const file='assets/game/composition17-'+i+'.svg';if(!p.resources.resources.some(r=>r.file===file))p.resources.resources.push({name:file,file,kind:'image',smoothed:true,userAdded:true,metadata:''});}
const resource='assets/game/Exo2-Variable.ttf';if(!p.resources.resources.some(r=>r.name===resource))p.resources.resources.push({name:resource,file:resource,kind:'font',userAdded:true});
for(const o of l.objects)if(o.type==='TextObject::Text'){o.font=resource;o.content.font=resource;const header=/Title|Header|Button/.test(o.name);o.bold=header;o.content.bold=header;}
const frames=n=>{const d=obj(n).animations[0].directions[0],base=d.sprites[0];d.sprites=Array.from({length:16},(_,i)=>({...structuredClone(base),image:'assets/game/composition17-'+i+'.svg'}));d.looping=false;};frames('ProcPOI');
const pool=(name,base,count,layer,z)=>{if(!obj(name)){const o=structuredClone(obj(base));o.name=name;l.objects.push(o);}const a=l.instances.find(i=>i.name===base);l.instances=l.instances.filter(i=>i.name!==name);for(let i=0;i<count;i++)l.instances.push({...structuredClone(a),name,layer:layer||a.layer,zOrder:z??a.zOrder,persistentUuid:crypto.randomUUID()});};
pool('ProcPOI','ProcPOI',76);pool('Event17','ProcPOI',4);pool('RegionAtmosphere17','Radiation16',3,'World',-99);
{const file='assets/game/atmosphere17.svg';if(!p.resources.resources.some(r=>r.file===file))p.resources.resources.push({name:file,file,kind:'image',smoothed:true,userAdded:true});obj('RegionAtmosphere17').animations[0].directions[0].sprites[0].image=file;}
fs.writeFileSync('game.json',JSON.stringify(p,null,2)+'\n');
