const fs=require('fs'),crypto=require('crypto');
const file=process.argv[2]||'game.json';
const project=JSON.parse(fs.readFileSync(file,'utf8'));
const layout=project.layouts.find(item=>item.name==='OrbitalSalvage')||project.layouts[0];
const clone=value=>structuredClone(value),object=name=>layout.objects.find(item=>item.name===name),all=name=>layout.instances.filter(item=>item.name===name);
const set=(name,props)=>all(name).forEach(item=>Object.assign(item,props));
const addType=(name,source)=>{if(!object(name)){const item=clone(object(source));item.name=name;layout.objects.push(item);}};
const replaceType=(name,source)=>{const index=layout.objects.findIndex(item=>item.name===name),item=clone(object(source));item.name=name;if(index>=0)layout.objects[index]=item;else layout.objects.push(item);};
const add=(name,source,props)=>{const item=clone(all(source)[0]);item.name=name;item.persistentUuid=crypto.randomUUID();Object.assign(item,props);layout.instances.push(item);};
const font=(name,size)=>{const item=object(name);if(item){item.characterSize=size;item.smoothed=true;item.content.characterSize=size;item.content.smoothed=true;}};

// One authored modal grid: every full-screen panel has a canonical 1920×1080 centre.
set('MenuPanel',{x:500,y:160,width:920,height:760});
set('ResultPanel',{x:400,y:220,width:1120,height:640});
set('UpgradePanel',{x:110,y:48,width:1700,height:984});
set('SectorSelectPanel',{x:180,y:85,width:1560,height:910});
set('ResetConfirmPanel',{x:440,y:295,width:1040,height:490});

// The tech currency becomes a self-contained readout, away from the amber decoration.
addType('TechReadoutBg','HudPanel');
layout.instances=layout.instances.filter(item=>!['TechReadoutBg','SecretPortalGlow','SecretPortalCore','AccessKey','SecretZone','SecretCache','SecretLabel','MeteorWarning','ZoneMarker','MeteorStream','LaserBeam','ZoneDebris'].includes(item.name));
add('TechReadoutBg','HudPanel',{x:1440,y:76,width:300,height:82,zOrder:18,layer:'HUD'});
set('TechText',{x:1460,y:92,width:260,height:50});font('TechText',18);
set('UpgradeTitle',{x:410,y:126,width:1000,height:64});
set('UpgradeNotice',{x:410,y:192,width:1000,height:32});
set('TechPanel',{x:170,y:618,width:1580,height:184});
set('TechHint',{x:230,y:650,width:430,height:42});font('TechHint',17);
all('UpgradeCardText').slice(0,3).forEach(item=>Object.assign(item,{y:382,height:148}));

// Secret encounter assets use the established sprites: no external art dependency.
addType('SecretPortalGlow','StationGlow');addType('SecretPortalCore','ScrapGlow');addType('AccessKey','RareContainer');addType('SecretZone','DamageFlash');addType('SecretCache','RareContainer');
addType('SecretLabel','FieldLabel');addType('MeteorWarning','FieldLabel');addType('ZoneMarker','FieldLabel');addType('MeteorStream','FastDebris');addType('LaserBeam','DamageFlash');
replaceType('SecretZone','DamageFlash');replaceType('LaserBeam','DamageFlash');
add('SecretPortalGlow','StationGlow',{x:5220,y:930,width:270,height:270,zOrder:2,layer:'World'});
add('SecretPortalCore','ScrapGlow',{x:5292,y:1002,width:126,height:126,zOrder:4,layer:'World'});
add('AccessKey','RareContainer',{x:4380,y:2140,width:64,height:56,zOrder:8,layer:'World'});
add('SecretZone','DamageFlash',{x:5200,y:2050,width:900,height:820,zOrder:1,layer:'World'});
add('SecretCache','RareContainer',{x:5820,y:2550,width:78,height:68,zOrder:8,layer:'World'});
add('SecretLabel','FieldLabel',{x:5120,y:1240,width:480,height:52,zOrder:8,layer:'World'});
add('MeteorWarning','FieldLabel',{x:3020,y:560,width:520,height:44,zOrder:8,layer:'World'});
for(const [x,y,text] of [[980,760,'РАБОЧАЯ ОРБИТА'],[2230,1120,'ПОЛЕ ОБЛОМКОВ'],[3580,720,'КЛАДБИЩЕ СПУТНИКОВ'],[4750,1480,'КОНТЕЙНЕРНЫЙ СЛЕД']])add('ZoneMarker','FieldLabel',{x,y,width:420,height:40,zOrder:3,layer:'World',initialVariables:[{name:'Caption',type:'string',value:text}]});
for(let i=0;i<5;i++)add('MeteorStream','FastDebris',{x:3000+i*70,y:760+i*25,width:34,height:34,zOrder:7,layer:'World'});
for(const [x,y,w,h] of [[5120,2240,340,16],[5300,2420,310,16],[5120,2620,340,16]])add('LaserBeam','DamageFlash',{x,y,width:w,height:h,zOrder:7,layer:'World'});
font('SecretLabel',20);font('MeteorWarning',18);font('ZoneMarker',16);

// Intentional Sector 1 formations: visual-only debris pockets with breathing space.
addType('ZoneDebris','AmbientDebris');
const formations=[[1300,980],[1800,1260],[2320,1180],[2840,820],[3320,1020],[3840,920],[4300,1420],[4720,1600]];
for(const [baseX,baseY] of formations){for(const [dx,dy,w,h,a] of [[0,0,30,20,8],[46,-30,18,34,48],[82,26,34,18,92],[-38,35,24,22,130],[118,-12,18,28,160]])add('ZoneDebris','AmbientDebris',{x:baseX+dx,y:baseY+dy,width:w,height:h,angle:a,zOrder:2,layer:'World'});}
for(const item of layout.objects.filter(entry=>entry.type==='TextObject::Text')){item.smoothed=true;item.content.smoothed=true;}
layout.r=0;layout.v=0;layout.b=0;
fs.writeFileSync(file,JSON.stringify(project,null,2)+'\n','utf8');
console.log('Release Candidate 11 layout applied');
