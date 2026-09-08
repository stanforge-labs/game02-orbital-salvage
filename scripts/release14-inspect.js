const {launch,steer,state,sleep,fs,path,root}=require('./smart08-play');
(async()=>{
 const session=await launch(process.env.ORBITAL_URL||'http://127.0.0.1:4230/index.html');const p=session.p,t=Date.now(),events=[];
 const out=path.join(root,'_tmp-export',process.env.ORBITAL_REPORT||'release14-inspection');fs.mkdirSync(out,{recursive:true});
 try{
 await p.evaluate(()=>{const old=gdjs.RuntimeScene.prototype.renderAndStep;gdjs.RuntimeScene.prototype.renderAndStep=function(...a){window.inspectScene=this;return old.apply(this,a);}});
 await p.waitForFunction(()=>window.inspectScene);
 const read=()=>p.evaluate(()=>{const s=window.inspectScene,g=s.__g13;return {loot:g.loot,signal:g.signal,key:g.key,gate:g.gate,secret:g.secret,prices:s.__osMap.prices};});
 const click=async(n,i=0)=>{const q=await p.evaluate(([n,i])=>{const o=window.inspectScene.getObjects(n)[i];return{x:o.getX()+o.getWidth()/2,y:o.getY()+o.getHeight()/2};},[n,i]);await p.mouse.click(q.x,q.y);await sleep(p,220);};
 const log=async(n)=>{const q={event:n,seconds:(Date.now()-t)/1000,state:await state(p)};events.push(q);console.log(JSON.stringify(q));};
 await p.screenshot({path:path.join(out,'menu.png')});await click('ButtonBg');await log('start');
 for(let run=0;run<8;run++){
  let s=await state(p);if(s.state!=='play')break;const type=s.missionType;
  for(let k=0;k<10;k++){
   s=await state(p);if(s.state!=='play'||s.cargo>=s.cargoMax||s.missionProgress>=s.missionTarget||(type==='nodamage'&&s.cargo>=4))break;
   const d=await read();let candidates=d.loot.filter(o=>!o.taken&& (type==='container'?o.kind==='heavy':type==='valuable'?o.kind==='energy':o.kind==='scrap'));
   candidates.sort((a,b)=>Math.hypot(a.x-s.shipX,a.y-s.shipY)-Math.hypot(b.x-s.shipX,b.y-s.shipY));if(!candidates.length)break;
   await steer(p,candidates[0].x,candidates[0].y,40);await log('loot');
  }
  await p.screenshot({path:path.join(out,'flight-'+run+'.png')});await steer(p,260,700,100);await log('return');s=await state(p);if(s.state!=='result')break;
  await p.screenshot({path:path.join(out,'result-'+run+'.png')});await click('ResultButtonBg');s=await state(p);const d=await read(),choice=s.offers.findIndex(id=>d.prices[id]<=s.credits);
  if(choice>=0){await click('UpgradeButtonBg',choice);await log('purchase');}
  await p.screenshot({path:path.join(out,'upgrades-'+run+'.png')});await click('UpgradeBackButtonBg');s=await state(p);
  if(s.state==='sectorSelect'){await click('SectorSelectButtonBg',1);await log('sector2');const d=await read();for(const [n,target] of [['signal',d.signal],['key',d.key],['gate',d.gate]]){await steer(p,target.x,target.y,40);await log(n);await p.screenshot({path:path.join(out,n+'.png')});if((await state(p)).state!=='play')break;}break;}
 }
 }finally{fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({events,errors:session.errors},null,2));await session.browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
