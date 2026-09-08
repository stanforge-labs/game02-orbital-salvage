const fs=require('fs'),crypto=require('crypto');
const p=JSON.parse(fs.readFileSync('game.json','utf8')),l=p.layouts[0];
const images=[...Array.from({length:6},(_,i)=>`meteor14-${i}.svg`),'bulkhead14.svg','pocket14.svg','dim14.svg','module14.svg'];
for(const image of images){const file='assets/game/'+image;if(!p.resources.resources.some(r=>r.file===file))p.resources.resources.push({file,name:file,kind:'image',metadata:'',smoothed:true,userAdded:true});}
// Fix inherited multi-frame sprite animations: changing only frame zero caused
// hazards to alternate between unrelated, differently-sized assets every 100 ms.
for(const n of ['ProcEnergy','ProcData','ProcHeavy','ProcPOI','G13Signal','G13Key','G13Gate','G13Cache','Laser13','Emitter13','CorridorWall','ShipModules','ModalDim13']){
 const o=l.objects.find(x=>x.name===n);if(!o?.animations)continue;
 o.animations=o.animations.slice(0,1);for(const d of o.animations[0].directions){d.sprites=d.sprites.slice(0,1);d.looping=false;}
}
for(const [n,count] of [['ProcScrap',60],['ProcEnergy',24],['ProcData',12],['ProcHeavy',12],['ProcHazard',48]]){
 const a=l.instances.filter(x=>x.name===n);for(let i=a.length;i<count;i++)l.instances.push({...structuredClone(a[0]),persistentUuid:crypto.randomUUID()});
}
for(const x of l.instances.filter(x=>x.name==='Ship')){x.width=32;x.height=32;}
for(const name of ['MeteorStream','ProcHazard']){const o=l.objects.find(x=>x.name===name),d=o.animations[0].directions[0],source=d.sprites[0];o.animations=o.animations.slice(0,1);d.sprites=Array.from({length:6},(_,i)=>({...structuredClone(source),image:`assets/game/meteor14-${i}.svg`}));d.looping=false;}
{const o=l.objects.find(x=>x.name==='ProcPOI'),d=o.animations[0].directions[0],source=d.sprites[0];d.sprites=['poi_relay.svg','sector2_wreck.svg','sector2_wreck2.svg'].map(image=>({...structuredClone(source),image:'assets/game/'+image}));d.looping=false;}
for(const [name,image] of [['CorridorWall','bulkhead14.svg'],['ModalDim13','dim14.svg']])l.objects.find(x=>x.name===name).animations[0].directions[0].sprites[0].image='assets/game/'+image;
if(!l.objects.some(x=>x.name==='SafePocket14')){const o=structuredClone(l.objects.find(x=>x.name==='G13Signal'));o.name='SafePocket14';o.animations[0].directions[0].sprites[0].image='assets/game/pocket14.svg';l.objects.push(o);}
l.instances=l.instances.filter(x=>x.name!=='SafePocket14');
for(let i=0;i<6;i++)l.instances.push({...structuredClone(l.instances.find(x=>x.name==='G13Signal')),name:'SafePocket14',persistentUuid:crypto.randomUUID(),width:100,height:100,zOrder:2});
if(!l.objects.some(x=>x.name==='Module14')){const o=structuredClone(l.objects.find(x=>x.name==='G13Key'));o.name='Module14';o.animations[0].directions[0].sprites[0].image='assets/game/module14.svg';l.objects.push(o);}
l.instances=l.instances.filter(x=>x.name!=='Module14');for(let i=0;i<11;i++)l.instances.push({...structuredClone(l.instances.find(x=>x.name==='G13Key')),name:'Module14',persistentUuid:crypto.randomUUID(),width:6,height:8,zOrder:10});
fs.writeFileSync('game.json',JSON.stringify(p,null,2)+'\n');
