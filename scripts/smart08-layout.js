const fs=require('fs'),crypto=require('crypto');
const file=process.argv[2]||'game.json';const p=JSON.parse(fs.readFileSync(file,'utf8')),l=p.layouts[0];
const clone=x=>structuredClone(x),obj=n=>l.objects.find(o=>o.name===n),all=n=>l.instances.filter(o=>o.name===n);
const set=(n,a)=>all(n).forEach(o=>Object.assign(o,a));
const sizeText=(n,size)=>{Object.assign(obj(n),{characterSize:size,smoothed:true});Object.assign(obj(n).content,{characterSize:size,smoothed:true});};
const addType=(name,source)=>{if(!obj(name)){const o=clone(obj(source));o.name=name;l.objects.push(o);}};
const add=(name,source,a)=>{const i=clone(all(source)[0]);i.name=name;i.persistentUuid=crypto.randomUUID();Object.assign(i,a);l.instances.push(i);};
// Keep the established background at native desktop density on the bottom layer.
set('Background',{layer:'',x:-120,y:-60,width:2160,height:1215});set('Haze',{layer:'',x:0,y:0,width:1920,height:1080});
set('MissionPanel',{x:740,y:28,width:440,height:108});set('MissionText',{x:752,y:82,width:416,height:84});sizeText('MissionText',20);
sizeText('ObjectiveText',24);
set('NavMarker',{x:590,y:165,width:740,height:70});sizeText('NavMarker',22);
set('ResultStats',{x:570,y:325,width:780,height:230});sizeText('ResultStats',24);
set('ResultPanel',{height:530});
set('SectorSelectText',{y:458});obj('SectorSelectHint').content.textAlignment='center';obj('SectorSelectHint').textAlignment='center';
sizeText('RotateTitle',28);sizeText('RotateHint',19);
all('UpgradeCardBg').slice(0,3).forEach(i=>i.height=360);
set('FieldZone',{x:2100,y:770,width:380,height:260});set('FieldLabel',{x:2100,y:1050,width:380});
set('DangerZone',{x:4780,y:280,width:640,height:640});set('DangerLabel',{x:4900,y:990,width:500});set('RiskLabel',{x:4900,y:1030,width:500});
set('Sector2Band',{x:3800,y:600,width:420,height:280});
set('Sector2Dust',{x:0,y:0,width:6200,height:3000});
set('Sector2Wreck',{x:4700,y:820,width:230,height:145});set('Sector2Wreck2',{x:5250,y:2090,width:200,height:130});
// Keep one input controller. The custom damping stays intact for both arrows and WASD.
obj('Ship').behaviors[0].ignoreDefaultControls=true;
for(const n of ['CommonSalvage','ScrapGlow'])while(all(n).length<8)add(n,n,{});
while(all('Debris').length<10)add('Debris','Debris',{});
set('RareContainer',{width:48,height:42});
addType('RouteBeacon','ScrapGlow');addType('RouteLabel','FieldLabel');addType('AmbientDebris','CommonSalvage');addType('PickupText','StatusText');addType('MagnetAura','ScrapGlow');
l.instances=l.instances.filter(o=>!['RouteBeacon','RouteLabel','AmbientDebris','PickupText','MagnetAura'].includes(o.name));
add('MagnetAura','ScrapGlow',{x:270,y:620,width:160,height:160,zOrder:7});
const beacons=[[960,940,'РАБОЧАЯ ОРБИТА →'],[2150,1280,'ПОЛЕ ОБЛОМКОВ →'],[3400,900,'ДАЛЬНИЙ МАРШРУТ →'],[4480,1580,'КОНТЕЙНЕРЫ ↗'],[4750,1050,'ОПАСНЫЙ КАРМАН ↑']];
for(const [x,y,text] of beacons){add('RouteBeacon','ScrapGlow',{x,y,width:24,height:24,zOrder:3});add('RouteLabel','FieldLabel',{x:x-80,y:y+35,width:360,height:36,zOrder:3,initialVariables:[{name:'Caption',type:'string',value:text}]});}
sizeText('RouteLabel',13);sizeText('PickupText',16);obj('PickupText').content.textAlignment='center';obj('PickupText').content.verticalTextAlignment='top';
add('PickupText','StatusText',{layer:'World',x:200,y:500,width:220,height:42,zOrder:20});
const cfg=require('./smart08-config');
set('DangerZone',{x:cfg.danger.x-320,y:cfg.danger.y-320});
set('Sector2Wreck',{x:cfg.danger.x-350,y:820});set('Sector2Wreck2',{x:cfg.rare2[1][0]-250,y:2090});
set('DangerLabel',{x:cfg.danger.x-200,y:990});set('RiskLabel',{x:cfg.danger.x-200,y:1030});
for(let i=0;i<38;i++){const x=550+(i*421)%5200,y=380+(i*347)%2130;add('AmbientDebris','CommonSalvage',{x,y,width:14+i%4*4,height:12+i%3*4,angle:(i*73)%360,zOrder:2});}
for(const [x,y] of cfg.scrap){for(let i=0;i<4;i++)add('AmbientDebris','CommonSalvage',{x:x+140+i*38,y:y+120+(i%2)*46,width:18+i*4,height:16+i*3,angle:i*53,zOrder:2});}
const clusters=[[1050,930],[1750,1120],[2420,860],[3180,1360],[3860,820],[4380,1510]];
for(const [x,y] of clusters)for(const [dx,dy,w,h,a] of [[0,0,24,18,-12],[48,28,18,28,28],[92,-18,28,16,64]])add('AmbientDebris','CommonSalvage',{x:x+dx,y:y+dy,width:w,height:h,angle:a,zOrder:2});
// Leave source scene instances on the same authored positions as runtime.
all('CommonSalvage').forEach((o,i)=>Object.assign(o,{x:cfg.scrap[i][0]-17,y:cfg.scrap[i][1]-15,width:34,height:30}));
all('RareContainer').forEach((o,i)=>Object.assign(o,{x:cfg.rare[i][0]-24,y:cfg.rare[i][1]-21}));
all('Debris').concat(all('FastDebris')).forEach((o,i)=>Object.assign(o,{x:cfg.hazard[i][0]-24,y:cfg.hazard[i][1]-24,width:48,height:48}));
for(const o of l.objects.filter(o=>o.type==='TextObject::Text')){o.smoothed=true;o.content.smoothed=true;}
l.r=0;l.v=0;l.b=0;
fs.writeFileSync(file,JSON.stringify(p,null,2)+'\n');console.log('Smart08 source layout updated');
