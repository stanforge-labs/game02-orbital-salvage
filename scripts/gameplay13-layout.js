const fs=require('fs'),crypto=require('crypto');
const file=process.argv[2]||'game.json',project=JSON.parse(fs.readFileSync(file,'utf8'));
const layout=project.layouts.find(item=>item.name==='OrbitalSalvage')||project.layouts[0],resources=project.resources.resources;
const images=['salvage_energy.svg','salvage_data.svg','salvage_heavy.svg','poi_relay.svg','ship_modules.svg'];
for(const image of images){const p='assets/game/'+image;if(!resources.some(r=>r.file===p))resources.push({file:p,kind:'image',metadata:'',name:p,smoothed:true,userAdded:true});}
const clone=v=>structuredClone(v),obj=n=>layout.objects.find(o=>o.name===n),all=n=>layout.instances.filter(i=>i.name===n);
const type=(name,source,image)=>{let o=obj(name);if(!o){o=clone(obj(source));o.name=name;layout.objects.push(o);}if(image)o.animations[0].directions[0].sprites[0].image=image;};
const add=(name,source,p)=>{const i=clone(all(source)[0]);i.name=name;i.persistentUuid=crypto.randomUUID();Object.assign(i,p);layout.instances.push(i);};
for(const n of ['ProcLoot','ProcScrap','ProcEnergy','ProcData','ProcHeavy','ProcDecor','ProcHazard','ProcPOI','RegionReveal','G13Signal','G13Key','G13Gate','G13Cache','Laser13','Emitter13','CorridorWall','ShipModules','MeteorTelegraph','Dev13Panel','Dev13Text'])layout.instances=layout.instances.filter(i=>i.name!==n);
type('ProcLoot','RareContainer','assets/game/salvage_energy.svg');type('ProcScrap','CommonSalvage');type('ProcEnergy','RareContainer','assets/game/salvage_energy.svg');type('ProcData','RareContainer','assets/game/salvage_data.svg');type('ProcHeavy','RareContainer','assets/game/salvage_heavy.svg');type('ProcDecor','AmbientDebris');type('ProcHazard','FastDebris');type('ProcPOI','SatelliteWreck','assets/game/poi_relay.svg');
type('RegionReveal','FieldLabel');type('G13Signal','SecretPortalGlow','assets/game/signal_gate.svg');type('G13Key','AccessKey','assets/game/access_key.svg');type('G13Gate','SecretPortalGlow','assets/game/signal_gate.svg');type('G13Cache','SecretCache','assets/game/secret_cache.svg');
type('Laser13','LaserBeam','assets/game/laser_beam.svg');type('Emitter13','LaserEmitter','assets/game/laser_emitter.svg');type('CorridorWall','SatelliteWreck');type('ShipModules','ScrapGlow','assets/game/ship_modules.svg');type('MeteorTelegraph','FieldLabel');type('Dev13Panel','HudPanel');type('Dev13Text','FieldLabel');
for(let i=0;i<36;i++)add('ProcScrap','CommonSalvage',{x:-2000,y:-2000,width:48,height:48,zOrder:7,layer:'World'});
for(let i=0;i<12;i++)add('ProcEnergy','RareContainer',{x:-2000,y:-2000,width:54,height:54,zOrder:7,layer:'World'});
for(let i=0;i<8;i++)add('ProcData','RareContainer',{x:-2000,y:-2000,width:58,height:58,zOrder:8,layer:'World'});
for(let i=0;i<8;i++)add('ProcHeavy','RareContainer',{x:-2000,y:-2000,width:92,height:62,zOrder:8,layer:'World'});
for(let i=0;i<72;i++)add('ProcDecor','AmbientDebris',{x:-2000,y:-2000,width:32,height:24,zOrder:2,layer:'World'});
for(let i=0;i<24;i++)add('ProcHazard','FastDebris',{x:-2000,y:-2000,width:48,height:48,zOrder:6,layer:'World'});
for(let i=0;i<12;i++)add('ProcPOI','SatelliteWreck',{x:-2000,y:-2000,width:210,height:150,zOrder:3,layer:'World'});
add('RegionReveal','FieldLabel',{x:640,y:230,width:640,height:100,zOrder:30,layer:'HUD'});
add('G13Signal','SecretPortalGlow',{x:-2000,y:-2000,width:330,height:330,zOrder:5,layer:'World'});add('G13Key','AccessKey',{x:-2000,y:-2000,width:104,height:104,zOrder:8,layer:'World'});add('G13Gate','SecretPortalGlow',{x:-2000,y:-2000,width:390,height:390,zOrder:5,layer:'World'});add('G13Cache','SecretCache',{x:-2000,y:-2000,width:150,height:122,zOrder:9,layer:'World'});
for(let i=0;i<9;i++){add('Laser13','LaserBeam',{x:-2000,y:-2000,width:300,height:18,zOrder:8,layer:'World'});add('Emitter13','LaserEmitter',{x:-2000,y:-2000,width:34,height:34,zOrder:9,layer:'World'});add('Emitter13','LaserEmitter',{x:-2000,y:-2000,width:34,height:34,zOrder:9,layer:'World'});}
for(let i=0;i<18;i++)add('CorridorWall','SatelliteWreck',{x:-2000,y:-2000,width:160,height:90,zOrder:4,layer:'World'});
add('ShipModules','ScrapGlow',{x:-2000,y:-2000,width:92,height:92,zOrder:6,layer:'World'});add('MeteorTelegraph','FieldLabel',{x:-2000,y:-2000,width:440,height:48,zOrder:10,layer:'World'});
add('Dev13Panel','HudPanel',{x:24,y:690,width:570,height:350,zOrder:80,layer:'HUD'});add('Dev13Text','FieldLabel',{x:48,y:715,width:520,height:300,zOrder:81,layer:'HUD'});
const reveal=obj('RegionReveal');if(reveal){reveal.characterSize=32;reveal.content.characterSize=32;reveal.content.textAlignment='center';}
const dev=obj('Dev13Text');if(dev){dev.characterSize=16;dev.content.characterSize=16;dev.content.textAlignment='left';}
layout.r=0;layout.v=0;layout.b=0;
fs.writeFileSync(file,JSON.stringify(project,null,2)+'\n');console.log('Gameplay Overhaul 13 layout applied');
