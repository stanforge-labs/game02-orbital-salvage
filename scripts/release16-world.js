// Pure deterministic open-space composition. No walls or maze colliders here.
module.exports=function world16(g,sector,limits){
 let state=g.seed>>>0;const rnd=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
 const names=['Рабочая орбита','Ремонтный причал','Поле обломков','Кладбище спутников','Метеорный поток','Контейнерный след','Радиационный карман','Разлом крейсера','Станция-призрак','Сенсорная аномалия','Орбитальный караван','Ледяной пояс','Кольцо антенн','Рудный карман','Энергетический шрам','Затерянный ретранслятор'];
 const ids=['working','dock','debris','graveyard','meteor','trail','radiation','wreck','station','signal','caravan','ice','relay','ore','energy','remote'];
 // Distinct macro skeletons: arcs, twin banks, spokes, chains, lobes and islands.
 const shapes=[[[0,0],[180,80],[320,-70]],[[0,0],[-160,-100],[170,-100],[0,180]],[[0,0],[-210,-90],[-160,160],[160,150],[230,-80]],[[0,0],[-230,-130],[-210,150],[240,-120],[220,160]],[[0,0],[-260,-150],[-100,-60],[100,60],[260,150]],[[0,0],[-280,-80],[-120,-40],[120,40],[280,80]],[[0,0],[-220,0],[0,-230],[220,0],[0,230]],[[0,0],[-240,-100],[-70,-30],[150,70],[260,160]],[[0,0],[-220,-180],[220,-180],[-220,180],[220,180]],[[0,0],[-260,40],[-100,230],[180,200],[270,-80]],[[0,0],[-260,-130],[-80,-130],[100,130],[280,130]],[[0,0],[-270,0],[-180,170],[0,260],[210,150]],[[0,0],[-200,-180],[0,-250],[220,-160],[250,110]],[[0,0],[-240,140],[-80,200],[160,-150],[290,-50]],[[0,0],[-240,-170],[-140,-80],[120,80],[250,170]],[[0,0],[-300,0],[0,270],[290,0]]];
 g.structures=[];g.decor=[];g.pois=[];g.hazards=[];g.loot=[];
 const centers=[[820,640],[1530,1050],[2280,530],[3050,1160],[3850,550],[4600,1150],[5410,640],[5360,1900],[4330,2240],[3210,2080],[2040,2170]];
 const count=sector===1?9:11,used=new Set();g.regions=[];
 for(let i=0;i<count;i++){
  let f=i===0?0:i===1?2:i===2?3:i===3?4:Math.floor(rnd()*16);while(used.has(f))f=(f+1)%16;used.add(f);
  const variant=Math.floor(rnd()*4),angle=rnd()*Math.PI*2,mirror=rnd()<.5?-1:1,spread=[.85,1,1.18,1.06][variant],c=centers[i],r={id:ids[f],title:names[f].toUpperCase(),risk:i===0?'БЕЗОПАСНАЯ ЗОНА':f===4||f===6||f===14?'ВЫСОКИЙ РИСК':'МАРШРУТ СБОРА',x:c[0]+(rnd()-.5)*150,y:c[1]+(rnd()-.5)*160,index:i,family:f,variant,rot:angle,mirror,haz:i===0?0:f===4||f===6||sector===2?4:2};g.regions.push(r);
  const project=(x,y)=>({x:Math.max(560,Math.min(5960,r.x+(x*mirror*Math.cos(angle)-y*Math.sin(angle))*spread)),y:Math.max(190,Math.min(2780,r.y+(x*mirror*Math.sin(angle)+y*Math.cos(angle))*spread))});
  let nodes=shapes[f].map(p=>p.slice());
  // Branch omission, displaced focal point, split satellite bank, radial spur.
  if(variant===1&&nodes.length>4)nodes.splice(2,1);
  if(variant===2)nodes[0]=[100,-95];
  if(variant===3){nodes=nodes.map(([x,y],j)=>[x+(j%2?65:-55),y+(j%2?-60:60)]);nodes.push([0,-300]);}
  g.pois.push({...project(...nodes[0]),kind:r.id,region:i,frame:f%8,angle:angle*180/Math.PI,size:i===0?110:145+(f%3)*16});
  nodes.slice(1).forEach(([x,y],j)=>{const p=project(x,y);for(let k=0;k<2;k++)g.decor.push({x:p.x+k*36,y:p.y+k*25,size:24+(j%3)*12,angle:angle*180/Math.PI+j*43,region:i,frame:(f+j)%8});});
  const candidates=nodes.map(([x,y],j)=>project(x+(j%2?85:-85),y+110));
  for(let j=0;j<candidates.length;j++){const p=candidates[j];if(g.loot.some(o=>Math.hypot(o.x-p.x,o.y-p.y)<145))continue;const kind=i<2?'scrap':f===5||f===10?j%3===0?'heavy':'scrap':f===9||f===15?j===0?'data':'energy':j===0?'energy':'scrap';g.loot.push({...p,kind,taken:false,region:i});}
  for(let j=0;j<r.haz;j++){const a=angle+j*2.15,p=project(Math.cos(a)*320,Math.sin(a)*280);if(Math.hypot(p.x-260,p.y-700)<620||g.loot.some(o=>Math.hypot(o.x-p.x,o.y-p.y)<110))continue;const family=f===4?3:f===6?4:j===0&&i%3===0?1:j%3===2?2:0;g.hazards.push({...p,baseX:p.x,baseY:p.y,phase:rnd()*6.28,moving:family===3||family===2,region:i,family,size:[38,70,48,44,52][family]});}
 }
 // Guided entrance, then a meaningful mid-range quota. Never invisible targets.
 g.loot=g.loot.filter(o=>o.region!==0);g.loot.unshift(...[[720,700],[990,830],[1160,570]].map(([x,y])=>({x,y,kind:'scrap',taken:false,region:0})));
 for(const [kind,region,n]of[['heavy',3,2],['data',6,2],['energy',2,3]]){while(g.loot.filter(o=>o.kind===kind).length<n){const r=g.regions[region],j=g.loot.filter(o=>o.kind===kind).length;g.loot.push({x:r.x+260-j*170,y:r.y+250,kind,taken:false,region});}}
 for(const kind of ['scrap','heavy','energy','data']){let n=0;g.loot=g.loot.filter(o=>o.kind!==kind||n++<(limits[kind]||32));}
 g.decor=g.decor.slice(0,limits.decor);g.pois=g.pois.slice(0,limits.pois);g.hazards=g.hazards.slice(0,limits.hazards);
 const sr=g.regions.find(r=>r.id==='signal')||g.regions[7],kr=g.regions[4];g.signal={x:sr.x,y:sr.y+80};g.gate={x:sr.x+240,y:sr.y-50};g.key={x:kr.x+180,y:kr.y+120};
 g.hazards=g.hazards.filter(h=>[g.signal,g.gate,g.key].every(p=>Math.hypot(h.x-p.x,h.y-p.y)>170)&&g.loot.every(p=>Math.hypot(h.x-p.x,h.y-p.y)>175));
 g.validation={seed:g.seed,regions:g.regions.length,variants:g.regions.map(r=>r.id+'-'+r.variant),families:g.regions.map(r=>r.family),loot:g.loot.length,hazards:g.hazards.length,wallCount:0,stationSafe:g.hazards.every(h=>Math.hypot(h.x-260,h.y-700)>620)};
 g.mission16={stage:0,hold:0,pickups:0,damage:0};g.chase16={phase:'idle',time:0,used:[],bodies:[]};
};
