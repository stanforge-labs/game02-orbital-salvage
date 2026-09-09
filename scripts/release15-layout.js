const fs=require('fs'),crypto=require('crypto'),p=JSON.parse(fs.readFileSync('game.json')),l=p.layouts[0];
const files=[...Array.from({length:6},(_,i)=>`salvage15-${i}.svg`),'gate15.svg','relay15.svg',...Array.from({length:11},(_,i)=>`module15-${i}.svg`)];
for(const f of files){const file='assets/game/'+f;if(!p.resources.resources.some(r=>r.file===file))p.resources.resources.push({name:file,file,kind:'image',metadata:'',smoothed:true,userAdded:true});}
const obj=n=>l.objects.find(o=>o.name===n);
const frames=(n,images)=>{const o=obj(n),d=o.animations[0].directions[0],s=d.sprites[0];d.sprites=images.map(image=>({...structuredClone(s),image:'assets/game/'+image}));d.looping=false;};
frames('ProcScrap',files.slice(0,6));frames('G13Gate',['gate15.svg']);frames('G13Signal',['relay15.svg']);frames('ProcPOI',['relay15.svg','sector2_wreck.svg','sector2_wreck2.svg']);
frames('Module14',files.slice(8));
// Inert ambient fragments never cycle through pickup frames.
for(const n of ['AmbientDebris','RouteBeacon','ProcDecor']){const o=obj(n);if(o?.animations)for(const a of o.animations)for(const d of a.directions)d.looping=false;}
if(!obj('RegionWall15')){const o=structuredClone(obj('CorridorWall'));o.name='RegionWall15';l.objects.push(o);}
l.instances=l.instances.filter(i=>i.name!=='RegionWall15');const base=l.instances.find(i=>i.name==='CorridorWall');for(let i=0;i<32;i++)l.instances.push({...structuredClone(base),name:'RegionWall15',persistentUuid:crypto.randomUUID(),zOrder:0});
for(const [name,count] of [['CorridorWall',24],['Laser13',12],['Emitter13',24]]){const rows=l.instances.filter(i=>i.name===name);for(let i=rows.length;i<count;i++)l.instances.push({...structuredClone(rows[0]),persistentUuid:crypto.randomUUID()});}
// These legacy pools are unconditionally hidden by Release14 and have no live
// collision/collection handlers. Keep object definitions for editor compatibility.
const retired=new Set(['CommonSalvage','ScrapGlow','RareContainer','Debris','FastDebris','LaserBeam','LaserEmitter','CorridorWreck']);
const seen=new Set();l.instances=l.instances.filter(i=>{if(!retired.has(i.name))return true;if(seen.has(i.name))return false;seen.add(i.name);return true;});
fs.writeFileSync('game.json',JSON.stringify(p,null,2)+'\n');
