const {fs,path,assert,root,sleep,state,click,steer,launch}=require('./smart08-play');
const out=path.join(root,'screenshots','ReleaseCandidateExpansion11');
const report={pass:'Release Candidate Expansion 11',screenshots:[],checks:{},errors:[]};
const url='http://127.0.0.1:4225/index.html?dev=1';
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
const shot=async(p,name)=>{await p.screenshot({path:path.join(out,name)});report.screenshots.push(name);};
async function attach(p){await p.evaluate(()=>{const proto=gdjs.RuntimeScene.prototype,original=proto.renderAndStep;if(window.__rc11Hook)return;window.__rc11Hook=true;proto.renderAndStep=function(...args){window.__rc11Scene=this;return original.apply(this,args);};});await sleep(p,100);}
async function vars(p,values){await p.evaluate(values=>{const v=window.__rc11Scene.getVariables();for(const [name,value] of Object.entries(values)){const item=v.get(name);typeof value==='string'?item.setString(value):item.setNumber(value);}},values);await sleep(p,160);}
async function objClick(p,name,index=0){const point=await p.evaluate(([name,index])=>{const o=window.__rc11Scene.getObjects(name)[index];return{x:o.getX()+o.getWidth()/2,y:o.getY()+o.getHeight()/2};},[name,index]);return click(p,point.x,point.y);}
async function main(){
 const session=await launch(url,{width:1920,height:1080});const {p,browser,errors}=session;
 try{
  await attach(p);await shot(p,'01-main-menu.png');await objClick(p,'ButtonBg');assert.equal((await state(p)).state,'play');await shot(p,'02-sector1-start.png');
  await steer(p,1189,980,65);await steer(p,1869,1100,65);await shot(p,'03-debris-field.png');await steer(p,2334,1260,65);await shot(p,'05-world-density.png');
  await steer(p,1383,850,45);await sleep(p,180);await shot(p,'06-hit-feedback.png');
  await vars(p,{GameState:'fail',SecondChanceUsed:1});await shot(p,'07-death-screen.png');
  await vars(p,{GameState:'result',Cargo:4,ScrapCount:4,CargoValue:70,ContractRewardEarned:45,Credits:115});await shot(p,'08-result.png');
  await vars(p,{GameState:'upgrades',Credits:500,TechParts:10,Offer1:'repair',Offer2:'scanner',Offer3:'shield'});await shot(p,'09-upgrades.png');
  await p.keyboard.press('F8');await sleep(p,180);assert.equal((await state(p)).state,'sectorSelect');await shot(p,'10-sector-select.png');await objClick(p,'SectorSelectButtonBg',1);await sleep(p,250);assert.equal((await state(p)).sector,2);await shot(p,'11-sector2.png');
  await p.evaluate(()=>{const s=window.__rc11Scene.__os;s.phase=3;s.x=3400;s.y=850;s.vx=0;s.vy=0;window.__rc11Scene.__osCam={x:3400,y:850};window.__rc11Scene.getObjects('Ship')[0].setCenterPositionInScene(3400,850);});await sleep(p,120);await shot(p,'04-meteor-stream.png');
  await p.evaluate(()=>{const s=window.__rc11Scene.__os;s.x=5290;s.y=1080;s.vx=0;s.vy=0;window.__rc11Scene.getObjects('Ship')[0].setCenterPositionInScene(5290,1080);});await sleep(p,220);await shot(p,'12-portal-locked.png');
  await p.evaluate(()=>{const s=window.__rc11Scene.__os;s.x=4412;s.y=2168;s.vx=0;s.vy=0;window.__rc11Scene.getObjects('Ship')[0].setCenterPositionInScene(4412,2168);});await sleep(p,220);await shot(p,'13-access-key.png');
  await p.evaluate(()=>{const s=window.__rc11Scene.__os;s.x=5355;s.y=1065;s.vx=0;s.vy=0;window.__rc11Scene.getObjects('Ship')[0].setCenterPositionInScene(5355,1065);});await sleep(p,500);await shot(p,'14-portal-active.png');
  await p.keyboard.press('F9');await sleep(p,350);await shot(p,'15-secret-zone.png');await sleep(p,900);await shot(p,'16-laser-challenge.png');
  await p.evaluate(()=>{const s=window.__rc11Scene.__os;s.x=5859;s.y=2584;s.vx=0;s.vy=0;window.__rc11Scene.getObjects('Ship')[0].setCenterPositionInScene(5859,2584);});await sleep(p,300);await shot(p,'17-secret-cache.png');
  report.checks.secretCache=await state(p);report.errors.push(...errors);
 }finally{await browser.close();}
 const mobile=await launch(url,{width:1280,height:720},true);try{await attach(mobile.p);await objClick(mobile.p,'ButtonBg');await mobile.p.touchscreen.tap(930,440);await sleep(mobile.p,180);await shot(mobile.p,'18-mobile-landscape.png');report.errors.push(...mobile.errors);report.checks.touch=true;}finally{await mobile.browser.close();}
 const portrait=await launch(url,{width:720,height:1280},true);try{await attach(portrait.p);assert.equal((await state(portrait.p)).state,'rotate');await shot(portrait.p,'19-mobile-portrait.png');report.errors.push(...portrait.errors);}finally{await portrait.browser.close();}
 report.checks.audit=JSON.parse(require('child_process').execFileSync(process.execPath,['scripts/audit-project.js'],{cwd:root,encoding:'utf8'}));report.checks.runtimeErrors=report.errors;fs.writeFileSync(path.join(root,'docs','release11-qa.json'),JSON.stringify(report,null,2));if(report.errors.length)throw new Error(report.errors.join('\n'));
}
main().catch(error=>{console.error(error.stack);process.exit(1);});
