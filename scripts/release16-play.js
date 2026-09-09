module.exports=function play16(scene,dt,fail){
 const v=scene.getVariables(),s=scene.__os,g=scene.__g13,num=k=>v.get(k).getAsNumber(),type=v.get('MissionType').getAsString();if(!g||!s)return;
 const m=g.mission16,secret=g.secret.stage>=4&&g.secret.stage<6;
 const message=text=>{scene.__radio16={text,life:5};scene.__audio16.tone('contract');};
 if(m){
  const taken=g.loot.filter(o=>o.taken).length;if(taken>m.pickups&&num('SalvageLevel')>0){for(const o of g.loot)if(o.taken&&!o.sorted16){o.sorted16=true;if(o.kind==='energy')v.get('CargoValue').setNumber(num('CargoValue')+6);}}
  if(num('RunDamage')>m.damage){if(num('BufferLevel')>0)s.inv=Math.max(s.inv,1.1);scene.__audio16.tone('hit');}m.damage=num('RunDamage');m.pickups=taken;
  if(['rescue','calibrate','expedition','anomaly'].includes(type)&&!secret){
   const idx=type==='calibrate'?[1,3,5]:type==='expedition'?[2,5,7]:type==='anomaly'?[4,6,7]:[1,3,4];
   const r=g.regions[idx[Math.min(m.stage,2)]],target=g.pois.find(p=>p.region===r.index)||r;m.target={x:target.x,y:target.y};
   let condition=Math.hypot(s.x-target.x,s.y-target.y)<85;
   if(type==='rescue'&&m.stage===1)condition=condition&&g.loot.some(o=>o.taken&&o.kind==='heavy');
   if(type==='anomaly'&&num('RunTime')>num('MissionTimeLimit')){m.failed=true;condition=false;}
   if(m.stage<3&&condition){m.hold+=dt;if(m.hold>=1.6){m.stage++;m.hold=0;v.get('MissionProgress').setNumber(m.stage);message(['rescue','anomaly'].includes(type)?['ОПЕРАТОР / Сигнал принят. Ищите источник дальше.','ОПЕРАТОР / Данные восстановлены. Последняя точка на радаре.','ОПЕРАТОР / Цепочка завершена. Возвращайтесь.'][m.stage-1]:'ОПЕРАТОР / Узел '+m.stage+'/3 подтверждён.');}}else m.hold=0;
  }
  if(type==='streak')v.get('MissionProgress').setNumber(Math.min(5,num('Streak')));
 }
 const chase=g.chase16,region=g.regions[g.region];
 if(chase&&!secret){
  if(chase.phase==='idle'&&region&&region.index>2&&!chase.used.includes(region.index)&&(region.haz>=4||type==='pursuit')&&Math.hypot(s.x-region.x,s.y-region.y)<250){chase.phase='warning';chase.time=2.5;chase.region=region.index;chase.used.push(region.index);message('ДИСПЕТЧЕР / Гравитационный след! Через 3 секунды начнётся погоня.');}
  if(chase.phase==='warning'){chase.time-=dt;if(chase.time<=0){chase.phase='chasing';chase.time=12;chase.bodies=[{x:s.x-380,y:s.y-130},{x:s.x+340,y:s.y+160}];}}
  if(chase.phase==='chasing'){chase.time-=dt;for(const b of chase.bodies){if(b.hit)continue;const d=Math.hypot(s.x-b.x,s.y-b.y)||1;b.x+=(s.x-b.x)/d*120*dt;b.y+=(s.y-b.y)/d*120*dt;if(d<34&&s.inv<=0){v.get('Hull').setNumber(Math.max(0,num('Hull')-1));v.get('RunDamage').setNumber(num('RunDamage')+1);v.get('Streak').setNumber(0);s.inv=1.1;s.flash=.2;s.floatText='ПРЕСЛЕДОВАТЕЛЬ −1 КОРПУС';s.floatLife=1;b.hit=true;}}
   if(chase.time<=0||region?.index!==chase.region){chase.phase='escape';chase.time=3;if(type==='pursuit')v.get('MissionProgress').setNumber(1);message('ДИСПЕТЧЕР / След потерян. Вы оторвались.');}}
  if(chase.phase==='escape'){chase.time-=dt;chase.bodies.forEach(b=>b.x-=dt*220);if(chase.time<=0)chase.phase='idle';}
 }
 scene.getObjects('Chaser16').forEach((o,i)=>{const b=chase?.bodies[i],show=!secret&&b&&!b.hit&&['chasing','escape'].includes(chase.phase);o.hide(!show);if(show){o.pauseAnimation();o.setAnimationFrame(6+i);o.setWidth(48);o.setHeight(42);o.setCenterPositionInScene(b.x,b.y);o.setAngle(Math.atan2(s.y-b.y,s.x-b.x)*180/Math.PI);o.setOpacity(255);}});
 // Radiation is spatial, not a blinking sprite; mitigation consumes once per run.
 const fields=g.regions.filter(r=>r.id==='radiation'||r.id==='energy');scene.getObjects('Radiation16').forEach((o,i)=>{const r=fields[i];o.hide(secret||!r||Math.hypot(s.x-r.x,s.y-r.y)>1200);if(r){o.pauseAnimation();o.setWidth(320);o.setHeight(320);o.setCenterPositionInScene(r.x,r.y);o.setOpacity(180);}});
 const radiation=region?.id==='radiation'||region?.id==='energy';if(radiation&&!secret&&Math.hypot(s.x-region.x,s.y-region.y)<120){m.radiation=(m.radiation||0)+dt;if(m.radiation>2.5&&s.inv<=0){m.radiation=0;if(num('ContainmentLevel')&&!m.isolation){m.isolation=true;message('ИЗОЛЯЦИЯ / Радиационный импульс поглощён.');}else{v.get('Hull').setNumber(Math.max(0,num('Hull')-1));v.get('RunDamage').setNumber(num('RunDamage')+1);s.inv=1;s.flash=.2;s.floatText='РАДИАЦИЯ −1 КОРПУС';s.floatLife=1;}}}else if(m)m.radiation=0;
 if(g.secret.cache&&num('DecoderLevel')&&!g.secret.decoder16){g.secret.decoder16=true;v.get('CargoValue').setNumber(num('CargoValue')+60);}
 const state=v.get('GameState').getAsString();if(num('Hull')<=0&&state==='play'){if(num('ShieldLevel')>0&&!s.shieldUsed10){s.shieldUsed10=true;v.get('Hull').setNumber(1);v.get('RunDamage').setNumber(Math.max(0,num('RunDamage')-1));s.floatText='ЩИТ ПОГЛОТИЛ УДАР';s.floatLife=1;}else fail();}
};
