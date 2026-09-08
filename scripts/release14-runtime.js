// Consolidate overlapping legacy encounters without changing the flight integrator/camera.
module.exports=function(layout){
 let [init,play,ui]=layout.events.map(e=>e.inlineCode.join('\n'));
 const cut=(s,a,b)=>{const x=s.indexOf(a),y=s.indexOf(b,x);if(x<0||y<0)throw Error('Release14 boundary: '+a);return s.slice(0,x)+s.slice(y);};
 init=cut(init,"if(st==='upgrades'&&release&&uiClick){const boxes13",'\n');
 play=cut(play,'const scraps=runtimeScene',"if(v.get('Cargo').getAsNumber()>0&&Math.hypot(s.x-260");
 play=cut(play,"const key11=runtimeScene.getObjects('AccessKey')",'const g13=runtimeScene.__g13');
 // No invisible legacy trigger may award loot, teleport the player, or damage the ship.
 init=init.replace("active:event.type==='pointerdown'||event.type==='pointermove'&&event.buttons>0","active:(event.pointerType==='touch'||event.pointerType==='pen')&&(event.type==='pointerdown'||event.type==='pointermove'&&event.buttons>0)");
 play=play.replace('down=im.isMouseButtonPressed(gdjs.InputManager.MOUSE_LEFT_BUTTON)||(pointer&&pointer.active)','down=!!(pointer&&pointer.active)');
 play=play.replace("g13.run!==run13)runtimeScene.__g13Generate();","g13.run!==run13){runtimeScene.__g13Generate();runtimeScene.__os11.repairUsed=false;}");
 play=play.replace('o.setScale(scale);',"o.pauseAnimation();o.setAnimationFrame(i%6);o.setWidth(kind==='scrap'?11:kind==='heavy'?27:18);o.setHeight(kind==='scrap'?10:kind==='heavy'?23:18);");
 play=play.replace("o.setScale(d.size/540);o.setAngle(d.angle);o.setOpacity(48);","o.pauseAnimation();o.setAnimationFrame(Math.floor(d.angle)%6);o.setWidth(d.size*.72);o.setHeight(d.size*.6);o.setCenterPositionInScene(d.x,d.y);o.setAngle(d.angle);o.setOpacity(95);");
 play=play.replace("o.setScale(.32+(i%3)*.055);o.setAngle((i*47)%360);o.setOpacity(118);","o.pauseAnimation();o.setAnimationFrame(d.kind==='working'||d.kind==='relay'?0:d.kind==='graveyard'?2:1);o.setWidth(d.kind==='working'?105:190);o.setHeight(d.kind==='working'?82:126);o.setCenterPositionInScene(d.x,d.y);o.setAngle((i*47)%360);o.setOpacity(170);");
 play=play.replace("78*(1+v.get('MagnetLevel').getAsNumber()*.25)","32*(1+v.get('MagnetLevel').getAsNumber()*.25)");
 play=play.replace("s.floatText=lootName13[d.kind]+' +'+lootValue13[d.kind]+' • '+slots+' МЕСТО';s.floatLife=1;", "pickup(lootValue13[d.kind],lootName13[d.kind]);");
 play=play.replace("o.setScale(.045+(i%3)*.012);","o.pauseAnimation();o.setAnimationFrame(i%6);o.setWidth(24+(i%3)*10);o.setHeight(24+(i%3)*10);");
 play=play.replace('near13(xx,yy,38)','near13(xx,yy,21+(i%3)*5)');
 play=play.replace('o.setScale(.64+(i%2)*.12);',"o.pauseAnimation();o.setAnimationFrame(i%6);o.setWidth(28+(i%3)*8);o.setHeight(28+(i%3)*8);");
 play=play.replace('near13(x,y,38)','near13(x,y,24)');
 play=play.replace("if(v.get('Cargo').getAsNumber()>0&&Math.hypot(s.x-260,s.y-700)<145)","if(Math.hypot(s.x-260,s.y-700)>230)s.leftStation14=true;if((v.get('CargoValue').getAsNumber()>0||s.leftStation14)&&Math.hypot(s.x-260,s.y-700)<115)");
 play=play.replace("const active=Math.hypot(s.x-d.x,s.y-d.y)<1220;","const active=!(g13.secret.stage>=4&&g13.secret.stage<6)&&Math.hypot(s.x-d.x,s.y-d.y)<1220;");
 play=play.replace("o.hide(!ma13);if(ma13)","o.hide(!ma13||g13.secret.stage>=4&&g13.secret.stage<6);if(ma13&&!(g13.secret.stage>=4&&g13.secret.stage<6))");
 play=play.replace("const mt=v.get('MissionType').getAsString();if(mt===", "const mt=v.get('MissionType').getAsString();if(mt==='danger'&&(g13.regions[d.region]?.haz||0)>1||mt==='courier'&&d.kind==='heavy'||mt==='fragile'&&d.kind==='data')v.get('MissionProgress').setNumber(Math.min(v.get('MissionTarget').getAsNumber(),v.get('MissionProgress').getAsNumber()+1));if(mt===");
 play=play.replace("else if(v.get('MissionProgress').getAsNumber()>=target)","else if(v.get('MissionProgress').getAsNumber()>=target&&(mt!=='fragile'||v.get('RunDamage').getAsNumber()===0)&&(mt!=='courier'||v.get('RunTime').getAsNumber()<=v.get('MissionTimeLimit').getAsNumber()))");
 play=play.replace("mt==='highrisk'&&d.kind!=='scrap'","mt==='highrisk'&&d.kind!=='scrap'&&(g13.regions[d.region]?.haz||0)>=3");
 play=play.replace("const inSecret13=secret13.stage>=4", "const inSecret13=secret13.stage>=4&&secret13.stage<6");
 {const start=play.indexOf(' const inSecret13='),end=play.indexOf('\n}\nconst module13=',start);if(start<0||end<0)throw Error('Secret replacement boundary');play=play.slice(0,start)+require('fs').readFileSync(require('path').join(__dirname,'release14-secret.txt'),'utf8')+play.slice(end);}
 play=play.replace("s.floatText='−1 КОРПУС';s.floatLife=.9;", "v.get('Streak').setNumber(0);s.floatText='−1 КОРПУС';s.floatLife=.9;");
 // Keep the saved-generation system; fill every pool from the actual generated content.
 init=init.replace("g.loot.unshift(...[[620,690],[760,800],[900,690],[1030,820],[1080,680],[1150,850]]", "g.loot.unshift(...[[700,690],[1150,850]]");
 init=init.replace("if(init.includes('__gameplay13'))return;",'');
 init=init.replace('t=i===0?templates13[0]:pool13[','t=i<4?templates13[[0,2,4,3][i]]:pool13[');
 init+=String.raw`
if(!runtimeScene.__release14){runtimeScene.__release14=true;
 try{const saved14=JSON.parse(localStorage.getItem('orbitalSalvageSave')||'{}');if(['Offer1','Offer2','Offer3'].every(k=>typeof saved14[k]==='string'&&saved14[k]))for(const k of ['Offer1','Offer2','Offer3'])get(k).setString(saved14[k]);}catch(error14){console.warn('Не удалось восстановить предложения',error14);}
 const generate14=runtimeScene.__g13Generate;
 const mission14=runtimeScene.__osMission;runtimeScene.__osMission=()=>{mission14();const n=get('ContractsCompleted').getAsNumber()%14,extra=[['relay','ПОИСК РЕТРАНСЛЯТОРОВ',2,120,1,0],['survey','РАЗВЕДКА ТРЁХ УЧАСТКОВ',3,100,0,0],['fragile','ДАННЫЕ БЕЗ ПОВРЕЖДЕНИЙ',1,130,1,0],['courier','ЭКСПРЕСС-КОНТЕЙНЕР',1,115,0,90]][n-10];if(extra){for(const [k,i] of [['MissionType',0],['Mission',1]])get(k).setString(extra[i]);for(const [k,i] of [['MissionTarget',2],['MissionReward',3],['MissionTechReward',4],['MissionTimeLimit',5]])get(k).setNumber(extra[i]);}};
 runtimeScene.__g13Generate=(seed14)=>{generate14(seed14);const g=runtimeScene.__g13;
 g.regions.forEach((r,i)=>{const variant=(g.seed+i*31)%2;r.variant=r.id+(variant?'-trail':'-crescent');
 const loot=g.loot.filter(o=>o.region===i);loot.forEach((o,j)=>{const a=r.rot+(variant?j*.25-1:j*.48+.45),distance=variant?160+j*85:230+(j%2)*55;o.x=r.x+Math.cos(a)*distance;o.y=Math.max(160,Math.min(1850,r.y+Math.sin(a)*distance));});
 });
 // Objects in a flight must all have backing pool slots. Reject excess data instead of invisible collectibles.
 for(const [kind,name] of [['scrap','ProcScrap'],['energy','ProcEnergy'],['data','ProcData'],['heavy','ProcHeavy']]){let count=0,limit=runtimeScene.getObjects(name).length;g.loot=g.loot.filter(o=>o.kind!==kind||count++<limit);}
 g.hazards=g.hazards.slice(0,runtimeScene.getObjects('ProcHazard').length);
 g.hazards=g.hazards.filter(h=>g.loot.every(l=>Math.hypot(h.x-l.x,h.y-l.y)>70)&&Math.hypot(h.x-260,h.y-700)>520);
 g.visited=[];g.relays=[];
 g.validation={seed:g.seed,regions:g.regions.length,variants:g.regions.map(r=>r.variant),loot:g.loot.length,hazards:g.hazards.length,stationSafe:g.hazards.every(h=>Math.hypot(h.x-260,h.y-700)>520)};
 };
}
`;
 ui=cut(ui,'// Keep large world silhouettes and pickups out',"if(!s.dev&&v.get('Status')");
 {const a=ui.indexOf("if((typeof location!=='undefined')"),b=ui.indexOf('const g13=runtimeScene.__g13',a);if(a<0||b<0)throw Error('F9 boundary');ui=ui.slice(0,a)+String.raw`
if(devAllowedUi10&&s.dev&&key11==='F9'){v.get('CurrentSector').setNumber(2);runtimeScene.__g13Generate();runtimeScene.__g13.secret.stage=4;runtimeScene.__g13.secret.progress=0;v.get('GameState').setString('play');s.x=5000;s.y=2320;s.vx=0;s.vy=0;runtimeScene.__osCam={x:s.x,y:s.y};runtimeScene.getObjects('Ship')[0].setCenterPositionInScene(s.x,s.y);}
`+ui.slice(b);}
 play=play.replace("if(st!=='play'||!s)return;","if(st!=='play'||!s||s.rewardBusy||document.hidden)return;");
 play+=String.raw`
if(v.get('Hull').getAsNumber()<=0){if(v.get('ShieldLevel').getAsNumber()>0&&!s.shieldUsed10){s.shieldUsed10=true;v.get('Hull').setNumber(1);v.get('RunDamage').setNumber(Math.max(0,v.get('RunDamage').getAsNumber()-1));s.floatText='ЩИТ ПОГЛОТИЛ УДАР';s.floatLife=1;}else fail();}
if(g13.region>=0&&!g13.visited.includes(g13.region)){g13.visited.push(g13.region);if(v.get('MissionType').getAsString()==='survey')v.get('MissionProgress').setNumber(Math.min(3,g13.visited.length));}
if(v.get('MissionType').getAsString()==='relay'||v.get('MissionType').getAsString()==='signal'&&sec13===1)g13.pois.forEach((p,i)=>{if(!g13.relays.includes(i)&&Math.hypot(s.x-p.x,s.y-p.y)<100){g13.relays.push(i);v.get('MissionProgress').setNumber(Math.min(2,g13.relays.length));}});
const ship14=runtimeScene.getObjects('Ship')[0];ship14.setWidth(32);ship14.setHeight(32);ship14.setCenterPositionInScene(s.x,s.y);
const moduleIds14=['cargo','engine','hull','magnet','radar','insurance','shield','assist','contract','repair','scanner'];runtimeScene.getObjects('Module14').forEach((o,i)=>{const installed14=runtimeScene.__osModuleDone(moduleIds14[i]);o.hide(!installed14);if(installed14){const dx14=(i%2?-1:1)*(i<6?14:10),dy14=-10+Math.floor(i/2)*4,a14=s.angle*Math.PI/180;o.setWidth(5);o.setHeight(7);o.setCenterPositionInScene(s.x+dx14*Math.cos(a14)-dy14*Math.sin(a14),s.y+dx14*Math.sin(a14)+dy14*Math.cos(a14));o.setAngle(s.angle);}});
`;
 ui+=String.raw`
// One authoritative procedural world; old pools remain available to the editor, but inactive.
for(const n14 of ['CommonSalvage','ScrapGlow','RareContainer','Debris','FastDebris','AccessKey','SecretPortalGlow','SecretPortalCore','SecretCache','SecretZone','LaserBeam','LaserEmitter','CorridorWreck','RouteLabel','ZoneMarker','MeteorWarning','SatelliteWreck','SatelliteWreckSmall','FieldZone','DangerZone','ShipModules'])runtimeScene.getObjects(n14).forEach(o=>o.hide());
if(st!=='play')for(const n14 of ['ProcDecor','ProcPOI','ProcScrap','ProcEnergy','ProcData','ProcHeavy','ProcHazard','MeteorStream','G13Signal','G13Key','G13Gate','G13Cache','Laser13','Emitter13','CorridorWall','RegionReveal','MeteorTelegraph'])runtimeScene.getObjects(n14).forEach(o=>o.hide());
if(st==='play'){
 const float14=runtimeScene.getObjects('PickupText')[0];if(float14&&!float14.isHidden()){const cam14=runtimeScene.__osCam,px14=(s.x-cam14.x)*2+960,py14=(s.y-cam14.y)*2+540,w14=float14.getWidth()*2,h14=float14.getHeight()*2;let left14=px14+55;if(left14+w14>1880)left14=px14-55-w14;left14=Math.max(40,Math.min(1880-w14,left14));const top14=Math.max(240,Math.min(920-h14,py14-100));float14.setPosition(cam14.x+(left14-960)/2,cam14.y+(top14-540)/2);}
 if(g13.secret.stage>=4&&g13.secret.stage<6){for(const n14 of ['AmbientDebris','RouteBeacon','Sector2Wreck','Sector2Wreck2'])runtimeScene.getObjects(n14).forEach(o=>o.hide());const label14=runtimeScene.getObjects('SecretLabel')[0];if(label14){const p14=g13.secret.route?.[g13.secret.progress||0];label14.setString(p14?'БЕЗОПАСНЫЙ КАРМАН '+((g13.secret.progress||0)+1)+'/6 • '+Math.round(Math.hypot(p14[0]-s.x,p14[1]-s.y))+' м':'ТЕХ-КЭШ →');}}
 const mt14=v.get('MissionType').getAsString(),want14=mt14==='container'?'heavy':mt14==='blackbox'?'data':mt14==='tech'?'energy':null;
 const target14=g13.loot.filter(l=>!l.taken&&(want14?l.kind===want14:mt14==='scrap'?l.kind==='scrap':true)).sort((a,b)=>Math.hypot(a.x-s.x,a.y-s.y)-Math.hypot(b.x-s.x,b.y-s.y))[0];
 const obj14=runtimeScene.getObjects('ObjectiveText')[0],full14=v.get('Cargo').getAsNumber()>=v.get('CargoMax').getAsNumber();
 if(obj14&&g13.secret.stage===0&&target14&&!full14){const dx14=target14.x-s.x,dy14=target14.y-s.y,arrow14=['→','↘','↓','↙','←','↖','↑','↗'][(Math.round(Math.atan2(dy14,dx14)/(Math.PI/4))+8)%8];obj14.setString((want14?'ЦЕЛЬ КОНТРАКТА ':'ДОБЫЧА ')+arrow14+' '+Math.round(Math.hypot(dx14,dy14))+' м\nСобирайте добычу или возвращайтесь');}
 const mission14=runtimeScene.getObjects('MissionText')[0];if(mission14){mission14.setVerticalTextAlignment('center');mission14.setY(106);}
}
if(st==='result'){const reward14=v.get('DeliveredValue').getAsNumber(),bonus14=v.get('ContractRewardEarned').getAsNumber();set('ResultStats','ДОБЫЧА    +'+reward14+'\nВ ТОМ ЧИСЛЕ СЕРИЯ    +'+v.get('StreakBonus').getAsNumber()+'\n\nКОНТРАКТ '+(bonus14?'ВЫПОЛНЕН':'НЕ ВЫПОЛНЕН')+'    +'+bonus14+'\nИТОГО    +'+(reward14+bonus14)+'\nВРЕМЯ    '+Math.floor(v.get('RunTime').getAsNumber()/60)+':'+String(Math.floor(v.get('RunTime').getAsNumber()%60)).padStart(2,'0'));}
if(st==='menu'&&matchMedia('(pointer:coarse)').matches)set('MenuHint','НАЖМИТЕ «НАЧАТЬ ВЫЛЕТ»');
if(st==='fail'||st==='result'){const b14=runtimeScene.getObjects('ResultButtonBg')[0],t14=runtimeScene.getObjects('ResultText')[0];if(b14&&t14){b14.setX(st==='fail'?715:450);t14.setX(b14.getX());t14.setY(b14.getY()+b14.getHeight()/2);}}
const warning14=runtimeScene.getObjects('MeteorTelegraph')[0];if(warning14&&!warning14.isHidden()){warning14.setLayer('HUD');warning14.setPosition(610,302);warning14.setWrappingWidth(700);}
if(st==='play'&&g13.secret.stage>0&&s.floatLife>0)runtimeScene.getObjects('StatusText').forEach(o=>o.hide());
if(st==='play'&&s.dev){const p14=runtimeScene.getObjects('Dev13Panel')[0],t14=runtimeScene.getObjects('Dev13Text')[0];if(p14){p14.setPosition(24,650);p14.setHeight(270);}if(t14){t14.setPosition(48,680);t14.setVerticalTextAlignment('top');t14.setWrappingWidth(520);}}
if(st==='upgrades'){const widget14=runtimeScene.getObjects('TechReadoutBg')[0],text14=runtimeScene.getObjects('TechText')[0];if(widget14){widget14.setPosition(1450,150);widget14.setWidth(300);widget14.setHeight(76);}if(text14){text14.setPosition(1470,188);text14.setWrappingWidth(260);text14.setVerticalTextAlignment('center');}}
if(st==='play'&&g13.secret.stage>=4&&g13.secret.stage<6)runtimeScene.getObjects('NavMarker').forEach(o=>o.hide());
if(st!=='play'||g13.secret.stage<4||g13.secret.stage>=6)runtimeScene.getObjects('SafePocket14').forEach(o=>o.hide());
if(st!=='play')runtimeScene.getObjects('Module14').forEach(o=>o.hide());
if(st==='upgrades'&&runtimeScene.__osAvailable()===0){set('UpgradeNotice','ВСЕ МОДУЛИ УСТАНОВЛЕНЫ • КОРАБЛЬ ПОЛНОСТЬЮ ОСНАЩЁН');for(const n14 of ['UpgradeCardBg','UpgradeCardText','UpgradeButtonBg','UpgradeButtonText'])runtimeScene.getObjects(n14).forEach(o=>o.hide());}
`;
 layout.events[0].inlineCode=[init];layout.events[1].inlineCode=[play];layout.events[2].inlineCode=[ui];
};
