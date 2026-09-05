const {fs,path,assert,root,sleep,state,click,steer,launch}=require('./smart08-play');
const cfg=require('./smart08-config');
const out=path.join(root,'screenshots','IntegratedPass10');
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
const url='http://127.0.0.1:4224/index.html?dev=1';
const report={pass:'Integrated Pass 10',screenshots:[],checks:{},errors:[]};
const shot=async(p,name)=>{await p.screenshot({path:path.join(out,name)});report.screenshots.push(name);};
async function attachScene(p){await p.evaluate(()=>{const proto=gdjs.RuntimeScene.prototype,old=proto.renderAndStep;if(!window.__pass10SceneHook){window.__pass10SceneHook=true;proto.renderAndStep=function(...args){window.__pass10Scene=this;return old.apply(this,args);};}});await sleep(p,100);}
async function setValues(p,values){await p.evaluate(values=>{const v=window.__pass10Scene.getVariables();for(const [name,value] of Object.entries(values)){const item=v.get(name);typeof value==='string'?item.setString(value):item.setNumber(value);}},values);await sleep(p,180);}
async function objectCenter(p,name,index=0){return p.evaluate(([name,index])=>{const o=window.__pass10Scene.getObjects(name)[index];return {x:o.getX()+o.getWidth()/2,y:o.getY()+o.getHeight()/2};},[name,index]);}
async function clickObject(p,name,index=0){const point=await objectCenter(p,name,index);return click(p,point.x,point.y);}
async function run(){
 let offersBefore=[];
 const desktop=await launch(url,{width:1920,height:1080});const {p,browser,errors}=desktop;
 try{
  await attachScene(p);await shot(p,'01-menu-1920x1080.png');
  await clickObject(p,'ButtonBg');assert.equal((await state(p)).state,'play');await shot(p,'02-sector1-start.png');
  await steer(p,cfg.scrap[1][0],cfg.scrap[1][1]);await steer(p,cfg.scrap[2][0],cfg.scrap[2][1]);await shot(p,'03-sector1-cluster.png');await p.keyboard.press('F3');await sleep(p,150);assert.equal((await state(p)).dev,true);await shot(p,'07-dev-hud.png');await p.keyboard.press('F3');await sleep(p,120);
  const beforeHit=await state(p);await steer(p,cfg.hazard[0][0],cfg.hazard[0][1],35);await sleep(p,250);const afterHit=await state(p);report.checks.collision={beforeHull:beforeHit.hull,afterHull:afterHit.hull};await shot(p,'04-hit-feedback.png');if(afterHit.state==='fail'){await setValues(p,{GameState:'play',Hull:3,RunDamage:0});await p.evaluate(()=>{window.__pass10Scene.__os.inv=1;});await sleep(p,120);}
  await setValues(p,{GameState:'result',Cargo:4,ScrapCount:4,CargoValue:68,ContractRewardEarned:45,Credits:113});await sleep(p,250);assert.equal((await state(p)).state,'result');await shot(p,'05-result.png');
  await clickObject(p,'ResultButtonBg',0);assert.equal((await state(p)).state,'upgrades');await setValues(p,{Credits:420,TechParts:2,Offer1:'shield',Offer2:'assist',Offer3:'contract'});await shot(p,'06-upgrades-modules.png');
  offersBefore=(await state(p)).offers.slice();await p.keyboard.press('F4');await sleep(p,150);const afterF4=await state(p);assert.equal(afterF4.credits,670);report.checks.devCredits=true;
  await p.keyboard.press('F6');await sleep(p,150);report.checks.devNextContract=(await state(p)).missionType;
  await p.keyboard.press('F8');await sleep(p,250);assert.equal((await state(p)).state,'sectorSelect');await shot(p,'08-sector-select.png');
  await clickObject(p,'SectorSelectButtonBg',1);await sleep(p,400);assert.equal((await state(p)).sector,2);assert.equal((await state(p)).state,'play');await shot(p,'09-sector2-field.png');
  await steer(p,cfg.danger.x,cfg.danger.y,70);await sleep(p,200);await shot(p,'10-sector2-danger.png');
  await sleep(p,500);const mouseState=await state(p);await p.mouse.move(1500,900);await sleep(p,300);const movedState=await state(p);assert(Math.hypot(mouseState.shipX-movedState.shipX,mouseState.shipY-movedState.shipY)<10,'Наведение мыши не должно задавать кораблю новый курс');report.checks.mouseDoesNotSteer=true;
  report.errors.push(...errors);
 } finally {await browser.close();}
 const responsive=await launch(url,{width:1366,height:768});try{await attachScene(responsive.p);await shot(responsive.p,'11-menu-1366x768.png');await clickObject(responsive.p,'ButtonBg');await sleep(responsive.p,300);await shot(responsive.p,'12-hud-1366x768.png');report.errors.push(...responsive.errors);}finally{await responsive.browser.close();}
 const mobile=await launch(url,{width:1280,height:720},true);try{await attachScene(mobile.p);await clickObject(mobile.p,'ButtonBg');await sleep(mobile.p,250);await mobile.p.touchscreen.tap(960,500);await shot(mobile.p,'13-mobile-landscape.png');report.checks.touch=true;report.errors.push(...mobile.errors);}finally{await mobile.browser.close();}
 const portrait=await launch(url,{width:720,height:1280},true);try{await attachScene(portrait.p);assert.equal((await state(portrait.p)).state,'rotate');await shot(portrait.p,'14-mobile-portrait.png');report.errors.push(...portrait.errors);}finally{await portrait.browser.close();}
 report.checks.offersBefore=offersBefore;report.checks.runtimeErrors=report.errors;report.checks.jsonAudit=require('child_process').execFileSync(process.execPath,['scripts/audit-project.js'],{cwd:root,encoding:'utf8'});fs.writeFileSync(path.join(root,'docs','integrated-pass10-qa.json'),JSON.stringify(report,null,2));if(report.errors.length)throw new Error(report.errors.join('\n'));
}
run().catch(error=>{console.error(error.stack);process.exit(1);});
