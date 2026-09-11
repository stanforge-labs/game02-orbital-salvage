process.env.OS_QA_PORT='4235';
const {open,click,read,fs,assert}=require('./release17-qa-lib');
(async()=>{const q=await open({width:1366,height:768}),p=q.p,r={mode:'isolated starting positions, then ordinary keyboard side flights',flights:[],errors:[]};try{
 await click(p,'ButtonBg');
 const identity=await p.evaluate(()=>{window.gen18=scene15.__g13Generate;window.tone18=scene15.__audio16.tone;return true;});
 for(const [sector,seed,x,y,key]of [[1,130013,2200,1550,'s'],[1,330051,3550,1600,'a'],[2,230032,3900,1300,'w']]){
  await p.evaluate(a=>{const v=scene15.getVariables(),s=scene15.__os;v.get('CurrentSector').setNumber(a.sector);scene15.__g13Generate(a.seed);v.get('Hull').setNumber(3);v.get('GameState').setString('play');Object.assign(s,{x:a.x,y:a.y,vx:0,vy:0,inv:0,onboarding:false});scene15.getObjects('Ship')[0].setCenterPositionInScene(a.x,a.y);},{sector,seed,x,y});
  const start=await read(p);await p.keyboard.down(key);await p.waitForTimeout(4500);await p.keyboard.up(key);const end=await read(p);
  const visible=await p.evaluate(()=>({scenes:scene15.getObjects('Scenic18').filter(o=>!o.isHidden()).length,poi:scene15.getObjects('ProcPOI').filter(o=>!o.isHidden()).length}));
  assert.ok(Math.hypot(end.shipX-start.shipX,end.shipY-start.shipY)>200);assert.ok(visible.scenes>0);
  r.flights.push({sector,seed,distance:Math.round(Math.hypot(end.shipX-start.shipX,end.shipY-start.shipY)),...visible});await p.screenshot({path:'screenshots/Polish18/side-route-'+sector+'-'+seed+'.png'});
 }
 r.stableFunctions=await p.evaluate(()=>gen18===scene15.__g13Generate&&tone18===scene15.__audio16.tone);assert.ok(r.stableFunctions,'initialization must never stack wrappers');
 r.framesStable=await p.evaluate(()=>{const g=scene15.__g13;return g.scenic18.every(d=>Number.isFinite(d.x)&&Number.isFinite(d.y));});assert.ok(r.framesStable);
}catch(e){r.failure=e.stack;console.error(e);}finally{r.errors=q.errors;fs.writeFileSync('docs/polish18-side-routes.json',JSON.stringify(r,null,2));await q.browser.close();}})();
