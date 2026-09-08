// Explicit isolated QA fixtures. Never used as natural-playthrough evidence.
const {launch,state,sleep,fs,path,root,assert}=require('./smart08-play');
const out=path.join(root,'screenshots/FullReleaseRebuild14');
(async()=>{const b=await launch('http://127.0.0.1:4231/index.html'),p=b.p,report={mode:'isolated DEV fixtures',checks:[],performance:[]};
try{await p.evaluate(()=>{const f=gdjs.RuntimeScene.prototype.renderAndStep;gdjs.RuntimeScene.prototype.renderAndStep=function(...a){window.qaScene=this;return f.apply(this,a);};});await p.waitForFunction(()=>window.qaScene);
const click=async(n,i=0)=>{const q=await p.evaluate(([n,i])=>{const o=qaScene.getObjects(n)[i];return[o.getX()+o.getWidth()/2,o.getY()+o.getHeight()/2]},[n,i]);await p.mouse.click(...q);await sleep(p,200);};
const shot=async n=>p.screenshot({path:path.join(out,n+'.png')});
const place=async(x,y)=>{await p.evaluate(([x,y])=>{const s=qaScene.__os;s.x=x;s.y=y;s.vx=s.vy=0;qaScene.__osCam={x:Math.max(480,Math.min(5720,x)),y:Math.max(270,Math.min(2730,y))};qaScene.getObjects('Ship')[0].setCenterPositionInScene(x,y);},[x,y]);await sleep(p,350);};
await click('ButtonBg');await p.evaluate(()=>qaScene.__g13Generate(130013));
for(const [id,name] of [['debris','04-debris-field'],['graveyard','05-satellite-graveyard'],['meteor','06-meteor-stream']]){let region=await p.evaluate(id=>qaScene.__g13.regions.find(r=>r.id===id),id);if(!region){for(let seed=230027;seed<230045&&!region;seed++){region=await p.evaluate(([seed,id])=>{qaScene.__g13Generate(seed);return qaScene.__g13.regions.find(r=>r.id===id)},[seed,id]);}}assert.ok(region,'region fixture '+id);await place(region.x,region.y);await shot(name);report.checks.push(id);}
await shot('07-sector1-dense');
// Actual collision against a generated hazard; only positioning is a fixture.
const h=await p.evaluate(()=>qaScene.__g13.hazards[0]);const before=(await state(p)).hull;await place(h.x,h.y);await sleep(p,200);const after=(await state(p)).hull;assert.ok(after<before);await shot('08-hit-feedback');report.checks.push({collision:{before,after}});
await p.evaluate(()=>{qaScene.getVariables().get('GameState').setString('fail');});await sleep(p,150);await shot('10-death');const empty=await p.evaluate(()=>qaScene.getObjects('ResultButtonBg').filter(o=>!o.isHidden()).length);assert.equal(empty,1);await click('RewardButtonBg');assert.equal((await state(p)).state,'play');assert.equal((await state(p)).hull,1);report.checks.push('localhost second chance');
await p.evaluate(()=>{const v=qaScene.getVariables();v.get('GameState').setString('result');v.get('DeliveredValue').setNumber(90);v.get('DoubleRewardUsed').setNumber(0);});await sleep(p,150);const c=(await state(p)).credits;await click('RewardButtonBg');assert.equal((await state(p)).credits,c+90);report.checks.push('localhost reward x2');await shot('25-rewarded');
await click('ResultButtonBg');await p.keyboard.press('F4');await sleep(p,160);await click('RerollButtonBg');await shot('26-reroll');const offers=(await state(p)).offers.join();await click('SystemButtonBg');assert.notEqual((await state(p)).offers.join(),offers);report.checks.push('localhost ad reroll');
await p.keyboard.press('F4');await sleep(p,160);await click('UpgradeButtonBg');await p.keyboard.press('F4');await sleep(p,160);await click('ResetButtonBg');await shot('27-reset');assert.equal((await state(p)).state,'resetConfirm');await click('ResetConfirmCancelBg');
await p.keyboard.press('F8');await sleep(p,150);await click('SectorSelectButtonBg',1);await p.keyboard.press('F3');await sleep(p,180);await p.keyboard.press('F9');await sleep(p,300);assert.equal((await state(p)).secretStage,4);await shot('28-dev-secret');report.checks.push('F3/F4/F8/F9');
await p.evaluate(()=>{qaScene.__g13.secret.stage=0;qaScene.getVariables().get('Hull').setNumber(4);});await place(4000,1100);await p.keyboard.press('F3');await sleep(p,150);await shot('14-sector2-danger');await shot('29-sector2-world');
const seeds=[];for(const seed of [130013,230027,330037,430049,530051]){const result=await p.evaluate(seed=>{qaScene.__g13Generate(seed);qaScene.__g13.secret.stage=4;return qaScene.__g13.validation;},seed);await place(5000,2320);const geometry=await p.evaluate(()=>{const q=qaScene.__g13.secret;return{template:q.template,route:q.route,walls:q.walls};});assert.equal(geometry.route.length,6);assert.ok(geometry.route.every(([x,y])=>geometry.walls.every(([a,b,w,h])=>!(x>a-16&&x<a+w+16&&y>b-16&&y<b+h+16))));seeds.push({...result,geometry});}
report.deepSeeds=seeds;
const key=await p.evaluate(()=>{qaScene.__g13.secret.stage=1;return qaScene.__g13.key;});await place(key.x-180,key.y);await shot('16-access-key');
const working=await p.evaluate(()=>{qaScene.__g13.secret.stage=0;return qaScene.__g13.regions[0];});await place(working.x,working.y);await shot('03-working-orbit');
await p.evaluate(()=>{qaScene.__g13.secret.stage=0;qaScene.getVariables().get('GameState').setString('play');});await place(260,700);await sleep(p,300);await shot('30-empty-return');
report.errors=b.errors;
}finally{fs.writeFileSync(path.join(root,'docs/release14-fixtures.json'),JSON.stringify(report,null,2));await b.browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
