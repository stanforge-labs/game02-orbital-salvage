module.exports=function ui16(scene){
 const v=scene.getVariables(),s=scene.__os,g=scene.__g13,st=v.get('GameState').getAsString();if(!s)return;
 const game=scene.getGame(),W=game.getGameResolutionWidth(),H=game.getGameResolutionHeight(),portrait=innerHeight>innerWidth*1.08;
 const resolution=Math.max(devicePixelRatio||1,innerHeight/H);const resizeKey=[W,H,resolution].join(':');if(scene.__resolution16!==resizeKey){scene.__resolution16=resizeKey;const renderer=game.getRenderer().getPIXIRenderer();renderer.resolution=resolution;renderer.resize(W,H);}
 // Canvas already adapts width. The old fixed backdrop/UI were the black strip.
 for(const n of ['Background','Haze'])for(const o of scene.getObjects(n)){o.setPosition(-140,-80);o.setWidth(W+280);o.setHeight(H+160);}
 // Retire the old giant crosshair-like field decal; authored POIs and real
 // radiation volumes now carry the location information.
 scene.getObjects('Sector2Band').forEach(o=>o.hide());
 if(g?.secret.stage===4)scene.getObjects('SecretLabel').forEach(o=>o.hide());
 gdjs.evtTools.camera.setCameraX(scene,portrait?W/2:960,'HUD',0);gdjs.evtTools.camera.setCameraY(scene,540,'HUD',0);gdjs.evtTools.camera.setCameraZoom(scene,1,'HUD',0);
 if(portrait){const panel=scene.getObjects('RotatePanel')[0];if(panel){const dx=W/2-panel.getX()-panel.getWidth()/2;for(const n of ['RotatePanel','RotateDevice','RotateTitle','RotateHint'])for(const o of scene.getObjects(n))o.setX(o.getX()+dx);}}
 const rect=(name,i,x,y,w,h)=>{const o=scene.getObjects(name)[i];if(o){o.setPosition(x,y);o.setWidth(w);o.setHeight(h);}return o;};
 const text=(name,value,x,y,w,size,color='223;236;240',align='left')=>{const o=scene.getObjects(name)[0];if(!o)return;o.hide(st!=='play');o.setString(value);o.setPosition(x,y);o.setWrappingWidth(w);o.setCharacterSize(size);o.setColor(color);o.setTextAlignment(align);o.setVerticalTextAlignment('top');return o;};
 const L=960-W/2+Math.min(72,48*1080/innerHeight),R=960+W/2-Math.min(72,48*1080/innerHeight),top=42;
 if(st==='play'){
  rect('HudPanel',0,L,top,414,184);rect('HudPanel',1,R-434,top,434,184);rect('MissionPanel',0,702,top,516,184);
  text('CargoText','ГРУЗ       '+v.get('Cargo').getAsNumber()+' / '+v.get('CargoMax').getAsNumber(),L+32,top+46,350,29);
  text('HullText','КОРПУС    '+v.get('Hull').getAsNumber()+' / '+v.get('HullMax').getAsNumber(),L+32,top+111,350,29,v.get('Hull').getAsNumber()<=1?'255;149;103':'223;236;240');
  text('CreditsText','КРЕДИТЫ   '+v.get('Credits').getAsNumber(),R-402,top+43,370,29,'105;215;236');
  text('SectorText','СЕКТОР '+v.get('CurrentSector').getAsNumber(),R-402,top+94,370,23);
  text('SectorName16',v.get('CurrentSector').getAsNumber()===2?'Пояс обломков':'Безопасная орбита',R-402,top+130,370,22,'169;191;205');
  text('MissionHeader16','КОНТРАКТ',734,top+30,452,19,'127;176;194','center');
  text('MissionText',v.get('Mission').getAsString(),726,top+64,468,23,'234;238;222','center');
  let progress=v.get('MissionProgress').getAsNumber()+' / '+v.get('MissionTarget').getAsNumber();const mt=v.get('MissionType').getAsString();
  if(mt==='nodamage')progress='ГРУЗ '+v.get('Cargo').getAsNumber()+'/6 • '+(v.get('RunDamage').getAsNumber()?'ПОВРЕЖДЁН':'БЕЗ УРОНА');
  if(v.get('MissionTimeLimit').getAsNumber())progress+='  •  '+Math.max(0,Math.ceil(v.get('MissionTimeLimit').getAsNumber()-v.get('RunTime').getAsNumber()))+' С';
  text('MissionProgress16',progress,734,top+104,452,24,'226;236;238','center');
  text('MissionReward16','НАГРАДА '+v.get('MissionReward').getAsNumber()+(v.get('MissionTechReward').getAsNumber()?' + ДЕТАЛЬ':''),734,top+144,452,18,'211;182;123','center');
  const nav=scene.getObjects('NavMarker')[0];if(nav){nav.setPosition(610,262);nav.setCharacterSize(20);nav.setWrappingWidth(700);nav.setVerticalTextAlignment('top');}
  const reveal=scene.getObjects('RegionReveal')[0];if(reveal){reveal.setPosition(610,326);reveal.setCharacterSize(25);reveal.setWrappingWidth(700);reveal.setVerticalTextAlignment('top');}
  const war=scene.getObjects('MeteorTelegraph')[0];if(war){war.setPosition(560,376);war.setWrappingWidth(800);war.setCharacterSize(20);const lane=g?.regions.find(r=>r.id==='meteor');const show=lane&&Math.hypot(s.x-lane.x,s.y-lane.y)<640&&g.secret.stage<4;war.hide(!show);if(show)war.setString('МЕТЕОРНЫЙ ПОТОК • ИЩИТЕ ОКНО МЕЖДУ ТРАЕКТОРИЯМИ');}
  if(v.get('Cargo').getAsNumber()<v.get('CargoMax').getAsNumber()&&g?.mission16?.target&&['rescue','calibrate','expedition','anomaly'].includes(mt)){const m=g.mission16,t=m.target,d=Math.hypot(s.x-t.x,s.y-t.y),ar=['→','↘','↓','↙','←','↖','↑','↗'][(Math.round(Math.atan2(t.y-s.y,t.x-s.x)/(Math.PI/4))+8)%8];text('ObjectiveText',m.stage>=3?'ЦЕПОЧКА ВЫПОЛНЕНА • ВЕРНИТЕСЬ НА СТАНЦИЮ':m.failed?'ВРЕМЯ ВЫШЛО • ВЕРНИТЕСЬ НА СТАНЦИЮ':'ЭТАП '+(m.stage+1)+'/3  '+ar+' '+Math.round(d)+' м\n'+(mt==='rescue'&&m.stage===1?'Доставьте контейнер к источнику':'Удерживайтесь у маяка 2 секунды'),510,955,900,23,'229;236;218','center');}
  const radio=scene.__radio16;if(radio){radio.life-=Math.min(.1,scene.getTimeManager().getElapsedTime()/1000);const tutorial=scene.getObjects('OnboardingText')[0];text('Radio16',radio.life>0&&(!tutorial||tutorial.isHidden())?radio.text:'',L,765,580,20,'146;194;207');}
  if(g?.secret.stage===4){const i=g.secret.progress||0,p=g.secret.route?.[i];if(p)text('ObjectiveText','БЕЗОПАСНЫЙ КАРМАН '+(i+1)+'/6 • '+Math.round(Math.hypot(s.x-p[0],s.y-p[1]))+' м\nОстановитесь в круге • сканирование '+Math.min(100,Math.floor((g.secret.scan16||0)/1.3*100))+'%',460,938,1000,22,'202;221;211','center');}
  // All floating world texts use actual screen projection and HUD clearance.
  const cam=scene.__osCam;for(const name of ['PickupText','StationLabel','RiskLabel'])for(const o of scene.getObjects(name)){if(o.isHidden())continue;const z=2,w=o.getWidth()*z,h=o.getHeight()*z;let x=(o.getX()-cam.x)*z+W/2,y=(o.getY()-cam.y)*z+H/2;x=Math.max(32,Math.min(W-w-32,x));y=Math.max(410,Math.min(H-h-100,y));o.setPosition(cam.x+(x-W/2)/z,cam.y+(y-H/2)/z);}
 }else for(const n of ['MissionHeader16','MissionProgress16','MissionReward16','SectorName16','Radio16','Chaser16','Radiation16'])scene.getObjects(n).forEach(o=>o.hide());
 for(const o of scene.getObjects('ModalDim13')){o.setPosition(960-W/2,540-H/2);o.setWidth(W);o.setHeight(H);}
 if(st==='result'&&v.get('DeliveredValue').getAsNumber()<=0)for(const n of ['RewardButtonBg','RewardButtonText'])scene.getObjects(n).forEach(o=>o.hide());
 if(st==='fail'||st==='result')scene.getObjects('ResultTitle').forEach(o=>o.setColor(st==='fail'?'244;166;141':v.get('DeliveredValue').getAsNumber()<=0?'174;216;228':'162;237;174'));
 if(st==='upgrades'){const ids=[1,2,3].map(i=>v.get('Offer'+i).getAsString());ids.forEach((id,i)=>{const m=scene.__modules16[id];if(m){const done=scene.__osModuleDone(id),o=scene.getObjects('UpgradeCardText')[i],b=scene.getObjects('UpgradeButtonText')[i];o?.setString(m[2]+'\n'+(done?'УСТАНОВЛЕН':'УРОВЕНЬ 0')+'\n\n'+m[3]+'\n\n'+m[1]+' КРЕДИТОВ');b?.setString(done?'ПОЛУЧЕНО':v.get('Credits').getAsNumber()<m[1]?'НУЖНО ЕЩЁ '+(m[1]-v.get('Credits').getAsNumber()):'УСТАНОВИТЬ');}});}
 const audio=scene.__audio16,cur={st,cargo:v.get('Cargo').getAsNumber(),damage:v.get('RunDamage').getAsNumber(),secret:g?.secret.stage||0,progress:v.get('MissionProgress').getAsNumber()};if(scene.__last16){const old=scene.__last16;if(cur.st!==old.st)audio.tone(cur.st==='fail'?'fail':cur.st==='result'?'contract':cur.st==='play'?'start':'click');if(cur.cargo>old.cargo)audio.tone('pickup');if(cur.secret>old.secret)audio.tone('gate');if(cur.progress>old.progress)audio.tone('contract');}scene.__last16=cur;
 if(st==='play'&&g?.secret.stage===4){const gate=g.secret.map15?.gates.find(t=>Math.hypot(t.x-s.x,t.y-s.y)<220);if(gate){const phase=s.phase+gate.pattern*.38,key=Math.floor(phase/4.8)*8+gate.pattern;if(phase%4.8<.65&&scene.__laserSound16!==key){scene.__laserSound16=key;audio.tone('warning');}}}
 if(st!=='play'&&st!=='rotate'){const mx=gdjs.evtTools.input.getCursorX(scene,'HUD',0),my=gdjs.evtTools.input.getCursorY(scene,'HUD',0);let hovered='';for(const name of ['ButtonBg','ResultButtonBg','RewardButtonBg','UpgradeButtonBg','UpgradeBackButtonBg','SystemButtonBg','RerollButtonBg','ResetButtonBg','SectorSelectButtonBg'])scene.getObjects(name).forEach((o,i)=>{if(!o.isHidden()&&mx>=o.getX()&&mx<=o.getX()+o.getWidth()&&my>=o.getY()&&my<=o.getY()+o.getHeight())hovered=name+i;});if(hovered&&hovered!==scene.__hoverAudio16)audio.tone('hover');scene.__hoverAudio16=hovered;}
 scene.__shell16(Math.min(.05,scene.getTimeManager().getElapsedTime()/1000));
};
