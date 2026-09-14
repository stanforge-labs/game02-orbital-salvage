// Pure, deterministic presentation hierarchy. Never changes mission resources.
module.exports=function world20(g){
 let seed=(g.seed^0x20ac921f)>>>0;const rand=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296),dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
 const themes={working:[1,8,9],dock:[13,1,0],debris:[2,6,12],graveyard:[3,10,14],meteor:[7,12,2],trail:[4,9,13],radiation:[6,5,15],wreck:[7,2,12],station:[0,13,11],signal:[14,10,15],caravan:[4,12,9],ice:[11,6,5],relay:[14,8,10],ore:[5,9,7],energy:[6,15,5],remote:[15,11,10]};
 const silhouettes=[0,1,2,3,4,5,0,2,3,6,7,0,2,1,7,8];
 const env=[],micro=[],protectedPoints=[...g.loot,...g.events17,g.signal,g.key,g.gate,{x:260,y:700,r:300}];
 const add=(x,y,size,family,tier,region)=>{
  const d={x,y,size,family,silhouette:silhouettes[family],tier,region,angle:Math.round(rand()*36-18),frame:tier==='large'?family:16+family+8*Math.floor(rand()*3),radius:size*.47};
  if(x<d.radius+65||x>6135-d.radius||y<d.radius+60||y>2940-d.radius)return null;
  if(protectedPoints.some(p=>dist(p,d)<d.radius+(p.r||72)))return null;
  if(g.hazards.some(p=>dist(p,d)<d.radius+(p.size||45)+60))return null;
  if(env.some(p=>dist(p,d)<p.radius+d.radius+45))return null;
  if(tier==='large'&&env.some(p=>p.tier==='large'&&p.family===family&&dist(p,d)<800))return null;
  if(tier==='large'&&env.some(p=>p.tier==='large'&&p.silhouette===d.silhouette&&dist(p,d)<650))return null;
  env.push(d);return d;
 };
 for(const r of g.regions){const families=themes[r.id]||[2,7,12];r.art20={palette:families,sceneIds:[]};
  // The playable landscape viewport is wider than tall. Prefer side banks,
  // leaving the approach between them, before falling back to full-circle sites.
  // Previously both landmarks could sit just above/below the visible play area.
  for(let j=0;j<2;j++){let placed;for(let n=0;n<48&&!placed;n++){const a=n<32?(j*Math.PI+(rand()-.5)*.8):rand()*Math.PI*2,rad=180+n*7,t=rand(),family=families[t<.5?0:t<.8?1:2];placed=add(r.x+Math.cos(a)*rad,r.y+65+Math.sin(a)*rad,260+rand()*55,family,'large',r.index);}if(placed)r.art20.sceneIds.push(env.length-1);}
  add(r.x+45,r.y+90,145,families[0]%8,'medium',r.index);
  for(let j=0;j<5;j++){const a=rand()*Math.PI*2,rad=230+rand()*340;add(r.x+Math.cos(a)*rad,r.y+Math.sin(a)*rad,115+rand()*44,(families[j%families.length]+j)%8,'medium',r.index);}
 }
 // Dress the actual 2D region links, including optional cross-links. These
 // mid-route traces make branches legible without adding walls or rewards.
 for(const [a,b]of g.graph17){const A=g.regions[a],B=g.regions[b],dx=B.x-A.x,dy=B.y-A.y,len=Math.hypot(dx,dy),side=rand()<.5?-1:1;add((A.x+B.x)/2-dy/len*110*side,(A.y+B.y)/2+dx/len*110*side,125,(themes[B.id]||[2])[0]%8,'medium',B.index);}
 // Coverage sites in two dimensions: rejected sites remain breathing space.
 for(let y=230;y<2900;y+=355)for(let x=450;x<6050;x+=420){if(env.length>=108)break;const p={x:x+(rand()-.5)*155,y:y+(rand()-.5)*150};if(env.some(e=>dist(p,e)<265))continue;const r=g.regions.reduce((a,b)=>dist(p,a)<dist(p,b)?a:b);add(p.x,p.y,105+rand()*35,(themes[r.id]||[2])[Math.floor(rand()*(themes[r.id]||[2]).length)]%8,'medium',r.index);}
 for(const e of env){if(micro.length>=150)break;for(let j=0;j<2;j++){const a=rand()*Math.PI*2,r=e.radius+65+rand()*65,p={x:e.x+Math.cos(a)*r,y:e.y+Math.sin(a)*r,size:38+rand()*25,angle:Math.round(rand()*360),frame:Math.floor(rand()*30),region:e.region};if(p.x<80||p.x>6120||p.y<80||p.y>2920||protectedPoints.some(t=>dist(t,p)<(t.r||65)+30)||env.some(t=>dist(t,p)<t.radius+25))continue;micro.push(p);}}
 // Existing mission POIs retain position and index; their art is a quiet piece
 // of local hardware, subordinate to the authored composition nearby.
 const anchors=g.pois.map(p=>({...p,frame:16+((themes[g.regions[p.region]?.id]||[1])[0]%8),size:p.primary?96:52,angle:p.angle||0}));
 g.env20=env;g.micro20=micro.slice(0,150);g.anchors20=anchors;
 g.routes20=g.graph17.map((edge,i)=>({from:edge[0],to:edge[1],role:i<g.regions.length-1?'primary':i%2?'risk-shortcut':'side-branch'}));
 g.art20={large:env.filter(e=>e.tier==='large').length,medium:env.filter(e=>e.tier==='medium').length,small:g.micro20.length,library:[16,24,30],familyCooldown:800};
 return g;
};
