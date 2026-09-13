// Presentation only: positions, contracts, collision data and rewards untouched.
module.exports=function world19(g){
 let seed=(g.seed^0x19c0ffee)>>>0;
 const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 // Region identity is a mixture of silhouettes, not one repeated sprite.
 const weights={working:[0,0,1,5,11,8],dock:[1,1,0,5,8,7],debris:[2,2,7,5,3,8],graveyard:[3,3,0,11,2,1],meteor:[4,4,10,2,7,5],trail:[5,5,1,7,2,11],radiation:[6,6,8,7,2,9],wreck:[7,7,2,8,1,6],station:[8,8,1,7,3,6],signal:[9,9,6,11,8,10],ice:[10,10,4,2,5,9],relay:[11,11,0,1,3,9]};
 const silhouettes=[0,1,2,0,4,5,6,2,8,9,4,9],assigned=[];
 // Major landmarks retain regional priority; secondary pieces break repetition.
 const all=[...g.pois.filter(p=>p.primary),...g.pois.filter(p=>!p.primary),...g.scenic18];
 for(const p of all){p.baseSize19??=p.size;p.size=p.baseSize19;}
 for(const p of all){
  const id=g.regions[p.region]?.id,choices=weights[id]||weights.debris;
  const near=assigned.filter(q=>q.size>=90&&Math.hypot(p.x-q.x,p.y-q.y)<620);
  const available=choices.filter(f=>!near.some(q=>q.silhouette19===silhouettes[f]));
  const fallback=Array.from({length:12},(_,i)=>i).filter(f=>!near.some(q=>q.silhouette19===silhouettes[f]));
  const pool=available.length?available:fallback.length?fallback:choices;
  // If a dense junction exhausts the silhouette palette, use a small secondary
  // fragment rather than add another competing landmark. No collider changes.
  if(!available.length&&!fallback.length&&!p.primary)p.size=68;
  const family=p.primary&&pool.includes(choices[0])?choices[0]:pool[Math.floor(random()*pool.length)];
  p.family19=family;p.silhouette19=silhouettes[family];p.frame=family*2+Math.floor(random()*2);
  assigned.push(p);
 }
 g.visual19={families:12,sameFamilySpacing:620,objects:all.length};
};
