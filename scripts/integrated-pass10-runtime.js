// A bounded production pass layered over the existing native GDevelop runtime.
module.exports=function applyIntegratedPass10(layout){
 let [init,play,ui]=layout.events.map(event=>event.inlineCode.join('\n'));
 const need=(text,from,to)=>{if(!text.includes(from))throw new Error('Pass10 patch target missing: '+from.slice(0,90));return text.replace(from,to);};
 if(init.includes('__pass10Init'))return;

 init=init.replace(/cost=\{[^}]+\}\[id\]\|\|999/, 'cost=runtimeScene.__osMap.prices[id]||999');
 init=need(init,"if(id==='insurance')get('InsuranceLevel').setNumber(1);", "if(id==='insurance')get('InsuranceLevel').setNumber(1);if(id==='shield')get('ShieldLevel').setNumber(1);if(id==='assist')get('AssistLevel').setNumber(1);if(id==='contract')get('ContractLevel').setNumber(1);");
 init=need(init,":get('InsuranceLevel').getAsNumber()>=1,cr=", ":id==='insurance'?get('InsuranceLevel').getAsNumber()>=1:runtimeScene.__osModuleDone(id),cr=");
 init=need(init,"get('InsuranceLevel').setNumber(0);get('SpentCredits')", "get('InsuranceLevel').setNumber(0);get('ShieldLevel').setNumber(0);get('AssistLevel').setNumber(0);get('ContractLevel').setNumber(0);get('SpentCredits')");
 init=init.replace(/const installed=get\('CargoMax'\)[\s\S]*?get\('InsuranceLevel'\)\.getAsNumber\(\)>=1;/, 'const installed=runtimeScene.__osInstalledCount()>0;');
 init=need(init,"if(cx>=680&&cx<=1100&&cy>=720&&cy<=790){if(runtimeScene.__osAvailable()<=3)", "if(hit08('SystemButtonBg')){if(runtimeScene.__osAvailable()<=3)");

 init+=String.raw`
if(!runtimeScene.__pass10Init){
 runtimeScene.__pass10Init=true;
 const moduleIds10=['cargo','engine','hull','magnet','radar','insurance','shield','assist','contract'];
 const levelKey10={cargo:'CargoMax',engine:'EngineLevel',hull:'HullMax',magnet:'MagnetLevel',radar:'RadarLevel',insurance:'InsuranceLevel',shield:'ShieldLevel',assist:'AssistLevel',contract:'ContractLevel'};
 const originalSave10=runtimeScene.__osSave;
 try{const saved10=typeof localStorage!=='undefined'?JSON.parse(localStorage.getItem('orbitalSalvageSave')||'{}'):{};for(const key of ['ShieldLevel','AssistLevel','ContractLevel'])if(Number.isFinite(Number(saved10[key])))get(key).setNumber(Number(saved10[key]));}catch(e){console.warn('Не удалось загрузить дополнительные модули',e);}
 runtimeScene.__osModuleDone=(id)=>id==='cargo'?get('CargoMax').getAsNumber()>=10:id==='hull'?get('HullMax').getAsNumber()>=4:(levelKey10[id]?get(levelKey10[id]).getAsNumber()>=1:false);
 runtimeScene.__osInstalledCount=()=>moduleIds10.reduce((count,id)=>count+(runtimeScene.__osModuleDone(id)?1:0),0);
 runtimeScene.__osSave=()=>{originalSave10();try{if(typeof localStorage!=='undefined'){const raw10=localStorage.getItem('orbitalSalvageSave')||'{}',saved10=JSON.parse(raw10);for(const key of ['ShieldLevel','AssistLevel','ContractLevel'])saved10[key]=get(key).getAsNumber();localStorage.setItem('orbitalSalvageSave',JSON.stringify(saved10));}}catch(e){console.warn('Не удалось сохранить дополнительные модули',e);}};
 runtimeScene.__osOffers=()=>{const pool=moduleIds10.filter(id=>!runtimeScene.__osModuleDone(id)),chosen=[];for(let i=0;i<3;i++)chosen.push(i<pool.length?pool[(get('OfferSeed').getAsNumber()+i)%pool.length]:'done');['Offer1','Offer2','Offer3'].forEach((name,index)=>get(name).setString(chosen[index]));get('OffersReady').setNumber(1);};
 runtimeScene.__osAvailable=()=>moduleIds10.filter(id=>!runtimeScene.__osModuleDone(id)).length;
 runtimeScene.__osReroll=()=>{const before=[get('Offer1').getAsString(),get('Offer2').getAsString(),get('Offer3').getAsString()].join(',');for(let i=0;i<moduleIds10.length;i++){get('OfferSeed').setNumber(get('OfferSeed').getAsNumber()+1);runtimeScene.__osOffers();if([get('Offer1').getAsString(),get('Offer2').getAsString(),get('Offer3').getAsString()].join(',')!==before)break;}get('RerollCount').setNumber(get('RerollCount').getAsNumber()+1);get('Status').setString('ПРЕДЛОЖЕНИЯ ОБНОВЛЕНЫ');runtimeScene.__os.toast=2.4;runtimeScene.__osSave();};
 runtimeScene.__osMission=()=>{const n=get('ContractsCompleted').getAsNumber()%8,sector=get('CurrentSector').getAsNumber(),s2=sector===2;let type='scrap',name='СБОР ЛОМА',target=6,reward=s2?65:45,tech=0,time=0,zone=0;
  if(n===1){type='container';name='РЕДКИЙ КОНТЕЙНЕР';target=1;reward=s2?100:72;}
  else if(n===2){type='valuable';name='ЦЕННЫЙ ГРУЗ';target=2;reward=s2?145:112;tech=1;}
  else if(n===3){type='nodamage';name='БЕЗ УРОНА';target=4;reward=s2?92:62;}
  else if(n===4){type='speed';name='СРОЧНАЯ ДОСТАВКА';target=4;reward=s2?118:88;time=s2?105:100;}
  else if(n===5){type='danger';name='ОПАСНЫЙ СБОР';target=2;reward=s2?135:105;tech=1;zone=target;}
  else if(n===6){type='cluster';name='ЛОМОВОЙ УЗЕЛ';target=5;reward=s2?95:66;}
  else if(n===7){type='deep';name='ДАЛЬНИЙ РЕЙС';target=4;reward=s2?130:92;tech=1;}
  get('Mission').setString(name);get('MissionType').setString(type);get('MissionTarget').setNumber(target);get('MissionReward').setNumber(reward);get('MissionTechReward').setNumber(tech);get('MissionTimeLimit').setNumber(time);get('MissionZoneTarget').setNumber(zone);get('MissionProgress').setNumber(0);get('MissionBonusClaimed').setNumber(0);
 };
 get('OffersReady').setNumber(0);runtimeScene.__osOffers();
}
const devAllowed10=typeof location!=='undefined'&&(location.hostname==='localhost'||location.hostname==='127.0.0.1'||location.search.includes('dev=1'));
const devInput10=runtimeScene.getGame().getInputManager(),devState10=runtimeScene.__os;
if(devAllowed10&&typeof window!=='undefined'&&!runtimeScene.__pass10InputHook){runtimeScene.__pass10InputHook=true;window.addEventListener('keydown',event10=>{runtimeScene.__pass10DevKey=event10.code;});if(location.search.includes('devhud'))devState10.dev=true;}
if(get('ContractsCompleted').getAsNumber()>=4&&runtimeScene.__osInstalledCount()>=2)get('SectorUnlocked').setNumber(1);
`;

 play+=String.raw`
const cargo10=v.get('Cargo').getAsNumber(),scraps10=v.get('ScrapCount').getAsNumber(),damage10=v.get('RunDamage').getAsNumber();
if(s.pass10Scraps===undefined){s.pass10Scraps=scraps10;s.pass10Damage=damage10;}
else{
 const picked10=Math.max(0,scraps10-s.pass10Scraps),type10=v.get('MissionType').getAsString();
 if(picked10>0){if(type10==='cluster'||type10==='deep'&&s.x>3300)v.get('MissionProgress').setNumber(Math.min(v.get('MissionTarget').getAsNumber(),v.get('MissionProgress').getAsNumber()+picked10));if(v.get('AssistLevel').getAsNumber()>=1){const assist10=picked10*3;v.get('CargoValue').setNumber(v.get('CargoValue').getAsNumber()+assist10);v.get('Status').setString('АВТОСБОР +'+assist10);s.toast=.8;}}
 if(damage10>s.pass10Damage&&v.get('ShieldLevel').getAsNumber()>=1&&!s.shieldUsed10){v.get('Hull').setNumber(Math.min(v.get('HullMax').getAsNumber(),v.get('Hull').getAsNumber()+1));v.get('RunDamage').setNumber(Math.max(0,v.get('RunDamage').getAsNumber()-1));s.shieldUsed10=true;s.floatText='ЩИТ ПОГЛОТИЛ УДАР';s.floatLife=1.05;s.flash=.25;v.get('Status').setString('ЩИТ ПОГЛОТИЛ УДАР');s.toast=1.2;}
 s.pass10Scraps=v.get('ScrapCount').getAsNumber();s.pass10Damage=v.get('RunDamage').getAsNumber();
}
if(v.get('GameState').getAsString()==='result'&&!s.pass10ContractBoosted&&v.get('ContractLevel').getAsNumber()>=1&&v.get('ContractRewardEarned').getAsNumber()>0){const extra10=Math.floor(v.get('ContractRewardEarned').getAsNumber()*.2);v.get('Credits').setNumber(v.get('Credits').getAsNumber()+extra10);v.get('ContractRewardEarned').setNumber(v.get('ContractRewardEarned').getAsNumber()+extra10);s.pass10ContractBoosted=true;v.get('Status').setString('УСИЛИТЕЛЬ КОНТРАКТА +'+extra10);}
`;

 ui+=String.raw`
const set10=(name,text)=>{const object10=runtimeScene.getObjects(name)[0];if(object10)object10.setString(text);};
const devAllowedUi10=typeof location!=='undefined'&&(location.hostname==='localhost'||location.hostname==='127.0.0.1'||location.search.includes('dev=1'));
const devInputUi10=runtimeScene.getGame().getInputManager();
const devKeyUi10=runtimeScene.__pass10DevKey||'';runtimeScene.__pass10DevKey='';
if(devAllowedUi10&&(devKeyUi10==='F3'||devInputUi10.wasKeyJustPressed(114))){s.dev=!s.dev;v.get('Status').setString(s.dev?'DEV HUD ВКЛ':'DEV HUD ВЫКЛ');s.toast=1.2;}
if(devAllowedUi10&&(devKeyUi10==='F4'||devInputUi10.wasKeyJustPressed(115))){v.get('Credits').setNumber(v.get('Credits').getAsNumber()+250);v.get('TechParts').setNumber(v.get('TechParts').getAsNumber()+1);v.get('Status').setString('+250 КРЕДИТОВ • +1 ТЕХНОДЕТАЛЬ');s.toast=2;runtimeScene.__osSave();}
if(devAllowedUi10&&(devKeyUi10==='F8'||devInputUi10.wasKeyJustPressed(119))){v.get('CurrentSector').setNumber(2);v.get('SectorUnlocked').setNumber(1);v.get('GameState').setString('sectorSelect');runtimeScene.__osSave();}
if(devAllowedUi10&&(devKeyUi10==='F6'||devInputUi10.wasKeyJustPressed(117))){v.get('ContractsCompleted').setNumber(v.get('ContractsCompleted').getAsNumber()+1);runtimeScene.__osMission();v.get('Status').setString('СЛЕДУЮЩИЙ КОНТРАКТ');s.toast=1.5;}
if(devAllowedUi10&&(devKeyUi10==='F7'||devInputUi10.wasKeyJustPressed(118))){try{localStorage.removeItem('orbitalSalvageSave');location.reload();}catch(error10){console.warn('Не удалось сбросить DEV-сохранение',error10);}}
if(st==='play'){
 const type10=v.get('MissionType').getAsString(),cargo10=v.get('Cargo').getAsNumber(),target10=v.get('MissionTarget').getAsNumber(),reward10=v.get('MissionReward').getAsNumber(),progress10=v.get('MissionProgress').getAsNumber(),time10=v.get('MissionTimeLimit').getAsNumber();
 const title10=v.get('Mission').getAsString()||'КОНТРАКТ';
 const line10=type10==='nodamage'?'ГРУЗ '+cargo10+'/'+target10+' • КОРПУС ЦЕЛ':type10==='speed'?'ГРУЗ '+cargo10+'/'+target10+' • '+Math.max(0,Math.ceil(time10-v.get('RunTime').getAsNumber()))+' С':progress10+' / '+target10;
 set10('MissionText','КОНТРАКТ\n'+title10+'\n'+line10+'  •  НАГРАДА '+reward10+(v.get('MissionTechReward').getAsNumber()>0?' + 🔧'+v.get('MissionTechReward').getAsNumber():''));
 const sector10=v.get('CurrentSector').getAsNumber();
 for(const name10 of ['RouteLabel','RouteBeacon'])for(const object10 of runtimeScene.getObjects(name10)){const zoneSector10=object10.getVariables().get('Sector').getAsNumber();if(zoneSector10&&zoneSector10!==sector10)object10.hide();}
 for(const name10 of ['SatelliteWreck','SatelliteWreckSmall'])for(const object10 of runtimeScene.getObjects(name10)){object10.hide(sector10!==1);if(sector10===1)object10.setOpacity(name10==='SatelliteWreck'?150:135);}
}
if(st==='upgrades'){
 const info10={
  cargo:['ТРЮМ','+2 места в трюме'],engine:['ДВИГАТЕЛЬ','+10% скорости и тяги'],hull:['КОРПУС','+1 прочность'],magnet:['МАГНИТ','+25% радиуса сбора'],radar:['РАДАР','Время до базы и ценность'],insurance:['СТРАХОВКА','25% добычи при аварии'],
  shield:['ЩИТ','Первый удар без урона'],assist:['АВТОСБОР','+3 к цене каждого лома'],contract:['УСИЛИТЕЛЬ','+20% к награде контракта']
 };
 const cards10=runtimeScene.getObjects('UpgradeCardText'),buttons10=runtimeScene.getObjects('UpgradeButtonText'),backgrounds10=runtimeScene.getObjects('UpgradeButtonBg'),ids10=[v.get('Offer1').getAsString(),v.get('Offer2').getAsString(),v.get('Offer3').getAsString()],credits10=v.get('Credits').getAsNumber();
 ids10.forEach((id10,index10)=>{const data10=info10[id10],done10=id10==='done'||runtimeScene.__osModuleDone(id10),price10=runtimeScene.__osMap.prices[id10]||0,card10=cards10[index10],button10=buttons10[index10],background10=backgrounds10[index10];if(card10)card10.setString(data10?data10[0]+'\n'+(done10?'УСТАНОВЛЕН':'УРОВЕНЬ 0')+'\n\n'+data10[1]+'\n\n'+price10+' КРЕДИТОВ':'ВСЕ МОДУЛИ\nУСТАНОВЛЕНЫ');if(button10)button10.setString(done10?'ПОЛУЧЕНО ✓':credits10<price10?'НУЖНО ЕЩЁ '+(price10-credits10):'УСТАНОВИТЬ');if(background10){const over10=mx>=background10.getX()&&mx<=background10.getX()+background10.getWidth()&&my>=background10.getY()&&my<=background10.getY()+background10.getHeight();background10.setOpacity(done10?95:credits10<price10?(over10?155:115):over10?(pressed?170:255):220);}});
 set10('UpgradeTitle','ПРЕДЛОЖЕНИЯ МОДУЛЕЙ');set10('TechHint','СПЕЦИАЛЬНЫЕ ДЕЙСТВИЯ • РАСХОД: 1 ТЕХНОДЕТАЛЬ');set10('UpgradeNotice',s.toast>0?v.get('Status').getAsString():'3 ПРЕДЛОЖЕНИЯ ИЗ 9 МОДУЛЕЙ');
}
if(st==='upgrades'){const systemBg10=runtimeScene.getObjects('SystemButtonBg')[0],systemText10=runtimeScene.getObjects('SystemButtonText')[0];if(systemBg10&&systemText10){systemBg10.setPosition(765,782);systemBg10.setWidth(390);systemBg10.setHeight(66);systemText10.setPosition(765,815);systemText10.setWrappingWidth(390);}}
const devPanel10=runtimeScene.getObjects('DevPanel')[0],devText10=runtimeScene.getObjects('DevText')[0];
if(devPanel10&&devText10){const visible10=!!s.dev&&st==='play';devPanel10.hide(!visible10);devText10.hide(!visible10);if(visible10){const station10=Math.round(Math.hypot(s.x-260,s.y-700)),alive10=runtimeScene.getObjects('CommonSalvage').filter(object10=>!object10.isHidden()).length,hazards10=runtimeScene.getObjects('Debris').filter(object10=>!object10.isHidden()).length+runtimeScene.getObjects('FastDebris').filter(object10=>!object10.isHidden()).length;devText10.setString('DEV HUD  •  F3 скрыть\nПОЗИЦИЯ '+Math.round(s.x)+' / '+Math.round(s.y)+'  •  СКОРОСТЬ '+Math.round(Math.hypot(s.vx,s.vy))+'\nСЕКТОР '+v.get('CurrentSector').getAsNumber()+'  •  ДО СТАНЦИИ '+station10+' м\nКОНТРАКТ: '+v.get('Mission').getAsString()+'\nЛОМ '+alive10+'  •  ОПАСНОСТИ '+hazards10+'\nF4: +250 кредитов, +1 деталь  •  F8: сектор 2\nF6: следующий контракт  •  F7: сброс сохранения');runtimeScene.getObjects('FieldZone').forEach(object10=>object10.setOpacity(135));runtimeScene.getObjects('DangerZone').forEach(object10=>object10.setOpacity(165));}else{runtimeScene.getObjects('FieldZone').forEach(object10=>object10.setOpacity(45));}}
if(devText10&&!!s.dev)devText10.setString(devText10.getString().replace('F5: сектор 2','F8: сектор 2'));
if(typeof window!=='undefined'&&window.__osQAState)window.__osQAState.dev=!!s.dev;
`;
 layout.events[0].inlineCode=[init];layout.events[1].inlineCode=[play];layout.events[2].inlineCode=[ui];
};
