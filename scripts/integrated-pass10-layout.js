const fs=require('fs'),crypto=require('crypto');
const file=process.argv[2]||'game.json';
const project=JSON.parse(fs.readFileSync(file,'utf8'));
const layout=project.layouts.find(item=>item.name==='OrbitalSalvage')||project.layouts[0];
const clone=value=>structuredClone(value);
const object=name=>layout.objects.find(item=>item.name===name);
const instances=name=>layout.instances.filter(item=>item.name===name);
const set=(name,value)=>instances(name).forEach(item=>Object.assign(item,value));
const addType=(name,source)=>{if(!object(name)){const result=clone(object(source));result.name=name;layout.objects.push(result);}};
const add=(name,source,value)=>{const item=clone(instances(source)[0]);item.name=name;item.persistentUuid=crypto.randomUUID();Object.assign(item,value);layout.instances.push(item);};
const textSize=(name,size)=>{const target=object(name);if(target){target.characterSize=size;target.smoothed=true;target.content.characterSize=size;target.content.smoothed=true;}};

// Optical centering: panels use the full 1920×1080 composition instead of the old top-heavy anchors.
set('MenuPanel',{x:500,y:160,width:920,height:760});
set('Title',{x:560,y:318,width:800,height:140});
set('MenuDescription',{x:600,y:506,width:720,height:138});
set('ButtonBg',{x:760,y:670,width:400,height:100});
set('PlayText',{x:760,y:720,width:400,height:60});
set('MenuHint',{x:640,y:808,width:640,height:40});

set('MissionPanel',{x:730,y:38,width:460,height:118});
set('MissionText',{x:748,y:97,width:424,height:90});
textSize('MissionText',19);
set('NavMarker',{x:610,y:180,width:700,height:56});
textSize('NavMarker',20);

set('ResultPanel',{x:400,y:220,width:1120,height:640});
set('ResultTitle',{x:500,y:285,width:920,height:68});
set('ResultStats',{x:570,y:430,width:780,height:230});
set('RewardButtonBg',{x:760,y:620,width:400,height:70});
set('RewardButtonText',{x:760,y:655,width:400,height:52});
instances('ResultButtonBg').forEach((item,index)=>Object.assign(item,{x:index?980:450,y:720,width:490,height:82}));
instances('ResultText').forEach((item,index)=>Object.assign(item,{x:index?980:450,y:761,width:490,height:52}));

set('UpgradePanel',{x:110,y:48,width:1700,height:984});
set('UpgradeTitle',{x:460,y:126,width:1000,height:64});
set('UpgradeNotice',{x:460,y:190,width:1000,height:34});
set('TechText',{x:1380,y:126,width:320,height:54});
instances('UpgradeCardBg').slice(0,3).forEach((item,index)=>Object.assign(item,{x:[170,700,1230][index],y:244,width:500,height:330}));
instances('UpgradeCardText').slice(0,3).forEach((item,index)=>Object.assign(item,{x:[190,720,1250][index],y:342,width:460,height:178}));
instances('UpgradeButtonBg').forEach((item,index)=>Object.assign(item,{x:[195,725,1255][index],y:490,width:450,height:68}));
instances('UpgradeButtonText').forEach((item,index)=>Object.assign(item,{x:[195,725,1255][index],y:524,width:450,height:38}));
set('TechPanel',{x:170,y:622,width:1580,height:168});
set('TechHint',{x:220,y:654,width:360,height:34});
set('RerollButtonBg',{x:600,y:680,width:390,height:72});
set('RerollButtonText',{x:600,y:716,width:390,height:48});
set('ResetButtonBg',{x:1030,y:680,width:390,height:72});
set('ResetButtonText',{x:1030,y:716,width:390,height:48});
set('SystemButtonBg',{x:765,y:782,width:390,height:66});
set('SystemButtonText',{x:765,y:815,width:390,height:48});
set('UpgradeBackButtonBg',{x:735,y:890,width:450,height:70});
set('UpgradeBackText',{x:735,y:925,width:450,height:44});

addType('DevPanel','HudPanel');addType('DevText','MissionText');
addType('SatelliteWreck','Sector2Wreck');addType('SatelliteWreckSmall','Sector2Wreck2');
layout.instances=layout.instances.filter(item=>!['DevPanel','DevText','SatelliteWreck','SatelliteWreckSmall'].includes(item.name));
add('DevPanel','HudPanel',{x:32,y:240,width:560,height:220,zOrder:40,layer:'HUD'});
add('DevText','MissionText',{x:52,y:350,width:520,height:180,zOrder:42,layer:'HUD'});
add('SatelliteWreck','Sector2Wreck',{x:3540,y:760,width:190,height:120,zOrder:2,layer:'World'});
add('SatelliteWreckSmall','Sector2Wreck2',{x:4500,y:1460,width:150,height:104,zOrder:2,layer:'World'});
textSize('DevText',16);

for(const item of layout.objects.filter(entry=>entry.type==='TextObject::Text')){item.smoothed=true;item.content.smoothed=true;}
fs.writeFileSync(file,JSON.stringify(project,null,2)+'\n','utf8');
console.log('Integrated Pass 10 layout applied');
