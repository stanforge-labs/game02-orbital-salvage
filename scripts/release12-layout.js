const fs=require('fs'),crypto=require('crypto');
const file=process.argv[2]||'game.json',project=JSON.parse(fs.readFileSync(file,'utf8'));
const layout=project.layouts.find(item=>item.name==='OrbitalSalvage')||project.layouts[0];
const resources=project.resources.resources;
for(const file12 of ['laser_beam.svg','laser_emitter.svg','signal_gate.svg','access_key.svg','secret_cache.svg','secret_zone.svg']){const path12='assets/game/'+file12;if(!resources.some(resource12=>resource12.file===path12))resources.push({file:path12,kind:'image',metadata:'',name:path12,smoothed:true,userAdded:true});}
const clone=value=>structuredClone(value),object=name=>layout.objects.find(item=>item.name===name),all=name=>layout.instances.filter(item=>item.name===name);
const addType=(name,source,image)=>{let item=object(name);if(!item){item=clone(object(source));item.name=name;layout.objects.push(item);}if(image)item.animations[0].directions[0].sprites[0].image=image;};
const add=(name,source,props)=>{const item=clone(all(source)[0]);item.name=name;item.persistentUuid=crypto.randomUUID();Object.assign(item,props);layout.instances.push(item);};
// Rebuild only the presentation pieces of the secret encounter. Collision logic remains in Release 11 runtime.
addType('LaserBeam','DamageFlash','assets/game/laser_beam.svg');
addType('SecretPortalGlow','StationGlow','assets/game/signal_gate.svg');
addType('SecretPortalCore','ScrapGlow','assets/game/signal_gate.svg');
addType('AccessKey','RareContainer','assets/game/access_key.svg');
addType('SecretCache','RareContainer','assets/game/secret_cache.svg');
addType('LaserEmitter','FastDebris','assets/game/laser_emitter.svg');
addType('CorridorWreck','SatelliteWreck');
addType('SecretZone','DamageFlash','assets/game/secret_zone.svg');
for(const item of all('SecretPortalGlow'))Object.assign(item,{x:5175,y:885,width:360,height:360});
for(const item of all('SecretPortalCore'))Object.assign(item,{x:5240,y:950,width:230,height:230});
for(const item of all('AccessKey'))Object.assign(item,{x:4360,y:2116,width:104,height:104});
for(const item of all('SecretCache'))Object.assign(item,{x:5800,y:2536,width:118,height:96});
layout.instances=layout.instances.filter(item=>!['LaserEmitter','CorridorWreck'].includes(item.name));
const lasers=[[5120,2240,340,16],[5300,2420,310,16],[5120,2620,340,16]];
lasers.forEach(([x,y,w,h])=>{add('LaserEmitter','LaserBeam',{x:x-24,y:y-8,width:32,height:32,zOrder:8,layer:'World'});add('LaserEmitter','LaserBeam',{x:x+w-8,y:y-8,width:32,height:32,zOrder:8,layer:'World'});});
for(const [x,y,w,h,a] of [[5040,2320,140,80,-10],[5580,2360,120,70,18],[5050,2520,130,75,10],[5530,2700,160,90,-12]])add('CorridorWreck','SatelliteWreck',{x,y,width:w,height:h,angle:a,zOrder:3,layer:'World'});
fs.writeFileSync(file,JSON.stringify(project,null,2)+'\n','utf8');console.log('Release Quality 12 layout applied');
