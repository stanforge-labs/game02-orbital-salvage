// Release Candidate 11: add density, a contained secret encounter and robust modal/death UI.
module.exports=function applyRelease11(layout){
 let [init,play,ui]=layout.events.map(event=>event.inlineCode.join('\n'));
 if(init.includes('__release11'))return;
 const replace=(from,to)=>{if(!init.includes(from))throw new Error('Release11 init target missing: '+from);init=init.replace(from,to);};
 replace("if(id==='insurance')get('InsuranceLevel').setNumber(1);if(id==='shield')get('ShieldLevel').setNumber(1);if(id==='assist')get('AssistLevel').setNumber(1);if(id==='contract')get('ContractLevel').setNumber(1);", "if(id==='insurance')get('InsuranceLevel').setNumber(1);if(id==='shield')get('ShieldLevel').setNumber(1);if(id==='assist')get('AssistLevel').setNumber(1);if(id==='contract')get('ContractLevel').setNumber(1);if(id==='repair')get('RepairLevel').setNumber(1);if(id==='scanner')get('ScannerLevel').setNumber(1);");
 replace("get('ContractLevel').setNumber(0);get('SpentCredits')", "get('ContractLevel').setNumber(0);get('RepairLevel').setNumber(0);get('ScannerLevel').setNumber(0);get('SpentCredits')");
 init+=String.raw`
if(!runtimeScene.__release11){
 runtimeScene.__release11=true;
 const modules11=['cargo','engine','hull','magnet','radar','insurance','shield','assist','contract','repair','scanner'];
 const key11={cargo:'CargoMax',engine:'EngineLevel',hull:'HullMax',magnet:'MagnetLevel',radar:'RadarLevel',insurance:'InsuranceLevel',shield:'ShieldLevel',assist:'AssistLevel',contract:'ContractLevel',repair:'RepairLevel',scanner:'ScannerLevel'};
 const oldSave11=runtimeScene.__osSave,oldDone11=runtimeScene.__osModuleDone;
 try{const saved11=JSON.parse(localStorage.getItem('orbitalSalvageSave')||'{}');for(const name11 of ['RepairLevel','ScannerLevel'])get(name11).setNumber(Number(saved11[name11])||0);}catch(error11){console.warn('Не удалось загрузить RC11-модули',error11);}
 runtimeScene.__osModuleDone=(id11)=>id11==='repair'||id11==='scanner'?get(key11[id11]).getAsNumber()>=1:oldDone11(id11);
 runtimeScene.__osInstalledCount=()=>modules11.reduce((sum11,id11)=>sum11+(runtimeScene.__osModuleDone(id11)?1:0),0);
 runtimeScene.__osAvailable=()=>modules11.filter(id11=>!runtimeScene.__osModuleDone(id11)).length;
 runtimeScene.__osOffers=()=>{const pool11=modules11.filter(id11=>!runtimeScene.__osModuleDone(id11)),picked11=[];for(let i11=0;i11<3;i11++)picked11.push(i11<pool11.length?pool11[(get('OfferSeed').getAsNumber()+i11)%pool11.length]:'done');['Offer1','Offer2','Offer3'].forEach((name11,index11)=>get(name11).setString(picked11[index11]));get('OffersReady').setNumber(1);};
 runtimeScene.__osSave=()=>{oldSave11();try{const saved11=JSON.parse(localStorage.getItem('orbitalSalvageSave')||'{}');for(const name11 of ['RepairLevel','ScannerLevel'])saved11[name11]=get(name11).getAsNumber();localStorage.setItem('orbitalSalvageSave',JSON.stringify(saved11));}catch(error11){console.warn('Не удалось сохранить RC11-модули',error11);}};
 runtimeScene.__osMap.prices={...runtimeScene.__osMap.prices,repair:175,scanner:185};
 runtimeScene.__os11={key:false,portal:false,secret:false,cache:false,repairUsed:false,meteorClock:0};
 if(typeof window!=='undefined'&&!runtimeScene.__release11Input){runtimeScene.__release11Input=true;window.addEventListener('keydown',event11=>{runtimeScene.__release11Key=event11.code;});}
}
`;
 play+=String.raw`
const r11=runtimeScene.__os11;if(!r11)return;
const sector11=v.get('CurrentSector').getAsNumber(),dist11=(x11,y11)=>Math.hypot(s.x-x11,s.y-y11);
const isSector2_11=sector11===2;
// One-use emergency repair is deliberately automatic at critical hull, removing a timing burden.
if(v.get('RepairLevel').getAsNumber()>=1&&!r11.repairUsed&&v.get('Hull').getAsNumber()===1&&v.get('GameState').getAsString()==='play'){v.get('Hull').setNumber(2);r11.repairUsed=true;s.floatText='РЕМКОМПЛЕКТ +1 КОРПУС';s.floatLife=1.1;s.flash=.12;v.get('Status').setString('РЕМКОМПЛЕКТ ВОССТАНОВИЛ КОРПУС');s.toast=1.6;}
const key11=runtimeScene.getObjects('AccessKey')[0],portal11=runtimeScene.getObjects('SecretPortalGlow')[0],core11=runtimeScene.getObjects('SecretPortalCore')[0],cache11=runtimeScene.getObjects('SecretCache')[0],zone11=runtimeScene.getObjects('SecretZone')[0];
if(!isSector2_11){[key11,portal11,core11,cache11,zone11].filter(Boolean).forEach(object11=>object11.hide());runtimeScene.getObjects('LaserBeam').forEach(object11=>object11.hide());runtimeScene.getObjects('MeteorStream').forEach(object11=>object11.hide());}
else if(v.get('GameState').getAsString()==='play'){
 if(key11){key11.hide(r11.key);key11.setOpacity(215+Math.sin(s.phase*4)*40);}
 if(!r11.key&&dist11(4412,2168)<64){r11.key=true;v.get('Status').setString('ПОЛУЧЕН КЛЮЧ ДОСТУПА');s.toast=2.2;s.floatText='КЛЮЧ ДОСТУПА';s.floatLife=1.2;s.pickup=.25;}
 if(portal11&&core11){portal11.hide(false);core11.hide(false);const ready11=r11.key;portal11.setOpacity(ready11?220:105);core11.setOpacity(ready11?230:95);portal11.setScale((ready11?1.08:0.9)+Math.sin(s.phase*2)*.05);core11.setScale((ready11?1.0:0.72)+Math.sin(s.phase*3)*.05);}
 if(!r11.key&&dist11(5355,1065)<650){v.get('Status').setString('НЕИЗВЕСТНЫЙ СИГНАЛ: НУЖЕН КЛЮЧ ДОСТУПА');s.toast=Math.max(s.toast,.15);}
 if(r11.key&&!r11.portal&&dist11(5355,1065)<150){r11.portal=true;v.get('Status').setString('ШЛЮЗ АКТИВИРОВАН');s.toast=2.4;s.flash=.25;s.floatText='ДОСТУП ОТКРЫТ';s.floatLife=1.2;}
 if(r11.portal&&!r11.secret&&dist11(5355,1065)<88){r11.secret=true;s.x=5280;s.y=2460;s.vx=0;s.vy=0;runtimeScene.__osCam={x:5280,y:2460};runtimeScene.getObjects('Ship')[0].setCenterPositionInScene(5280,2460);v.get('Status').setString('СЕКРЕТНЫЙ ШЛЮЗ: КОРИДОР ОБЛОМКОВ');s.toast=2.4;}
 if(zone11){zone11.hide(!r11.secret);zone11.setColor('70;48;120');zone11.setOpacity(r11.secret?72:0);}
 runtimeScene.getObjects('LaserBeam').forEach((laser11,index11)=>{const phase11=(s.phase*.95+index11*.55)%2.4,active11=phase11>1.12&&phase11<1.92;laser11.hide(!r11.secret);laser11.setOpacity(active11?235:55);laser11.setColor(active11?'255;80;110':'255;180;90');if(active11&&s.inv<=0&&Math.abs(s.y-(laser11.getY()+laser11.getHeight()/2))<34&&s.x>laser11.getX()&&s.x<laser11.getX()+laser11.getWidth()){v.get('Hull').setNumber(Math.max(0,v.get('Hull').getAsNumber()-1));v.get('RunDamage').setNumber(v.get('RunDamage').getAsNumber()+1);s.inv=.75;s.shake=.25;s.flash=.22;v.get('Status').setString('ЛАЗЕР −1 КОРПУС');s.toast=1.2;}});
 if(cache11){cache11.hide(!r11.secret||r11.cache);cache11.setOpacity(220+Math.sin(s.phase*5)*35);if(r11.secret&&!r11.cache&&dist11(5859,2584)<76){r11.cache=true;v.get('Cargo').setNumber(Math.min(v.get('CargoMax').getAsNumber(),v.get('Cargo').getAsNumber()+1));v.get('CargoValue').setNumber(v.get('CargoValue').getAsNumber()+180);v.get('TechParts').setNumber(v.get('TechParts').getAsNumber()+1);v.get('Status').setString('ТЕХ-КЭШ: +180 КРЕДИТОВ • +1 ДЕТАЛЬ');s.toast=2.5;s.floatText='СЕКРЕТНАЯ НАГРАДА';s.floatLife=1.4;s.pickup=.35;}}
 // A readable meteor stream crosses the debris field; its warning is visible before damage starts.
 const wave11=(s.phase*.7)%5,activeWave11=wave11>1.4&&wave11<3.4;
 runtimeScene.getObjects('MeteorStream').forEach((meteor11,index11)=>{meteor11.hide(!isSector2_11);const x11=2850+((wave11*260+index11*95)%850),y11=720+index11*54;meteor11.setCenterPositionInScene(x11,y11);meteor11.setOpacity(activeWave11?235:55);meteor11.setScale(.62+(index11%2)*.12);meteor11.setAngle(35);if(activeWave11&&s.inv<=0&&Math.hypot(s.x-x11,s.y-y11)<42){v.get('Hull').setNumber(Math.max(0,v.get('Hull').getAsNumber()-1));v.get('RunDamage').setNumber(v.get('RunDamage').getAsNumber()+1);s.inv=.72;s.shake=.2;s.flash=.18;v.get('Status').setString('МЕТЕОР −1 КОРПУС');s.toast=1.1;}});
}
`;
 ui+=String.raw`
// Canonical modal geometry keeps every full-screen state optically centred in the 1920×1080 logical viewport.
const modal11=(name11,width11,height11,top11)=>{const object11=runtimeScene.getObjects(name11)[0];if(object11){object11.setPosition((1920-width11)/2,top11);object11.setWidth(width11);object11.setHeight(height11);}};
modal11('MenuPanel',920,760,160);modal11('ResultPanel',1120,640,220);modal11('UpgradePanel',1700,984,48);modal11('SectorSelectPanel',1560,910,85);modal11('ResetConfirmPanel',1040,490,295);
if(st==='fail'){
 const action11=runtimeScene.getObjects('ResultButtonBg'),text11=runtimeScene.getObjects('ResultText'),reward11=runtimeScene.getObjects('RewardButtonBg')[0],rewardText11=runtimeScene.getObjects('RewardButtonText')[0],used11=v.get('SecondChanceUsed').getAsNumber()>=1;
 if(action11[1])action11[1].hide();if(text11[1])text11[1].hide();if(action11[0])action11[0].hide(false);if(text11[0]){text11[0].hide(false);text11[0].setString('НОВЫЙ ВЫЛЕТ');}
 if(reward11&&rewardText11){reward11.hide(used11);rewardText11.hide(used11);if(!used11)rewardText11.setString('▶ ВТОРОЙ ШАНС\nЗА РЕКЛАМУ');}
}
if(st==='upgrades'){
 const techBg11=runtimeScene.getObjects('TechReadoutBg')[0],techText11=runtimeScene.getObjects('TechText')[0];if(techBg11)techBg11.hide(false);if(techText11)techText11.setString('ТЕХНОДЕТАЛИ\n🔧 '+v.get('TechParts').getAsNumber());
 const info11={repair:['РЕМКОМПЛЕКТ','1 раз за вылет: +1 корпус'],scanner:['СКАНЕР УГРОЗ','Раньше видит метеоры и сигналы']};
 const cards11=runtimeScene.getObjects('UpgradeCardText'),buttons11=runtimeScene.getObjects('UpgradeButtonText'),backgrounds11=runtimeScene.getObjects('UpgradeButtonBg'),offers11=[v.get('Offer1').getAsString(),v.get('Offer2').getAsString(),v.get('Offer3').getAsString()];
 offers11.forEach((id11,index11)=>{if(!info11[id11])return;const done11=runtimeScene.__osModuleDone(id11),price11=runtimeScene.__osMap.prices[id11],credit11=v.get('Credits').getAsNumber();if(cards11[index11])cards11[index11].setString(info11[id11][0]+'\n'+(done11?'УСТАНОВЛЕН':'УРОВЕНЬ 0')+'\n\n'+info11[id11][1]+'\n\n'+price11+' КРЕДИТОВ');if(buttons11[index11])buttons11[index11].setString(done11?'ПОЛУЧЕНО ✓':credit11<price11?'НУЖНО ЕЩЁ '+(price11-credit11):'УСТАНОВИТЬ');if(backgrounds11[index11])backgrounds11[index11].setOpacity(done11?95:220);});
}
if(st!=='upgrades')runtimeScene.getObjects('TechReadoutBg').forEach(object11=>object11.hide());
if(st==='play'){
 const marker11=runtimeScene.getObjects('SecretLabel')[0],warning11=runtimeScene.getObjects('MeteorWarning')[0],secret11=runtimeScene.__os11;
 if(marker11){marker11.hide(sector!==2);marker11.setString(secret11&&secret11.portal?'АКТИВНЫЙ ШЛЮЗ →':'НЕИЗВЕСТНЫЙ СИГНАЛ →');}
 if(warning11){const show11=sector===2&&v.get('ScannerLevel').getAsNumber()>=1;warning11.hide(!show11);if(show11)warning11.setString('МЕТЕОРНЫЙ ПОТОК: СКАНЕР ПРЕДУПРЕЖДАЕТ');}
 runtimeScene.getObjects('ZoneMarker').forEach(object11=>{const caption11=object11.getVariables().get('Caption').getAsString();object11.setString(caption11);object11.hide(sector!==1);});
}
if(st!=='play')for(const name11 of ['ZoneMarker','SecretLabel','MeteorWarning'])runtimeScene.getObjects(name11).forEach(object11=>object11.hide());
const key11=runtimeScene.__release11Key||'';runtimeScene.__release11Key='';
if((typeof location!=='undefined')&&(location.hostname==='localhost'||location.hostname==='127.0.0.1'||location.search.includes('dev=1'))&&key11==='F9'){v.get('CurrentSector').setNumber(2);v.get('SectorUnlocked').setNumber(1);v.get('OnboardingSeen').setNumber(1);runtimeScene.__os11.key=true;runtimeScene.__os11.portal=true;runtimeScene.__os11.secret=true;v.get('GameState').setString('play');s.x=5280;s.y=2460;s.vx=0;s.vy=0;runtimeScene.__osCam={x:5280,y:2460};runtimeScene.getObjects('Ship')[0].setCenterPositionInScene(5280,2460);v.get('Status').setString('DEV: СЕКРЕТНЫЙ КОРИДОР АКТИВИРОВАН');s.toast=2;}
`;
 layout.events[0].inlineCode=[init];layout.events[1].inlineCode=[play];layout.events[2].inlineCode=[ui];
};
