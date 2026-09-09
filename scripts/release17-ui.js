module.exports=function ui17(scene){
 const v=scene.getVariables(),s=scene.__os,g=scene.__g13,ui=scene.__ui17,N=k=>v.get(k).getAsNumber(),st=v.get('GameState').getAsString();if(!ui)return;
 // The old menu art remains in the project for compatibility, not as a second
 // live menu. A single input/controller owns each new overlay.
 for(const n of ['MenuPanel','MenuTitle','MenuDescription','MenuHint','ButtonBg','ButtonText'])if(st==='menu')scene.getObjects(n).forEach(o=>o.hide());
 ui.render();
 // The journal/compass is the sole secret objective renderer. Retire the
 // legacy world label, including its stale Sector-1 text after a Sector-2 run.
 scene.getObjects('SecretLabel').forEach(o=>o.hide());
 if(!ui.unlockSeen&&N('SectorUnlocked')>0){ui.unlockSeen=true;ui.unlockUntil=performance.now()+7000;}
 if(st==='result'&&performance.now()<ui.unlockUntil){const t=scene.getObjects('StatusText')[0];if(t){t.hide(false);t.setString('НОВЫЙ СЕКТОР ОТКРЫТ · ВЫБЕРИТЕ ПОЯС ОБЛОМКОВ');}}
 if(st!=='play'){scene.getObjects('Event17').forEach(o=>o.hide());scene.getObjects('RegionAtmosphere17').forEach(o=>o.hide());return;}
 for(const n of ['AmbientDebris','ZoneDebris','RouteBeacon','Sector2Wreck','Sector2Wreck2','OrbitLandmark','ProcDecor'])scene.getObjects(n).forEach(o=>o.hide());
 if(ui.devOpen)for(const n of ['DevPanel','DevText','Dev13Panel','Dev13Text'])scene.getObjects(n).forEach(o=>o.hide());
 const region=g.regions[g.region]||g.regions[0],secret=g.secret.stage>=4&&g.secret.stage<6;
 // A safety warning has priority over the short region arrival caption.
 // Both previously used the same band below the top HUD.
 if(scene.getObjects('MeteorTelegraph').some(o=>!o.isHidden()))scene.getObjects('RegionReveal').forEach(o=>o.hide());
 for(const o of scene.getObjects('HudPanel').concat(scene.getObjects('MissionPanel')))o.setOpacity(255);
 for(const o of scene.getObjects('Haze'))o.setColor(N('CurrentSector')===2?'190;161;245':region.id==='graveyard'?'155;175;218':region.id==='meteor'?'220;189;164':'207;228;248');
 // Ambient volumes are pooled background sprites, never colliders.
 const fields=g.regions.map(r=>({r,d:Math.hypot(s.x-r.x,s.y-r.y)})).sort((a,b)=>a.d-b.d);
 scene.getObjects('RegionAtmosphere17').forEach((o,i)=>{const r=fields[i]?.r;o.hide(secret||!r);if(r){o.setCenterPositionInScene(r.x,r.y);o.setWidth(1200);o.setHeight(1000);o.setColor(r.tint.replace('#','').match(/../g).map(x=>parseInt(x,16)).join(';'));o.setOpacity(90);}});
 // Keep decorative hardware clearly below loot contrast. No animated frame swaps.
 scene.getObjects('ProcPOI').forEach(o=>{o.setColor('213;225;235');o.setOpacity(N('CurrentSector')===2?185:168);});
 const title=scene.getObjects('SectorName16')[0];title?.setString(region.title);title?.setCharacterSize(region.title.length>23?18:21);
 const contractTitle=scene.getObjects('MissionText')[0];if(contractTitle&&contractTitle.getString().length>29)contractTitle.setCharacterSize(20);
 if(N('Hull')<=1&&!ui.criticalSound){scene.__audio16.tone('warning');ui.criticalSound=true;}if(N('Hull')>1)ui.criticalSound=false;
 for(const n of ['MissionText','MissionHeader16','MissionProgress16','MissionReward16','CargoText','HullText','CreditsText','SectorText','SectorName16'])for(const o of scene.getObjects(n))o.setBold(n!=='MissionReward16'&&n!=='SectorName16');
 const mt=v.get('MissionType').getAsString(),nearest=list=>list.slice().sort((a,b)=>Math.hypot(a.x-s.x,a.y-s.y)-Math.hypot(b.x-s.x,b.y-s.y))[0];let target,label,detail;
 const completed=N('MissionProgress')>=N('MissionTarget')||(mt==='speed'&&N('Cargo')>=N('MissionTarget')&&N('ContainerCount')>=1)||(mt==='nodamage'&&N('Cargo')>=N('MissionTarget')&&N('RunDamage')===0),full=N('Cargo')>=N('CargoMax');
 if(mt==='speed')scene.getObjects('MissionProgress16')[0]?.setString('ГРУЗ '+N('Cargo')+'/'+N('MissionTarget')+' · '+Math.max(0,Math.ceil(N('MissionTimeLimit')-N('RunTime')))+' С');
 if(secret){const m=g.secret.map15,route=g.secret.route,p=route?.[g.secret.progress||0];if(m){const key=g.seed+':'+N('RunCount')+':'+m.template;if(ui.secretNavKey!==key){ui.secretNavKey=key;ui.secretWaypoint=0;}const stop=p?m.points.findIndex(a=>a[0]===p[0]&&a[1]===p[1]):m.points.length-1;ui.secretWaypoint=Math.min(ui.secretWaypoint,stop);let n=m.points[ui.secretWaypoint];if(Math.hypot(s.x-n[0],s.y-n[1])<42&&ui.secretWaypoint<stop)ui.secretWaypoint++;n=m.points[ui.secretWaypoint];target={x:n[0],y:n[1]};label=p?'КОНТРОЛЬНАЯ ТОЧКА '+((g.secret.progress||0)+1)+'/6':'ТЕХ-КЭШ';detail=ui.secretWaypoint===stop&&p?'Остановитесь в круге · сканирование '+Math.min(100,Math.floor((g.secret.scan16||0)/1.3*100))+'%':'Следуйте поворотам прохода · перед лучом дождитесь тёмной фазы';}}
 else if(ui.tracked==='station'||full||completed||g.secret.stage===6){target={x:260,y:700};label=full?'ТРЮМ ЗАПОЛНЕН · СТАНЦИЯ':'СТАНЦИЯ';detail='Возвращайтесь в светящийся круг';}
 else if(ui.tracked==='secret'&&N('CurrentSector')===2){target=g.secret.stage===0?g.signal:g.secret.stage===1?g.key:g.gate;label=g.secret.stage===0?'НЕИЗВЕСТНЫЙ СИГНАЛ':g.secret.stage===1?'КЛЮЧ ДОСТУПА':'ШЛЮЗ ЭКСПЕДИЦИИ';detail=g.secret.stage===0?'Приблизьтесь для исследования':g.secret.stage===1?'Найдите кодированный модуль':'Удерживайтесь у активного шлюза';}
 else if(ui.tracked==='meteor'){target=g.regions.find(r=>r.id==='meteor');label='МЕТЕОРНЫЙ ПОТОК';detail='Опасные траектории · ищите промежуток';}
 else if(g.chain17&&g.chain17.type===mt){target=g.chain17.target;label=v.get('Mission').getAsString();detail=g.chain17.description;}
 else if(mt==='relay'||mt==='signal'&&N('CurrentSector')===1){target=nearest(g.pois.filter((p,i)=>!g.relays.includes(i)));label='РЕТРАНСЛЯТОР';detail='Приблизьтесь для приёма сигнала';}
 else if(mt==='signal'){target=g.secret.stage===0?g.signal:g.key;label=g.secret.stage===0?'НЕИЗВЕСТНЫЙ СИГНАЛ':'КЛЮЧ ДОСТУПА';detail='Исследуйте потерянный передатчик';}
 else if(mt==='survey'){target=g.regions[Math.min(N('MissionProgress')+1,g.regions.length-1)];label='РАЗВЕДКА ОБЛАСТИ';detail='Посетите отмеченную область';}
 else if(['rescue','calibrate','expedition','anomaly'].includes(mt)&&g.mission16.target){target=g.mission16.target;label=v.get('Mission').getAsString();detail='Этап '+(g.mission16.stage+1)+'/3 · удерживайтесь у узла';}
 else{let list=g.loot.filter(o=>!o.taken);if(['container','courier','speed'].includes(mt))list=list.filter(o=>o.kind==='heavy');else if(['blackbox','fragile'].includes(mt))list=list.filter(o=>o.kind==='data');else if(mt==='tech')list=list.filter(o=>o.kind==='energy');else if(mt==='valuable')list=list.filter(o=>o.kind!=='scrap');else if(['danger','highrisk'].includes(mt))list=list.filter(o=>g.regions[o.region].haz>=3&&(mt!=='highrisk'||o.kind!=='scrap'));else list=list.filter(o=>o.kind==='scrap');target=nearest(list);label='ЦЕЛЬ КОНТРАКТА';detail='Светлые детали — добыча · Журнал: J';}
 const nearbyEvent=!secret&&!completed&&!full&&!g.chain17&&ui.tracked==='contract'&&g.events17.find(e=>!e.done&&e.phase==='active'&&Math.hypot(s.x-e.x,s.y-e.y)<115);
 if(nearbyEvent){target=nearbyEvent;label=nearbyEvent.id==='distress'?'АВАРИЙНЫЙ УЗЕЛ':nearbyEvent.id==='convoy'?'ДРЕЙФУЮЩИЙ ГРУЗ':'ПОВРЕЖДЁННЫЙ МАЯК';detail='Удерживайтесь рядом · '+Math.floor(nearbyEvent.hold/(nearbyEvent.id==='beacon'?3:2)*100)+'%'+(nearbyEvent.id==='distress'?' · осталось '+Math.ceil(nearbyEvent.time)+' с':'');}
 if(target){const d=Math.hypot(s.x-target.x,s.y-target.y),angle=Math.atan2(target.y-s.y,target.x-s.x)*180/Math.PI;ui.nav.querySelector('.compass').style.transform='rotate('+angle+'deg)';ui.nav.querySelector('.destination').textContent=label+' · '+Math.round(d)+' м';ui.nav.querySelector('small').textContent=detail;ui.nav.setAttribute('aria-label',label+', '+Math.round(d)+' метров');}
 else ui.nav.style.display='none';
 scene.getObjects('ObjectiveText').forEach(o=>o.hide());
 scene.getObjects('Event17').forEach((o,i)=>{const e=g.events17[i];o.hide(secret||!e||e.done||e.phase!=='active');if(e){o.pauseAnimation();o.setAnimationFrame(e.id==='convoy'?5:6);o.setCenterPositionInScene(e.x,e.y);o.setWidth(60);o.setHeight(45);o.setOpacity(230);}});
 if(ui.devOpen&&performance.now()>(ui.nextDebug||0)){ui.nextDebug=performance.now()+250;ui.debug.querySelector('pre').textContent='SEED '+g.seed+'\n'+region.title+' · сектор '+N('CurrentSector')+'\n'+Math.round(1000/Math.max(1,scene.getTimeManager().getElapsedTime()))+' FPS · '+scene.getTimeManager().getElapsedTime().toFixed(1)+' ms\n'+scene.getAdhocListOfAllInstances().length+' instances\nPOI '+g.pois.length+' · hazards '+g.hazards.length+'\n'+v.get('Mission').getAsString();}
 if(ui.devOpen&&(ui.poi||ui.hazards)){const cv=ui.debugCanvas;if(cv.width!==innerWidth||cv.height!==innerHeight){cv.width=innerWidth;cv.height=innerHeight;}const ctx=cv.getContext('2d'),game=scene.getGame(),W=game.getGameResolutionWidth(),H=game.getGameResolutionHeight(),cam=scene.__osCam;ctx.clearRect(0,0,cv.width,cv.height);const screen=p=>[(.5+(p.x-cam.x)*2/W)*cv.width,(.5+(p.y-cam.y)*2/H)*cv.height];ctx.font='12px Exo17';for(const [list,color]of[[ui.poi?g.pois:[],'#79c4dd'],[ui.hazards?g.hazards:[],'#f6aa6c']])for(const p of list){const[x,y]=screen(p);ctx.strokeStyle=color;ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,(p.size||60)*cv.height/H,0,Math.PI*2);ctx.stroke();ctx.fillText(p.kind||'hazard',x+10,y-15);}if(ui.poi)for(const[a,b]of g.graph17){const x=screen(g.regions[a]),y=screen(g.regions[b]);ctx.strokeStyle='#77aac055';ctx.beginPath();ctx.moveTo(...x);ctx.lineTo(...y);ctx.stroke();}}
 // Suppress decorative objects within top HUD panels; never alter their world
 // coordinates or collision. Panels are opaque, loot remains physically there.
 const W=scene.getGame().getGameResolutionWidth(),H=scene.getGame().getGameResolutionHeight(),cam=scene.__osCam;
 for(const o of scene.getObjects('ProcPOI')){if(o.isHidden())continue;const x=(o.getX()-cam.x)*2+960,y=(o.getY()-cam.y)*2+H/2,w=o.getWidth()*2,h=o.getHeight()*2;const panels=scene.getObjects('HudPanel').concat(scene.getObjects('MissionPanel'));if(panels.some(p=>x<p.getX()+p.getWidth()+15&&x+w>p.getX()-15&&y<p.getY()+p.getHeight()+15&&y+h>p.getY()-15))o.hide();}
};
