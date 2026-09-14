process.env.OS_QA_PORT='4237';
const{open,click,fs}=require('./release17-qa-lib');
(async()=>{const q=await open({width:1366,height:768}),p=q.p,out='screenshots/WorldArtGeneration20/',r={mode:'final-art recaptures; explicit visual fixtures using recorded real traversal endpoints',views:[]};try{
 await click(p,'ButtonBg');
 const place=async(seed,sector,x,y)=>{await p.evaluate(a=>{const s=scene15.__os,v=scene15.getVariables();v.get('GameState').setString('play');v.get('CurrentSector').setNumber(a.sector);scene15.__g13Generate(a.seed);Object.assign(s,{x:a.x,y:a.y,vx:0,vy:0,floatLife:0,toast:0});scene15.__osCam={x:a.x,y:a.y};scene15.getObjects('Ship')[0].setCenterPositionInScene(a.x,a.y);}, {seed,sector,x,y});await p.waitForTimeout(500);};
 const shot=async name=>{await p.screenshot({path:out+name+'.png'});r.views.push(name);};
 const flight=JSON.parse(fs.readFileSync('docs/world20-visual-qa.json')).flights[0];
 for(const [name,ix]of [['08-vertical-exploration',1],['09-diagonal-exploration',3],['10-side-branch',2]]){const pt=flight.paths[ix].to;await place(flight.seed,1,...pt);await shot(name);}
 await place(530089,2,1500,1200);const large=await p.evaluate(()=>scene15.__g13.env20.filter(d=>d.tier==='large').slice(0,3));
 for(let i=0;i<large.length;i++){const d=large[i];await place(530089,2,d.x-130,d.y-15);await shot('1'+(i+1)+'-large-landmark-'+['a','b','c'][i]);}
}catch(e){r.failure=e.stack;}finally{r.errors=q.errors;fs.writeFileSync('docs/world20-final-views.json',JSON.stringify(r,null,2));await q.browser.close();console.log(r);}})();
