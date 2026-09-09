// Post-process the established generator: preserve rewards/mission resources,
// replace the one-dimensional itinerary with a connected, seeded region graph.
module.exports=function world17(g,sector){
 let seed=(g.seed^0x71c9a5)>>>0;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const sites=[[850,700],[1550,1120],[2220,500],[3050,1120],[3730,530],[4460,1250],[5420,620],[5150,2270],[3960,2310],[2740,2200],[1550,2320]];
 // The early working area is recognisable; the remaining branches rotate among
 // two rows. Placement changes topology, not just the angle of a single sprite.
 if(rnd()<.5)[sites[4],sites[8]]=[sites[8],sites[4]];
 if(rnd()<.5)[sites[5],sites[7]]=[sites[7],sites[5]];
 if(rnd()<.5)[sites[6],sites[9]]=[sites[9],sites[6]];
 g.regions.forEach((r,i)=>{const old={x:r.x,y:r.y};r.x=sites[i][0]+(rnd()-.5)*160;r.y=sites[i][1]+(rnd()-.5)*160;r.tint=['#17445a','#3d394c','#273b52','#574238','#394852'][r.family%5];
  for(const list of [g.loot,g.hazards,g.pois,g.decor])for(const o of list)if(o.region===i&&!(i===0&&list===g.loot)){o.x+=r.x-old.x;o.y+=r.y-old.y;o.x=Math.max(560,Math.min(5930,o.x));o.y=Math.max(230,Math.min(2770,o.y));if(o.baseX!==undefined){o.baseX=o.x;o.baseY=o.y;}}
 });
 // A sparse connected graph plus optional local links. No physical walls.
 g.graph17=[];for(let i=1;i<g.regions.length;i++){const r=g.regions[i];let best=0;for(let j=1;j<i;j++)if(Math.hypot(r.x-g.regions[j].x,r.y-g.regions[j].y)<Math.hypot(r.x-g.regions[best].x,r.y-g.regions[best].y))best=j;g.graph17.push([best,i]);}
 for(let i=1;i<g.regions.length;i++)for(let j=i+1;j<g.regions.length;j++)if(Math.hypot(g.regions[i].x-g.regions[j].x,g.regions[i].y-g.regions[j].y)<1700&&rnd()<.3&&!g.graph17.some(e=>e[0]===i&&e[1]===j))g.graph17.push([i,j]);
 const nearest=(x,y)=>g.regions.reduce((a,b)=>Math.hypot(x-a.x,y-a.y)<Math.hypot(x-b.x,y-b.y)?a:b);
 g.pois=g.regions.map(r=>({x:r.x,y:r.y+80,kind:r.id,region:r.index,frame:r.family,angle:(rnd()-.5)*55,size:r.index===0?138:172,primary:true}));
 // Coverage is a composition lattice with jitter, not a lattice of pickups.
 // Each sprite is a complete authored vignette. Small props are not collectibles.
 for(let row=0;row<6;row++)for(let col=0;col<10;col++){
  const x=260+col*595+(rnd()-.5)*100,y=240+row*490+(rnd()-.5)*80;
  if(Math.hypot(x-260,y-700)<310||g.pois.some(p=>Math.hypot(p.x-x,p.y-y)<260))continue;
  const r=nearest(x,y);g.pois.push({x,y,kind:r.id,region:r.index,frame:(r.family+Math.floor(rnd()*3))%16,angle:(rnd()-.5)*100,size:112+rnd()*24,primary:false});
 }
 // No second, unseeded decorative layer competing with these compositions.
 for(const [x,y]of [[5990,370],[5990,1450],[5990,2580]])if(g.pois.every(p=>Math.hypot(p.x-x,p.y-y)>340)){const r=nearest(x,y);g.pois.push({x,y,kind:r.id,region:r.index,frame:r.family,angle:18,size:120,primary:false});}
 g.decor=[];
 // Keep every contract resource, distribute redundant pickups along local
 // approaches. Four items are reserved for explicit salvage-field pockets.
 for(const r of g.regions){const loot=g.loot.filter(o=>o.region===r.index);if(r.index===0)continue;loot.forEach((o,j)=>{const angle=r.rot+j*2.4,rad=190+Math.floor(j/3)*200;o.x=Math.max(540,Math.min(5960,r.x+Math.cos(angle)*rad));o.y=Math.max(180,Math.min(2800,r.y+Math.sin(angle)*rad));});}
 // Resolve duplicate fallback positions without dropping scarce mission items.
 for(let i=3;i<g.loot.length;i++)for(let n=0;n<24;n++){const o=g.loot[i];if(g.loot.slice(0,i).every(p=>Math.hypot(p.x-o.x,p.y-o.y)>=180))break;o.x=Math.max(550,Math.min(5960,o.x+Math.cos(n*2.4)*105));o.y=Math.max(180,Math.min(2800,o.y+Math.sin(n*2.4)*105));}
 // A rare-cargo contract requires TWO valuable items inside actual high-risk
 // regions, not merely two somewhere on the map. Relocate existing resources;
 // do not create bonus loot or change prices/rewards to repair this invariant.
 const risk=g.regions.find(r=>r.haz>=3),valuable=()=>g.loot.filter(o=>o.kind!=='scrap'&&g.regions[o.region].haz>=3);
 while(valuable().length<2){const o=g.loot.find(o=>o.kind!=='scrap'&&g.regions[o.region].haz<3);if(!o)break;let found=false;for(let k=0;k<32;k++){const a=k*2.4,x=risk.x+Math.cos(a)*(210+Math.floor(k/8)*80),y=risk.y+Math.sin(a)*(210+Math.floor(k/8)*80);if(x<560||x>5960||y<180||y>2800||g.loot.some(p=>p!==o&&Math.hypot(p.x-x,p.y-y)<180))continue;Object.assign(o,{x,y,region:risk.index});found=true;break;}if(!found)throw Error('No safe high-risk cargo placement for seed '+g.seed);}
 const sr=g.regions.find(r=>r.id==='signal')||g.regions[7],kr=g.regions[4];g.signal={x:sr.x,y:sr.y+80};g.gate={x:Math.min(5890,sr.x+240),y:sr.y-50};g.key={x:kr.x+180,y:kr.y+120};
 g.hazards=g.hazards.filter(h=>Math.hypot(h.x-260,h.y-700)>650&&g.loot.every(p=>Math.hypot(h.x-p.x,h.y-p.y)>180)&&[g.signal,g.gate,g.key].every(p=>Math.hypot(h.x-p.x,h.y-p.y)>210));
 g.events17=g.regions.filter(r=>r.index>0&&r.index%3===1).map((r,i)=>({id:['beacon','distress','convoy'][i%3],x:r.x+110,y:r.y+70,region:r.index,phase:'idle',hold:0,time:0,done:false}));
 g.validation={...g.validation,seed:g.seed,loot:g.loot.length,hazards:g.hazards.length,wallCount:0,compositions:g.pois.length,graphEdges:g.graph17.length,stationSafe:g.hazards.every(h=>Math.hypot(h.x-260,h.y-700)>650)};
};
