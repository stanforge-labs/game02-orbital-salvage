module.exports=l=>{
 let [init,play,ui]=l.events.map(e=>e.inlineCode.join('\n'));
 const secretStart=play.indexOf('const inSecret13='),secretEnd=play.indexOf('\n}\nconst module13=',secretStart);if(secretStart<0||secretEnd<0)throw Error('Release15 secret boundary');
 play=play.slice(0,secretStart)+require('fs').readFileSync(require('path').join(__dirname,'release15-secret.txt'),'utf8')+play.slice(secretEnd);
 play=play.replace("o.setAngle(0);o.setPosition(w[0],w[1]);o.setWidth(w[2]);o.setHeight(w[3]);o.setOpacity(235)","o.setWidth(Math.min(w[2],w[3]));o.setHeight(Math.max(w[2],w[3]));o.setAngle(w[2]>w[3]?90:0);o.setCenterPositionInScene(w[0]+w[2]/2,w[1]+w[3]/2);o.setOpacity(235)");
 play=play.replace("s.floatText='ЛАЗЕР −1 КОРПУС'","v.get('Streak').setNumber(0);s.floatText='ЛАЗЕР −1 КОРПУС'");
 init+='\nruntimeScene.__secretModel15='+require('./release15-secret-model').toString()+';';
 init=init.replaceAll("get('ContractsCompleted').getAsNumber()>=4&&installed>=2","get('ContractsCompleted').getAsNumber()>=6&&installed>=2&&get('Credits').getAsNumber()+get('SpentCredits').getAsNumber()>=1000");
 init=init.replaceAll("get('ContractsCompleted').getAsNumber()>=4&&runtimeScene.__osInstalledCount()>=2","get('ContractsCompleted').getAsNumber()>=6&&runtimeScene.__osInstalledCount()>=2&&get('Credits').getAsNumber()+get('SpentCredits').getAsNumber()>=1000");
 init=init.replace("['scrap','КВОТА МЕТАЛЛОЛОМА',s2?8:6","['scrap','КВОТА МЕТАЛЛОЛОМА',6");
 init=init.replace("['nodamage','БЕЗ ПОВРЕЖДЕНИЙ',4","['nodamage','БЕЗ ПОВРЕЖДЕНИЙ',6");
 init=init.replaceAll('cargo:150','cargo:180');ui=ui.replaceAll('cargo:150','cargo:180').replaceAll('3 ПРЕДЛОЖЕНИЯ ИЗ 9 МОДУЛЕЙ','3 ПРЕДЛОЖЕНИЯ ИЗ 11 МОДУЛЕЙ');
 play=play.replace(/if\(v\.get\('ContractsCompleted'\)\.getAsNumber\(\)>=4&&\(\([\s\S]*?v\.get\('SectorUnlocked'\)\.setNumber\(1\);/,"if(v.get('ContractsCompleted').getAsNumber()>=6&&runtimeScene.__osInstalledCount()>=2&&v.get('Credits').getAsNumber()+v.get('SpentCredits').getAsNumber()+v.get('CargoValue').getAsNumber()+bonus>=1000)v.get('SectorUnlocked').setNumber(1);");
 play=play.replace("kind==='scrap'?11:kind==='heavy'?27:18","kind==='scrap'?17:kind==='heavy'?29:21").replace("kind==='scrap'?10:kind==='heavy'?23:18","kind==='scrap'?16:kind==='heavy'?26:21");
 play=play.replace("o.setOpacity(kind==='scrap'?190:250)","o.setOpacity(255)");
 play=play.replace("gate13.setScale(secret13.stage===3?.9+secret13.gate*.18:1.05)","gate13.setWidth(156);gate13.setHeight(156)");
 play=play.replace("sig13.setScale(1.05)","sig13.setWidth(92);sig13.setHeight(92)");
 play=play.replace("o.setWidth(5);o.setHeight(7);","o.pauseAnimation();o.setAnimationFrame(i);o.setWidth(i===4||i===6?8:6);o.setHeight(i===1?10:8);");
 ui=ui.replaceAll('4 КОНТРАКТА И 2 МОДУЛЯ','6 КОНТРАКТОВ • 2 МОДУЛЯ • ОБОРОТ 1000').replaceAll("+'/4 КОНТРАКТА • НУЖНЫ 2 МОДУЛЯ'","+'/6 КОНТРАКТОВ • 2 МОДУЛЯ • ОБОРОТ 1000'");
 // Decorative pools are static, subdued and never animate like pickups.
 ui+=String.raw`
for(const name15 of ['AmbientDebris','ZoneDebris','RouteBeacon','ProcDecor','Sector2Wreck','Sector2Wreck2'])for(const o15 of runtimeScene.getObjects(name15)){o15.pauseAnimation?.();if(o15.__angle15===undefined)o15.__angle15=o15.getAngle();if(name15!=='ProcDecor')o15.setAngle(o15.__angle15);o15.setOpacity(name15==='ProcDecor'?90:75);o15.setColor?.('135;152;170');if(g13.secret.stage>=4&&g13.secret.stage<6)o15.hide();}
for(const o15 of runtimeScene.getObjects('ProcPOI'))o15.setColor('145;161;173');
`;
 init+=String.raw`
if(!runtimeScene.__release15){runtimeScene.__release15=true;
 runtimeScene.__osMap.prices.cargo=180;
 runtimeScene.__visualClasses15={GameplayPickup:['ProcScrap','ProcEnergy','ProcHeavy'],MissionPickup:['ProcData','G13Key','G13Cache'],Hazard:['ProcHazard','MeteorStream','Laser13'],InteractiveStructure:['G13Gate','G13Signal'],POI:['ProcPOI'],BackgroundDecoration:['ProcDecor','AmbientDebris','RouteBeacon','Sector2Wreck','Sector2Wreck2']};
 const gen15=runtimeScene.__g13Generate;
 runtimeScene.__g13Generate=seed=>{gen15(seed);const g=runtimeScene.__g13;g.structures=[];
 g.loot.filter(o=>o.region===0&&o.kind==='scrap').slice(3).forEach(o=>o.region=1);
 g.regions.forEach((r,i)=>{const mode=(g.seed+i*7)%4;r.structuralVariant=['horseshoe','split-lanes','offset-chicane','broken-cross'][mode];
 const a=r.rot,project=(x,y)=>({x:r.x+x*Math.cos(a)-y*Math.sin(a),y:r.y+x*Math.sin(a)+y*Math.cos(a)});
 const layouts=[[[0,-170,260,28],[-145,0,28,340],[0,170,260,28]],[[-100,-100,28,270],[110,150,28,270]],[[-105,-95,250,28],[115,115,250,28]],[[0,-175,28,220],[175,0,220,28],[-150,150,170,28]]];
 if(i>0)for(const [x,y,w,h] of layouts[mode]){const q=project(x,y),rotated=Math.abs(Math.sin(a))>.5;g.structures.push({x:q.x,y:q.y,w:rotated?h:w,h:rotated?w:h,region:i});}
 const loot=g.loot.filter(o=>o.region===i);loot.forEach((o,j)=>{const side=j%2?1:-1,q=project((mode===1?side*230:(j-2)*105),(mode===2?side*220:200+Math.floor(j/3)*100));o.x=Math.max(520,Math.min(6100,q.x));o.y=Math.max(180,Math.min(2850,q.y));});
 const poi=g.pois.find(o=>o.region===i);if(poi){const q=project(mode===3?-220:80,-230);poi.x=q.x;poi.y=q.y;}
 });
 g.loot.filter(o=>o.region===0&&o.kind==='scrap').forEach((o,i)=>{const p=[[700,690],[880,780],[970,570]][i];if(p){o.x=p[0];o.y=p[1];}});
 g.structures=g.structures.filter(w=>w.y-w.h/2>100&&w.y+w.h/2<2950&&[g.key,g.gate,g.signal].every(p=>Math.abs(w.x-p.x)>w.w/2+100||Math.abs(w.y-p.y)>w.h/2+100)).slice(0,32);
 for(const o of g.loot)for(const w of g.structures)if(Math.abs(o.x-w.x)<w.w/2+48&&Math.abs(o.y-w.y)<w.h/2+48)o.y=w.y+w.h/2+55;
 g.hazards=g.hazards.filter(h=>g.loot.every(o=>Math.hypot(h.x-o.x,h.y-o.y)>75));
 g.validation.structuralVariants=g.regions.map(r=>r.structuralVariant);
 g.validation.wallCount=g.structures.length;
 };
}
`;
 play+=String.raw`
// Only nearby physical, visibly rendered structures participate in collision.
const secret15=g13.secret.stage>=4&&g13.secret.stage<6;
runtimeScene.getObjects('RegionWall15').forEach((o,i)=>{const w=g13.structures?.[i],active=w&&!secret15&&Math.hypot(w.x-s.x,w.y-s.y)<1100;o.hide(!active);if(!active)return;o.setWidth(Math.min(w.w,w.h));o.setHeight(Math.max(w.w,w.h));o.setAngle(w.w>w.h?90:0);o.setCenterPositionInScene(w.x,w.y);o.setOpacity(200);const dx=s.x-w.x,dy=s.y-w.y,rx=w.w/2+16,ry=w.h/2+16;if(Math.abs(dx)<rx&&Math.abs(dy)<ry){if(rx-Math.abs(dx)<ry-Math.abs(dy))s.x=w.x+Math.sign(dx||1)*rx;else s.y=w.y+Math.sign(dy||1)*ry;}});
runtimeScene.getObjects('Ship')[0].setCenterPositionInScene(s.x,s.y);
`;
 ui+="\nif(st!=='play')runtimeScene.getObjects('RegionWall15').forEach(o=>o.hide());";
 init=init.replaceAll('getAsNumber()>=1000','getAsNumber()>=1800');play=play.replaceAll('+bonus>=1000','+bonus>=1800');ui=ui.replaceAll('ОБОРОТ 1000','ОБОРОТ 1800');
 l.events[0].inlineCode=[init];l.events[1].inlineCode=[play];l.events[2].inlineCode=[ui];
};
