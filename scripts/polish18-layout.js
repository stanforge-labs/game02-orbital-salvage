const fs=require('fs'),crypto=require('crypto'),p=JSON.parse(fs.readFileSync('game.json')),l=p.layouts[0],obj=n=>l.objects.find(o=>o.name===n);
const files=[...Array.from({length:24},(_,i)=>'scenic18-'+i),...Array.from({length:6},(_,i)=>'secret-scene18-'+i)];
for(const n of files){const file='assets/game/'+n+'.svg';if(!p.resources.resources.some(r=>r.file===file))p.resources.resources.push({name:file,file,kind:'image',smoothed:true,userAdded:true,metadata:'Original project vector art'});}
const pool=(name,base,count,z)=>{if(!obj(name)){const o=structuredClone(obj(base));o.name=name;l.objects.push(o);}const a=l.instances.find(i=>i.name===base);l.instances=l.instances.filter(i=>i.name!==name);for(let i=0;i<count;i++)l.instances.push({...structuredClone(a),name,layer:'World',zOrder:z,persistentUuid:crypto.randomUUID()});};
pool('Scenic18','ProcPOI',110,-25);pool('SecretScene18','ProcPOI',6,-24);
const frames=(name,list)=>{const d=obj(name).animations[0].directions[0],base=d.sprites[0];d.sprites=list.map(n=>({...structuredClone(base),image:'assets/game/'+n+'.svg'}));d.looping=false;};
frames('ProcPOI',files.slice(0,24));frames('Scenic18',files.slice(0,24));frames('SecretScene18',files.slice(24));
fs.writeFileSync('game.json',JSON.stringify(p,null,2)+'\n');
