// Bounded adjustments to the existing native GDevelop gameplay blocks.
// Reapplied by update-runtime-feature.js so exports and source use one version.
module.exports = function applySmart08(layout) {
 const cfg=require('./smart08-config');
 let [init,play,ui]=layout.events.map(e=>e.inlineCode.join('\n'));
 const replace=(text,from,to)=>{if(!text.includes(from))throw new Error('Smart08 patch target missing: '+from.slice(0,90));return text.replace(from,to);};
 init=replace(init,'runtimeScene.__osInit=true;',`runtimeScene.__osInit=true;runtimeScene.__osMap=${JSON.stringify(cfg)};`);
 init=replace(init,"active:event.type!=='pointerup'&&event.type!=='pointercancel'", "active:event.type==='pointerdown'||event.type==='pointermove'&&event.buttons>0");
 init=replace(init,'ContractRewardEarned:0','ContractRewardEarned:0,Streak:0,StreakBonus:0,InsurancePaid:0');
 init=replace(init,'runtimeScene.__osSave=()=>{try',"runtimeScene.__osSave=()=>{const installed=(get('CargoMax').getAsNumber()>8?1:0)+(get('HullMax').getAsNumber()>3?1:0)+['EngineLevel','MagnetLevel','RadarLevel','InsuranceLevel'].reduce((n,k)=>n+(get(k).getAsNumber()>0?1:0),0);if(get('ContractsCompleted').getAsNumber()>=4&&installed>=2)get('SectorUnlocked').setNumber(1);try");
 init=replace(init,"const n=(get('RunCount').getAsNumber()-1+6)%6", "const n=get('ContractsCompleted').getAsNumber()%6");
 init=replace(init,'target=s2?6:5','target=6');
 init=replace(init,"name='ВЕРНИТЕСЬ БЕЗ УРОНА';target=1", "name='ВЕРНИТЕСЬ БЕЗ УРОНА';target=4");
 init=replace(init,"name='СКОРОСТНАЯ ДОСТАВКА';target=1", "name='СКОРОСТНАЯ ДОСТАВКА';target=4");
 init=replace(init,'time=s2?60:55','time=s2?105:100');
 init=replace(init,'target=s2?3:2','target=2');
 init=replace(init,"get('ContractRewardEarned').setNumber(0);get('DoubleRewardUsed')", "get('ContractRewardEarned').setNumber(0);get('Streak').setNumber(0);get('StreakBonus').setNumber(0);get('InsurancePaid').setNumber(0);get('DoubleRewardUsed')");
 init=replace(init,"runtimeScene.__osCam={x:480,y:677};runtimeScene.__osMission();", "runtimeScene.__osCam={x:480,y:677};runtimeScene.getObjects('Ship')[0].setCenterPositionInScene(350,700);runtimeScene.__osMission();");
 init=replace(init,'s.x=327;s.y=677;s.vx=0;s.vy=0;s.inv=1.2;', "s.x=470;s.y=700;s.vx=0;s.vy=0;s.inv=2;runtimeScene.__osCam={x:480,y:700};runtimeScene.getObjects('Ship')[0].setCenterPositionInScene(470,700);runtimeScene.__osSave();");
 // Real paid refresh needs no ad; the existing rewarded path is free and explicitly labelled.
 init=replace(init,"else runtimeScene.__osReward('reroll');", "else{get('TechParts').setNumber(get('TechParts').getAsNumber()-1);runtimeScene.__osReroll();}s.toast=3;");
 init=replace(init,"else if(kind==='reroll'){", "else if(kind==='reroll'){runtimeScene.__osReroll();return;");
 init=replace(init,"if(st==='upgrades'&&release){", "if(st==='upgrades'&&release){s.toast=3;\n  if(cx>=680&&cx<=1100&&cy>=720&&cy<=790){runtimeScene.__osReward('reroll');return;}");
 init=replace(init,"get('GameState').setString('play');get('Cargo')", "get('GameState').setString('play');get('Status').setString('');get('Cargo')");
 init=replace(init,"runtimeScene.__osMission=()=>", `runtimeScene.__osReroll=()=>{const pool=['cargo','engine','hull','magnet','radar','insurance'];get('RerollCount').setNumber(get('RerollCount').getAsNumber()+1);const old=[get('Offer1').getAsString(),get('Offer2').getAsString(),get('Offer3').getAsString()].join(',');for(let i=0;i<pool.length;i++){get('OfferSeed').setNumber(get('OfferSeed').getAsNumber()+1);runtimeScene.__osOffers();if([get('Offer1').getAsString(),get('Offer2').getAsString(),get('Offer3').getAsString()].join(',')!==old)break;}get('Status').setString('ПРЕДЛОЖЕНИЯ ОБНОВЛЕНЫ');runtimeScene.__os.toast=3;runtimeScene.__osSave();};\n  runtimeScene.__osMission=()=>`);
 init=replace(init,'runtimeScene.__osReroll=()=>{',"runtimeScene.__osAvailable=()=>6-(get('CargoMax').getAsNumber()>8?1:0)-(get('HullMax').getAsNumber()>3?1:0)-['EngineLevel','MagnetLevel','RadarLevel','InsuranceLevel'].reduce((n,k)=>n+(get(k).getAsNumber()>0?1:0),0);runtimeScene.__osReroll=()=>{");
 init=replace(init,"if(get('TechParts').getAsNumber()<1)get('Status').setString('НУЖНА 1 ТЕХНОДЕТАЛЬ');", "if(runtimeScene.__osAvailable()<=3)get('Status').setString('ВСЕ ДОСТУПНЫЕ МОДУЛИ УЖЕ ПОКАЗАНЫ');else if(get('TechParts').getAsNumber()<1)get('Status').setString('НУЖНА 1 ТЕХНОДЕТАЛЬ');");
 init=replace(init,"{runtimeScene.__osReward('reroll');return;}","{if(runtimeScene.__osAvailable()<=3)get('Status').setString('ВСЕ ДОСТУПНЫЕ МОДУЛИ УЖЕ ПОКАЗАНЫ');else runtimeScene.__osReward('reroll');return;}");
 init=replace(init,"if(cx>=735&&cx<=1185&&cy>=895&&cy<=970)reset();", "if(cx>=735&&cx<=1185&&cy>=895&&cy<=970){if(get('SectorUnlocked').getAsNumber()>=1)get('GameState').setString('sectorSelect');else reset();}");
 const costs='cargo:100,engine:120,hull:150,magnet:80,radar:90,insurance:120';
 const newCosts=Object.entries(cfg.prices).map(([k,v])=>k+':'+v).join(',');
 init=replace(init,costs,newCosts);ui=ui.split(costs).join(newCosts);
 init=replace(init,"if(st==='menu'&&", "const hit08=(n,i=0)=>{const o=runtimeScene.getObjects(n)[i];return o&&!o.isHidden()&&cx>=o.getX()&&cx<=o.getX()+o.getWidth()&&cy>=o.getY()&&cy<=o.getY()+o.getHeight();};\nif(st==='menu'&&");
 init=replace(init,"release&&cx>=700&&cx<=1220&&cy>=630&&cy<=780", "release&&hit08('ButtonBg')");
 init=replace(init,"if(st==='result'&&release){if(cy>=430&&cy<=525&&cx>=740&&cx<=1180)runtimeScene.__osReward('double');else if(cy>=525&&cy<=630){if(cx<960)get('GameState').setString('upgrades');else if(get('SectorUnlocked').getAsNumber()>=1)get('GameState').setString('sectorSelect');else reset();}}", "if(st==='result'&&release){if(hit08('RewardButtonBg'))runtimeScene.__osReward('double');else if(hit08('ResultButtonBg',0))get('GameState').setString('upgrades');else if(hit08('ResultButtonBg',1)){if(get('SectorUnlocked').getAsNumber()>=1)get('GameState').setString('sectorSelect');else reset();}}");
 init=replace(init,"if(st==='fail'&&release){if(cy>=400&&cy<=490&&cx>=740&&cx<=1180)runtimeScene.__osReward('second');else if(cy>=490&&cy<=600)reset();}","if(st==='fail'&&release){if(hit08('RewardButtonBg'))runtimeScene.__osReward('second');else if(hit08('ResultButtonBg',0))reset();}");
 init=replace(init,"cx>=735&&cx<=1185&&cy>=895&&cy<=970", "hit08('UpgradeBackButtonBg')");
 init=replace(init,"cx>=680&&cx<=1100&&cy>=610&&cy<=710", "hit08('RerollButtonBg')");
 init=replace(init,"cx>=1140&&cx<=1560&&cy>=610&&cy<=710", "hit08('ResetButtonBg')");
 init=replace(init,"(cx>=175&&cx<=625||cx>=735&&cx<=1285||cx>=1295&&cx<=1845)&&cy>=415&&cy<=500", "runtimeScene.getObjects('UpgradeButtonBg').some((_,i)=>hit08('UpgradeButtonBg',i))");
 init=replace(init,"const idx=cx<700?0:cx<1290?1:2", "const idx=runtimeScene.getObjects('UpgradeButtonBg').findIndex((_,i)=>hit08('UpgradeButtonBg',i))");
 // The card price comes from the same table as the purchase, no duplicated economy literals.
 ui=replace(ui,"if(cards[i])cards[i].setString(a.join('\\n'));", "if(info[id])a[a.length-1]=runtimeScene.__osMap.prices[id]+' КРЕДИТОВ';if(cards[i])cards[i].setString(a.join('\\n'));");
 play=replace(play,"const actor=runtimeScene.getObjects('Ship')[0];", "const actor=runtimeScene.getObjects('Ship')[0];actor.getBehavior('Движение').ignoreDefaultControls(true);");
 play=replace(play,"(im.isKeyPressed(65)?-1:0)+(im.isKeyPressed(68)?1:0),ay=(im.isKeyPressed(87)?-1:0)+(im.isKeyPressed(83)?1:0)","(im.isKeyPressed(65)||im.isKeyPressed(37)?-1:0)+(im.isKeyPressed(68)||im.isKeyPressed(39)?1:0),ay=(im.isKeyPressed(87)||im.isKeyPressed(38)?-1:0)+(im.isKeyPressed(83)||im.isKeyPressed(40)?1:0)");
 play=replace(play,'Math.min(2130,s.x+s.vx*dt)','Math.min(6130,s.x+s.vx*dt)');
 play=replace(play,'Math.min(1330,s.y+s.vy*dt)','Math.min(2930,s.y+s.vy*dt)');
 play=replace(play,'Math.min(1720,tx)','Math.min(5720,tx)');play=replace(play,'Math.min(1130,ty)','Math.min(2730,ty)');
 play=replace(play,'const dangerRadius=sector===2?310:260,dangerCenterX=sector===2?1550:1540,dangerCenterY=300', 'const dangerRadius=runtimeScene.__osMap.danger.radius,dangerCenterX=runtimeScene.__osMap.danger.x,dangerCenterY=runtimeScene.__osMap.danger.y');
 play=play.replace(/pos=sector===2\?\[\[.*?\]\]:\[\[.*?\]\],scrapValue=/,'pos=sector===2?runtimeScene.__osMap.scrap2:runtimeScene.__osMap.scrap,scrapValue=');
 play=play.replace(/rarePos=sector===2\?\[\[.*?\]\]:\[\[.*?\]\],valuable=/,'rarePos=sector===2?runtimeScene.__osMap.rare2:runtimeScene.__osMap.rare,valuable=');
 play=replace(play,'if(sector===1&&!valuable&&i>0)', 'if(sector===1&&i>(valuable?1:0))');
 play=replace(play,'o.setScale(i%3===0?.72:i%3===1?.86:.62);', 'o.setWidth(30+(i%3)*3);o.setHeight(26+(i%3)*3);o.setCenterPositionInScene(pos[i][0],pos[i][1]);');
 play=replace(play,'o.setAngle(Math.sin(s.phase+i)*4);','o.setWidth(48);o.setHeight(42);o.setCenterPositionInScene(rp[0],rp[1]);o.setAngle(Math.sin(s.phase+i)*4);');
 play=replace(play,'if(glows[i]){glows[i].hide(false);', 'if(glows[i]){glows[i].setWidth(76);glows[i].setHeight(76);glows[i].hide(false);');
 // Danger progress is based on the item's authored position, not the edge of the magnet radius.
 play=replace(play,"==='danger'&&isDanger(s.x,s.y)","==='danger'&&isDanger(pos[i][0],pos[i][1])");
 play=play.replace(/bases=\[\[.*?\]\],haz=/,'bases=runtimeScene.__osMap.hazard,haz=');
 play=replace(play,'fast=i>=4','fast=o.getName()===\'FastDebris\'');
 play=replace(play,'const b=bases[i%bases.length],', "if(sector===1&&i>=8){o.hide();return;}o.hide(false);const b=bases[i%bases.length],");
 play=replace(play,'o.setAnimationFrame(i%4);o.setScale(fast?(.72+(i%2)*.14):(.7+(i%3)*.18));','o.setAnimationFrame(fast?i%2:1+i%4);const size=fast?32:(i===3?64:34+(i%3)*9);o.setWidth(size);o.setHeight(size);o.setCenterPositionInScene(xx,yy);');
 // Only the second sector is radioactive; training hazards still cause real collision damage.
 play=replace(play,'if(isDanger(s.x,s.y)){','if(sector===2&&isDanger(s.x,s.y)){');
 play=replace(play,"if(mt==='nodamage'&&v.get('RunDamage').getAsNumber()===0)","if(mt==='nodamage'&&v.get('RunDamage').getAsNumber()===0&&v.get('Cargo').getAsNumber()>=target)");
 play=replace(play,"if(mt==='speed'&&v.get('RunTime').getAsNumber()<=v.get('MissionTimeLimit').getAsNumber())", "if(mt==='speed'&&v.get('RunTime').getAsNumber()<=v.get('MissionTimeLimit').getAsNumber()&&v.get('Cargo').getAsNumber()>=target&&v.get('ContainerCount').getAsNumber()>=1)");
 play=replace(play,"if(v.get('ContractsCompleted').getAsNumber()>=3)","if(v.get('ContractsCompleted').getAsNumber()>=4&&((v.get('CargoMax').getAsNumber()>8?1:0)+(v.get('HullMax').getAsNumber()>3?1:0)+['EngineLevel','MagnetLevel','RadarLevel','InsuranceLevel'].reduce((n,k)=>n+(v.get(k).getAsNumber()>0?1:0),0))>=2)");
 // One small new feature: a collision-free collection series. Bonus is at risk until docking.
 play=replace(play,'const scraps=runtimeScene', `const pickup=(value,label)=>{const n=v.get('Streak').getAsNumber()+1;v.get('Streak').setNumber(n);const bonus=n===3?5:n===5?10:0;if(bonus){v.get('CargoValue').setNumber(v.get('CargoValue').getAsNumber()+bonus);v.get('StreakBonus').setNumber(v.get('StreakBonus').getAsNumber()+bonus);}const series=n===2?'СЕРИЯ x2':bonus?'СЕРИЯ x'+n+'\\nБОНУС +'+bonus:'';s.floatText=series||'+'+value;s.floatLife=1.05;s.toast=1.05;v.get('Status').setString(series?'':label);};\nconst scraps=runtimeScene`);
 ui=replace(ui,"v.get('OnboardingSeen').getAsNumber()<1&&v.get('RunCount').getAsNumber()<=1&&v.get('RunTime').getAsNumber()<9", "v.get('OnboardingSeen').getAsNumber()<1&&v.get('RunCount').getAsNumber()<=1&&v.get('Cargo').getAsNumber()<1&&v.get('RunTime').getAsNumber()<18");
 play=replace(play,"v.get('Status').setString('+'+scrapValue+' МЕТАЛЛОЛОМ');", "pickup(scrapValue,'+'+scrapValue+' МЕТАЛЛОЛОМ');");
 play=replace(play,"v.get('Status').setString('+'+(sector===2?60:40)+' КОНТЕЙНЕР');", "pickup(sector===2?60:40,'КОНТЕЙНЕР +'+(sector===2?60:40));");
 play=play.split("v.get('RunDamage').setNumber(v.get('RunDamage').getAsNumber()+1);").join("v.get('RunDamage').setNumber(v.get('RunDamage').getAsNumber()+1);v.get('Streak').setNumber(0);s.floatText='−1 КОРПУС';s.floatLife=1.1;s.toast=1.1;v.get('Status').setString('−1 КОРПУС');");
 play=replace(play,"if(v.get('Hull').getAsNumber()<=0){if(v.get('InsuranceLevel')", "if(v.get('Hull').getAsNumber()<=0){if(v.get('InsuranceLevel')");
 const insuranceStart="if(v.get('Hull').getAsNumber()<=0){if(v.get('InsuranceLevel').getAsNumber()>=1&&v.get('CargoValue').getAsNumber()>0){v.get('Credits').setNumber(v.get('Credits').getAsNumber()+Math.floor(v.get('CargoValue').getAsNumber()*.25));v.get('Status').setString('СТРАХОВКА СОХРАНИЛА ЧАСТЬ ДОБЫЧИ');}v.get('GameState').setString('fail');}";
 play=replace(play,insuranceStart,"if(v.get('Hull').getAsNumber()<=0)fail();");
 play=replace(play,"if(v.get('Hull').getAsNumber()<=0)v.get('GameState').setString('fail');","if(v.get('Hull').getAsNumber()<=0)fail();");
 play=replace(play,'const dt=Math.min', "const fail=()=>{if(v.get('GameState').getAsString()==='fail')return;if(v.get('InsuranceLevel').getAsNumber()>=1&&v.get('InsurancePaid').getAsNumber()===0){const paid=Math.floor(v.get('CargoValue').getAsNumber()*.25);v.get('Credits').setNumber(v.get('Credits').getAsNumber()+paid);v.get('InsurancePaid').setNumber(paid);v.get('CargoValue').setNumber(v.get('CargoValue').getAsNumber()-paid);}v.get('GameState').setString('fail');runtimeScene.__osSave();};\nconst dt=Math.min");
 play+='\nconst floating=runtimeScene.getObjects("PickupText")[0];s.floatLife=Math.max(0,(s.floatLife||0)-dt);if(floating){floating.hide(s.floatLife<=0);if(s.floatLife>0){floating.setString(s.floatText||"");floating.setPosition(s.x-110,s.y-60-(1.05-s.floatLife)*20);floating.setOpacity(Math.min(255,s.floatLife*350));}}';
 // Native text uses a vertical anchor, not the instance rectangle's center.
 ui=replace(ui,"missionTarget:v.get('MissionTarget').getAsNumber(),offers:","missionTarget:v.get('MissionTarget').getAsNumber(),runTime:v.get('RunTime').getAsNumber(),cargoValue:v.get('CargoValue').getAsNumber(),streak:v.get('Streak').getAsNumber(),streakBonus:v.get('StreakBonus').getAsNumber(),sectorUnlocked:v.get('SectorUnlocked').getAsNumber(),damage:v.get('RunDamage').getAsNumber(),cameraX:runtimeScene.__osCam.x,cameraY:runtimeScene.__osCam.y,offers:");
 ui=replace(ui,"?'КОРПУС: ЦЕЛ':'ПОВРЕЖДЁН'", "?'БЕЗ УРОНА • ГРУЗ '+c+'/'+mt:'ПОВРЕЖДЁН'");
 ui=replace(ui,"'ДО '+limit+' СЕК'", "'ГРУЗ '+c+'/'+mt+' • '+Math.max(0,Math.ceil(limit-v.get('RunTime').getAsNumber()))+' СЕК'");
 ui=replace(ui,"set('ObjectiveText',c>=m?", "set('ObjectiveText',c>=m?");
 ui=replace(ui,"c>0?'ВЕРНИТЕСЬ НА СТАНЦИЮ':'НАЙДИТЕ ЛОМ'", "(mp>=mt||type==='nodamage'&&c>=mt||type==='speed'&&c>=mt&&v.get('ContainerCount').getAsNumber()>0)?'КОНТРАКТ СОБРАН • ВЕРНИТЕСЬ НА СТАНЦИЮ':type==='speed'?'ДОСТАВЬТЕ КОНТЕЙНЕР И 2 КУСКА ЛОМА':type==='nodamage'?'СОБЕРИТЕ 4 ЕД. ГРУЗА БЕЗ УРОНА':'СОБИРАЙТЕ ДОБЫЧУ • СЛЕДУЙТЕ МАЯКАМ'");
 ui=replace(ui,"nav.setString('◀ СТАНЦИЯ  '+Math.round(dist)+' м');", "const a=Math.atan2(700-s.y,260-s.x),arrows=['→','↘','↓','↙','←','↖','↑','↗'],arrow=arrows[(Math.round(a/(Math.PI/4))+8)%8];nav.setString('СТАНЦИЯ '+arrow+' '+Math.round(dist)+' м'+(v.get('RadarLevel').getAsNumber()>0?' • ~'+Math.ceil(dist/190)+' СЕК ДО БАЗЫ':''));");
 ui=replace(ui,"typeof window!=='undefined'&&window.innerWidth<window.innerHeight?", "typeof window!=='undefined'&&matchMedia('(pointer:coarse)').matches?");
 ui=replace(ui,"'\\nКОНТРАКТ  '","'\\nСЕРИЯ    +'+v.get('StreakBonus').getAsNumber()+'\\nКОНТРАКТ  '");
 ui=replace(ui,"'\\nИТОГО    +'", "(v.get('InsurancePaid').getAsNumber()>0?'\\nСТРАХОВКА УЖЕ ВЫПЛАЧЕНА −'+v.get('InsurancePaid').getAsNumber():'')+'\\nИТОГО    +'");
 ui=replace(ui,"'НЕДОСТАВЛЕННЫЙ ГРУЗ ПОТЕРЯН\\nКРЕДИТЫ НЕ ПОТЕРЯНЫ'", "'НЕДОСТАВЛЕННЫЙ ГРУЗ ПОТЕРЯН\\nКРЕДИТЫ НЕ ПОТЕРЯНЫ'+(v.get('InsurancePaid').getAsNumber()>0?'\\nСТРАХОВКА +'+v.get('InsurancePaid').getAsNumber():'')");
 ui=replace(ui,"'▶ x2 НАГРАДА\\nЗА РЕКЛАМУ'", "'▶ x2 ДОБЫЧА\\nЗА РЕКЛАМУ'");
 ui=replace(ui,"'ДАЛЬНИЙ МАРКЕР СТАНЦИИ'", "'ВРЕМЯ ДО БАЗЫ / ЦЕННОСТЬ ЦЕЛИ'");
 ui=replace(ui,"bgs[i].setOpacity(done?105:over?(pressed?190:255):220)","bgs[i].setOpacity(id==='done'||done?95:v.get('Credits').getAsNumber()<cost?(over?155:115):over?(pressed?170:255):220)");
 ui=replace(ui,"'Выберите маршрут вылета'", "v.get('SectorUnlocked').getAsNumber()>=1?'ДОСТУП В ПОЯС ОБЛОМКОВ ОТКРЫТ':'НУЖНО: 4 КОНТРАКТА И 2 МОДУЛЯ'");
 ui=replace(ui,"v.get('TechParts').getAsNumber()>0?'ОБНОВИТЬ ПРЕДЛОЖЕНИЯ\\n🔧 1':'НУЖНА 1 ДЕТАЛЬ'", "'ОБНОВИТЬ ПРЕДЛОЖЕНИЯ\\nДЕТАЛЬ 1'");
 // World decorations follow visibility state without interfering with pickup or collision groups.
 ui+=String.raw`
const pairs=[['PlayText','ButtonBg'],['ResultText','ResultButtonBg'],['RewardButtonText','RewardButtonBg'],['UpgradeButtonText','UpgradeButtonBg'],['UpgradeBackText','UpgradeBackButtonBg'],['RerollButtonText','RerollButtonBg'],['ResetButtonText','ResetButtonBg'],['SectorSelectButtonText','SectorSelectButtonBg'],['SectorSelectBackText','SectorSelectBackBg'],['ResetConfirmCancelText','ResetConfirmCancelBg'],['ResetConfirmOkText','ResetConfirmOkBg']];
for(const [tn,bn] of pairs){const labels=runtimeScene.getObjects(tn),buttons=runtimeScene.getObjects(bn);labels.forEach((t,i)=>{const b=buttons[i];if(!b)return;t.setVerticalTextAlignment('center');t.setX(b.getX());t.setY(b.getY()+b.getHeight()/2);t.setWrappingWidth(b.getWidth());if(['ButtonBg','ResultButtonBg','UpgradeBackButtonBg','ResetConfirmCancelBg','ResetConfirmOkBg'].includes(bn)){const over=mx>=b.getX()&&mx<=b.getX()+b.getWidth()&&my>=b.getY()&&my<=b.getY()+b.getHeight();b.setOpacity(over?(pressed?165:255):220);}});}
const f=runtimeScene.getObjects('PickupText')[0];if(f&&st!=='play')f.hide();
const aura08=runtimeScene.getObjects('MagnetAura')[0];if(aura08){aura08.hide(st!=='play'||v.get('MagnetLevel').getAsNumber()<1);aura08.setCenterPositionInScene(s.x,s.y);aura08.setOpacity(60+Math.sin(s.phase*3)*12);}
if(!runtimeScene.__osWorldTextHD){runtimeScene.__osWorldTextHD=true;for(const name of ['StationLabel','RouteLabel','PickupText','FieldLabel','DangerLabel','RiskLabel'])for(const t of runtimeScene.getObjects(name)){const rendered=t.getRendererObject();if(rendered){rendered.resolution=2*(window.devicePixelRatio||1);rendered.dirty=true;}}}
 for(const n of ['RouteBeacon','RouteLabel','AmbientDebris'])for(const [i,o] of runtimeScene.getObjects(n).entries()){o.hide(st!=='play');if(st==='play'&&n==='AmbientDebris'){o.setOpacity(sector===2?125:85);o.setAnimationFrame(i%6);}if(n==='RouteLabel')o.setString(o.getVariables().get('Caption').getAsString());}
 if(st!=='play')runtimeScene.getObjects('ScrapGlow').forEach(o=>o.hide());
 const sky08=runtimeScene.getObjects('Background')[0];if(sky08&&st==='play')sky08.setPosition(-120-runtimeScene.__osCam.x*.01,-60-runtimeScene.__osCam.y*.008);
const rb08=runtimeScene.getObjects('SystemButtonBg')[0],rt08=runtimeScene.getObjects('SystemButtonText')[0];if(rb08&&rt08){rb08.hide(st!=='upgrades');rt08.hide(st!=='upgrades');if(st==='upgrades'){rb08.setPosition(680,720);rb08.setWidth(420);rb08.setHeight(70);rt08.setPosition(680,755);rt08.setWrappingWidth(420);rt08.setVerticalTextAlignment('center');rt08.setString('▶ ОБНОВИТЬ БЕСПЛАТНО\nЗА РЕКЛАМУ');rb08.setOpacity(mx>=680&&mx<=1100&&my>=720&&my<=790?(pressed?170:255):200);}}
const notice08=runtimeScene.getObjects('UpgradeNotice')[0];if(st==='upgrades'&&notice08&&s.toast<=0)notice08.setString('ДОСТУП К СЕКТОРУ 2: '+v.get('ContractsCompleted').getAsNumber()+'/4 КОНТРАКТА • НУЖНЫ 2 МОДУЛЯ');
const dz08=runtimeScene.getObjects('DangerZone')[0];if(dz08)dz08.setOpacity(sector===2?95:45);
runtimeScene.getObjects('RiskLabel').forEach(o=>o.hide());runtimeScene.getObjects('DangerLabel').forEach(o=>o.setString(sector===2?'РАДИАЦИЯ\nКОНТЕЙНЕРЫ +60':'ДАЛЬНИЙ КАРМАН'));
const nav08=runtimeScene.getObjects('NavMarker')[0];if(nav08)nav08.setY(167);
 const labels08=['StationLabel','RouteLabel','RiskLabel','DangerLabel'];for(const n of labels08)for(const o of runtimeScene.getObjects(n)){if(st!=='play'){o.hide();continue;}const screenY=(o.getY()-runtimeScene.__osCam.y)*2+540;if(screenY<230||screenY>920)o.hide();}
const worldSafe08=(o)=>{const left=(o.getX()-runtimeScene.__osCam.x)*2+960,right=left+o.getWidth()*2,top=(o.getY()-runtimeScene.__osCam.y)*2+540,bottom=top+o.getHeight()*2;if(left<40||right>1880||top<230||bottom>920)o.hide();};for(const n of ['StationLabel','RouteLabel','FieldLabel','DangerLabel','RiskLabel'])for(const o of runtimeScene.getObjects(n))if(!o.isHidden())worldSafe08(o);
const floatingSafe08=runtimeScene.getObjects('PickupText')[0];if(floatingSafe08&&!floatingSafe08.isHidden()){const left=(floatingSafe08.getX()-runtimeScene.__osCam.x)*2+960,right=left+floatingSafe08.getWidth()*2;if(left<40)floatingSafe08.setX(runtimeScene.__osCam.x-460);else if(right>1880)floatingSafe08.setX(runtimeScene.__osCam.x+460-floatingSafe08.getWidth());}
if(st!=='play')s.cargoFullAt=0;else if(v.get('Cargo').getAsNumber()>=v.get('CargoMax').getAsNumber()){if(!s.cargoFullAt)s.cargoFullAt=v.get('RunTime').getAsNumber();const fullAge=v.get('RunTime').getAsNumber()-s.cargoFullAt,objFull=runtimeScene.getObjects('ObjectiveText')[0];if(objFull)objFull.setString(fullAge<1.6?['ТРЮМ ЗАПОЛНЕН','ВОЗВРАЩАЙТЕСЬ НА СТАНЦИЮ'].join(String.fromCharCode(10)):'ВЕРНИТЕСЬ НА СТАНЦИЮ');}else s.cargoFullAt=0;
if(st==='play'){
 const type08=v.get('MissionType').getAsString(),wantRare=type08==='container'||type08==='valuable'||type08==='speed'&&v.get('ContainerCount').getAsNumber()<1;
 const complete08=v.get('MissionProgress').getAsNumber()>=v.get('MissionTarget').getAsNumber()||type08==='nodamage'&&v.get('Cargo').getAsNumber()>=4||type08==='speed'&&v.get('Cargo').getAsNumber()>=4&&v.get('ContainerCount').getAsNumber()>=1;
 const targets=runtimeScene.getObjects(wantRare?'RareContainer':'CommonSalvage').filter(o=>!o.getVariables().get('Taken').getAsBoolean()&&!o.isHidden()&&(type08!=='danger'||Math.hypot(o.getCenterXInScene()-runtimeScene.__osMap.danger.x,o.getCenterYInScene()-600)<320));
 const closest=targets.sort((a,b)=>Math.hypot(a.getCenterXInScene()-s.x,a.getCenterYInScene()-s.y)-Math.hypot(b.getCenterXInScene()-s.x,b.getCenterYInScene()-s.y))[0];
 const objective08=runtimeScene.getObjects('ObjectiveText')[0];
 if(closest&&!complete08&&v.get('Cargo').getAsNumber()<v.get('CargoMax').getAsNumber()&&objective08){const dx=closest.getCenterXInScene()-s.x,dy=closest.getCenterYInScene()-s.y,arrow=['→','↘','↓','↙','←','↖','↑','↗'][(Math.round(Math.atan2(dy,dx)/(Math.PI/4))+8)%8];objective08.setString((wantRare?'КОНТЕЙНЕР ':'ЛОМ ')+arrow+' '+Math.round(Math.hypot(dx,dy))+' м'+(v.get('RadarLevel').getAsNumber()>0?' • ЦЕННОСТЬ '+(wantRare?(sector===2?60:40):(sector===2?15:10)):'')+'\n'+(type08==='speed'?'НУЖНЫ КОНТЕЙНЕР И 2 КУСКА ЛОМА':type08==='danger'?'ЦЕЛЬ В ОПАСНОМ КАРМАНЕ':'СОБИРАЙТЕ ИЛИ ВОЗВРАЩАЙТЕСЬ'));}
}
`;
 layout.events[0].inlineCode=[init];layout.events[1].inlineCode=[play];layout.events[2].inlineCode=[ui];
};
