module.exports=function play17(scene,dt){
 const v=scene.getVariables(),s=scene.__os,g=scene.__g13,N=k=>v.get(k).getAsNumber(),type=v.get('MissionType').getAsString();if(!g)return;
 const radio=text=>{scene.__radio16={text,life:7};scene.__audio16.tone('gate');};
 if(g.run17!==N('RunCount')){g.run17=N('RunCount');scene.__ui17.tracked='contract';g.visited17=[];g.chain17=null;}
 if(N('CurrentSector')===2&&!g.signalAnnounced17&&g.secret.stage===0&&N('RunTime')>4){g.signalAnnounced17=true;scene.__ui17.tracked='secret';radio('ДИСПЕТЧЕР / Неизвестный сигнал обнаружен. Исследовательский шлюз экспедиции отмечен на навигаторе. Журнал — J.');}
 if(g.secret.stage!==g.secretStage17){g.secretStage17=g.secret.stage;if(g.secret.stage===1){scene.__ui17.tracked='secret';radio('ДИСПЕТЧЕР / Шлюз заперт. Ключ в кодированном модуле — новый пеленг на навигаторе.');}if(g.secret.stage===2)radio('ДИСПЕТЧЕР / Ключ принят. Вернитесь к шлюзу экспедиции.');if(g.secret.stage===6){scene.__ui17.tracked='station';radio('ДИСПЕТЧЕР / Архив экспедиции спасён. Возвращайтесь домой — мы разберёмся, что здесь произошло.');}}
 if(g.secret.stage>=4&&g.secret.stage<6)return;
 const repair=type==='relayrepair',rescue=type==='rescuechain',black=type==='blackboxchain';
 if(repair||rescue||black){
  const m=g.chain17||(g.chain17={stage:0,hold:0,type}),poi=i=>g.pois.find(p=>p.primary&&p.region===i)||g.regions[i];let target=poi(1),description='';
  const hold=(p,seconds)=>{if(Math.hypot(s.x-p.x,s.y-p.y)<75)m.hold+=dt;else m.hold=0;if(m.hold>=seconds){m.hold=0;return true;}return false;};
  const chase=()=>{g.chase16.phase='warning';g.chase16.time=2.5;g.chase16.region=g.region;radio('ДИСПЕТЧЕР / Источник включён. Идёт метеорная волна — отойдите от маяка!');};
  if(repair){
   if(m.stage===0){const available=g.loot.filter(o=>!o.taken&&o.kind==='scrap').sort((a,b)=>Math.hypot(a.x-s.x,a.y-s.y)-Math.hypot(b.x-s.x,b.y-s.y));target=available[0]||poi(1);description='Компоненты для ремонта: '+Math.min(3,N('ScrapCount'))+'/3';if(N('ScrapCount')>=3){m.stage=1;radio('ДИСПЕТЧЕР / Компоненты собраны. Восстановите маяк у старого причала.');}}
   else if(m.stage===1){target=poi(1);description='Ремонт маяка: удерживайтесь рядом · '+Math.floor(m.hold/3*100)+'%';if(hold(target,3)){m.stage=2;chase();}}
   else if(m.stage===2){target={x:260,y:700};description='Покиньте опасный участок и переживите волну';if(g.chase16.phase==='escape'||g.chase16.phase==='idle'){m.stage=3;radio('ДИСПЕТЧЕР / Навигационный маяк работает. Доставьте отчёт на станцию.');}}
  }else if(black){
   if(m.stage<2){target=poi(m.stage===0?2:4);description='Триангуляция '+(m.stage+1)+'/2 · удерживайтесь у антенны';if(hold(target,2)){m.stage++;radio(m.stage===2?'ДИСПЕТЧЕР / Чёрный ящик найден. Заберите кодированный модуль.':'ДИСПЕТЧЕР / Первая частота принята. Найдите вторую антенну.');}}
   else if(m.stage===2){target=g.loot.find(o=>!o.taken&&o.kind==='data')||poi(4);description='Заберите чёрный ящик';if(g.loot.some(o=>o.kind==='data'&&o.taken))m.stage=3;}
   else if(m.stage===3){target={x:260,y:700};description='Эвакуируйте архив к станции';if(Math.hypot(s.x-260,s.y-700)<420)m.stage=4;}
  }else{
   if(m.stage===0){target=poi(2);description='Просканируйте аварийный передатчик';if(hold(target,2)){m.stage=1;radio('ДИСПЕТЧЕР / Найден аварийный источник. Спасите энергоядро.');}}
   else if(m.stage===1){target=g.loot.find(o=>!o.taken&&o.kind==='energy')||poi(2);description='Заберите аварийное энергоядро';if(g.loot.some(o=>o.taken&&o.kind==='energy')){m.stage=2;chase();}}
   else if(m.stage===2){target={x:260,y:700};description='Уйдите от метеорной волны';if(['escape','idle'].includes(g.chase16.phase))m.stage=3;}
   else if(m.stage===3){target={x:260,y:700};description='Верните аварийное ядро';if(Math.hypot(s.x-260,s.y-700)<420)m.stage=4;}
  }
  v.get('MissionProgress').setNumber(m.stage);m.target=m.stage>=N('MissionTarget')?{x:260,y:700}:target;m.description=m.stage>=N('MissionTarget')?'Цепочка завершена · вернитесь на станцию':description;
 }
 for(const e of g.events17){if(e.done)continue;const d=Math.hypot(s.x-e.x,s.y-e.y);if(e.phase==='idle'&&d<350){e.phase='active';e.time=e.id==='distress'?45:90;radio(e.id==='distress'?'ДИСПЕТЧЕР / Слабый аварийный сигнал. Источник погаснет через 45 секунд.':e.id==='convoy'?'ДИСПЕТЧЕР / Дрейфующий грузовой узел. Можно забрать полезную деталь.':'ДИСПЕТЧЕР / Повреждённый маяк. Остановитесь рядом для восстановления.');}
  if(e.phase==='active'){e.time-=dt;if(e.id==='convoy')e.x+=dt*9;const r=e.id==='beacon'?60:70;if(d<r&&N('Cargo')<N('CargoMax'))e.hold+=dt;else e.hold=0;if(e.hold>=(e.id==='beacon'?3:2)){e.done=true;v.get('Cargo').setNumber(N('Cargo')+1);v.get('CargoValue').setNumber(N('CargoValue')+(N('CurrentSector')===2?35:20));s.floatText='УЗЕЛ ВОССТАНОВЛЕН\n+'+(N('CurrentSector')===2?35:20);s.floatLife=1.1;scene.__audio16.tone('pickup');}if(e.time<=0){e.phase='expired';e.done=true;}}
 }
};
