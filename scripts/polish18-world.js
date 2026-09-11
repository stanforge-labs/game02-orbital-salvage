// Visual-only deterministic layer. Never relocates loot, hazards or mission POIs.
module.exports=function world18(g){
 let state=(g.seed^0x1851ce)>>>0;const rnd=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
 const theme={working:0,dock:1,debris:2,graveyard:3,meteor:4,trail:5,radiation:6,wreck:7,station:8,signal:9,caravan:5,ice:10,relay:11,ore:4,energy:6,remote:11};
 const palettes=['#315f76','#45606b','#5b505c','#373c68','#70513a','#5d5b48','#62406d','#544957','#3a535f','#3e526e','#456c7c','#375c64'];
 for(const p of g.pois){const r=g.regions[p.region];p.frame=(theme[r.id]??2)*2+(p.primary?0:1);p.size=p.primary?(r.index===0?156:188):110;p.angle=Math.max(-35,Math.min(35,p.angle));r.tint=palettes[theme[r.id]??2];}
 // Secondary background compositions use their own pool, not the relay/POI list.
 // Thus survey progress, relay indices, event targets and saves stay untouched.
 const scenic=[],nearest=(x,y)=>g.regions.reduce((a,b)=>Math.hypot(x-a.x,y-a.y)<Math.hypot(x-b.x,y-b.y)?a:b);
 const add=(x,y,edge=false)=>{
  if(x<170||x>6060||y<130||y>2880||Math.hypot(x-260,y-700)<330)return;
  if(g.pois.some(p=>Math.hypot(x-p.x,y-p.y)<225)||scenic.some(p=>Math.hypot(x-p.x,y-p.y)<230))return;
  if([...g.loot,g.signal,g.gate,g.key,...g.events17].some(p=>Math.hypot(x-p.x,y-p.y)<125))return;
  const r=nearest(x,y);scenic.push({x,y,region:r.index,frame:(theme[r.id]??2)*2+Math.floor(rnd()*2),angle:(rnd()-.5)*50,size:edge?90+rnd()*22:102+rnd()*22});
 };
 // First reinforce the graph's actual inter-region routes, then cover side space.
 for(const[a,b]of g.graph17){const u=g.regions[a],v=g.regions[b],d=Math.hypot(v.x-u.x,v.y-u.y),n=Math.ceil(d/360);for(let j=1;j<n;j++){const t=j/n,side=j%2?1:-1;add(u.x+(v.x-u.x)*t-(v.y-u.y)/d*135*side,u.y+(v.y-u.y)*t+(v.x-u.x)/d*135*side,true);}}
 for(let row=0;row<9;row++)for(let col=0;col<18;col++)add(200+col*345+(row%2)*155+(rnd()-.5)*60,160+row*330+(rnd()-.5)*55);
 g.scenic18=scenic.slice(0,110);g.loot18={};for(const kind of ['scrap','energy','data','heavy'])g.loot18[kind]=g.loot.filter(o=>o.kind===kind);
 g.visual18={scenic:g.scenic18.length,primary:g.pois.length,themeCount:12};
};
