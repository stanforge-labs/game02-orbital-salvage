const {fs,path,assert,root,sleep,state,click,steer,launch}=require('./smart08-play');
const cfg=require('./smart08-config');
const out=path.join(root,'screenshots/VisualBugfix09B');
const url='http://127.0.0.1:4223/index.html';
const report={screenshots:[],checks:[],errors:[],viewportChecks:[]};
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
async function shot(p,name){await p.screenshot({path:path.join(out,name)});report.screenshots.push(name);}
async function setRuntime(p,vars,stateName,position){
 await p.evaluate(({vars,stateName,position})=>new Promise((resolve,reject)=>{
  const proto=gdjs.RuntimeScene.prototype,fn=proto.renderAndStep;
  const timer=setTimeout(()=>{proto.renderAndStep=fn;reject(new Error('runtime state timeout'));},3000);
  proto.renderAndStep=function(...args){
   const result=fn.apply(this,args);const v=this.getVariables();
   for(const[k,val]of Object.entries(vars)){if(typeof val==='string')v.get(k).setString(val);else v.get(k).setNumber(val);}
   if(position){this.__os.x=position[0];this.__os.y=position[1];this.__osCam={x:position[0],y:position[1]};this.getObjects('Ship')[0].setCenterPositionInScene(position[0],position[1]);}
   if(stateName)v.get('GameState').setString(stateName);
   clearTimeout(timer);proto.renderAndStep=fn;resolve();return result;
  };
 }),{vars,stateName,position});
 await sleep(p,350);
}
async function close(s){report.errors.push(...s.errors);await s.browser.close();}
async function main(){
 let s=await launch(url,{width:1920,height:1080});let p=s.p;
 await click(p,960,710);await shot(p,'01-sector1-start.png');await close(s);

 s=await launch(url,{width:1920,height:1080});p=s.p;await click(p,960,710);await steer(p,...cfg.scrap[0]);await sleep(p,400);await shot(p,'02-sector1-after-tutorial.png');const afterLoot=await state(p);assert(afterLoot.cargo>0);await close(s);

 s=await launch(url,{width:1920,height:1080});p=s.p;await click(p,960,710);for(const xy of cfg.scrap.slice(0,3))await steer(p,...xy);await sleep(p,120);await shot(p,'03-streak-single.png');const streak=await state(p);report.checks.push({streak:streak.streak,status:streak.status});await close(s);

 s=await launch(url,{width:1920,height:1080});p=s.p;await click(p,960,710);await setRuntime(p,{Cargo:8,CargoMax:8,CargoValue:80,RunTime:1.2},'play',[2000,1300]);await shot(p,'04-full-cargo-safehud.png');await close(s);

 s=await launch(url,{width:1920,height:1080});p=s.p;await click(p,960,710);await setRuntime(p,{MissionType:'speed',MissionTimeLimit:100,RunTime:58,MissionTarget:4,Cargo:2,MissionProgress:2},'play',[1800,900]);await shot(p,'05-contract-hud.png');await close(s);

 s=await launch(url,{width:1920,height:1080});p=s.p;await click(p,960,710);await steer(p,2200,1120);await sleep(p,500);await shot(p,'06-sector1-density.png');await close(s);

 s=await launch(url,{width:1920,height:1080},false,{CurrentSector:2,SectorUnlocked:1,OnboardingSeen:1});p=s.p;await click(p,960,710);await steer(p,cfg.danger.x-350,820);await sleep(p,1200);await shot(p,'07-sector2-wreck.png');await close(s);

 s=await launch(url,{width:1280,height:720},true);p=s.p;await p.touchscreen.tap(640,475);await sleep(p,350);const before=await state(p);const cdp=await p.context().newCDPSession(p);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:900,y:420}]});await sleep(p,700);await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:1060,y:450}]});await sleep(p,700);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});const after=await state(p);assert(after.shipX>before.shipX+40);report.checks.push({touch:true,shipXBefore:before.shipX,shipXAfter:after.shipX});await shot(p,'08-mobile-landscape.png');await p.setViewportSize({width:720,height:1280});await sleep(p,400);assert.equal((await state(p)).state,'rotate');await shot(p,'09-mobile-portrait.png');await close(s);

 report.viewportChecks=[{width:1920,height:1080},{width:1280,height:720},{width:720,height:1280}];
 fs.writeFileSync(path.join(root,'docs/visualbugfix09b-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}
main().catch(e=>{report.failure=e.stack;fs.writeFileSync(path.join(root,'docs/visualbugfix09b-report.json'),JSON.stringify(report,null,2));console.error(e.stack);process.exit(1);});
