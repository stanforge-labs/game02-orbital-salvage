// Orthogonal carved layouts. Cells define navigable space; wall edges are merged.
module.exports=function secretModel15(template){
 const n=template%4,cell=140,ox=4900,oy=1950;
 const turns=[[[0,2],[1,2],[1,0],[3,0],[3,5],[5,5],[5,1],[7,1],[7,5],[8,5]],[[0,2],[0,5],[3,5],[3,2],[6,2],[6,5],[8,5]],[[0,2],[2,2],[2,0],[5,0],[5,3],[8,3],[8,5]],[[0,2],[2,2],[2,4],[4,4],[4,2],[6,2],[6,5],[8,5]]][n];
 const path=[turns[0]],open=new Set();for(let i=1;i<turns.length;i++){let [x,y]=path.at(-1),[a,b]=turns[i];while(x!==a||y!==b){x+=Math.sign(a-x);y+=Math.sign(b-y);path.push([x,y]);}}
 path.forEach(([x,y])=>open.add(x+','+y));
 // Chambers and side alcoves alter topology rather than just checkpoint order.
 if(n===2)for(const [x,y] of [[2,2],[5,0],[5,3],[8,3]])for(const [dx,dy] of [[1,0],[0,1],[1,1]])if(x+dx<9&&y+dy<7)open.add((x+dx)+','+(y+dy));
 if(n===3)for(const [x,y] of [[1,3],[3,3],[5,3],[7,4],[7,5],[8,4]])open.add(x+','+y);
 const edges=[];for(const key of open){const [x,y]=key.split(',').map(Number);for(const [dx,dy,axis,position,start] of [[0,-1,'h',y,x],[0,1,'h',y+1,x],[-1,0,'v',x,y],[1,0,'v',x+1,y]])if(!open.has((x+dx)+','+(y+dy)))edges.push({axis,position,start});}
 edges.sort((a,b)=>a.axis.localeCompare(b.axis)||a.position-b.position||a.start-b.start);const merged=[];for(const e of edges){const last=merged.at(-1);if(last&&last.axis===e.axis&&last.position===e.position&&last.end===e.start)last.end++;else merged.push({...e,end:e.start+1});}
 const walls=merged.map(e=>e.axis==='h'?[ox+e.start*cell,oy+e.position*cell-9,(e.end-e.start)*cell,18]:[ox+e.position*cell-9,oy+e.start*cell,18,(e.end-e.start)*cell]);
 const points=path.map(([x,y])=>[ox+(x+.5)*cell,oy+(y+.5)*cell]);
 const indices=Array.from({length:6},(_,i)=>Math.max(1,Math.floor((i+1)*(path.length-2)/6)));
 const gates=indices.map((idx,i)=>{const a=points[idx-1],b=points[idx],dx=b[0]-a[0],dy=b[1]-a[1];return{x:(a[0]+b[0])/2,y:(a[1]+b[1])/2,vertical:dx!==0,pattern:i,idx};});
 return {name:['ZIGZAG SECURITY','WRECK MAZE','SECURITY CHAMBERS','METEOR HYBRID'][n],template:n,walls,points,route:indices.map(i=>points[i]),gates,cache:points.at(-1),cells:[...open].map(k=>k.split(',').map(Number)),origin:[ox,oy],cell};
};
