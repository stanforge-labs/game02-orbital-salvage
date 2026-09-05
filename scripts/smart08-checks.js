const {fs,path,assert,root,sleep,state,click,steer,launch,nativeHud}=require('./smart08-play');
const cfg=require('./smart08-config'),url='http://127.0.0.1:4222/index.html?traceCamera',out=path.join(root,'screenshots/SmartPolish08');
const qa={errors:[],fixtures:'Seeded saves below are isolated regression checks, excluded from natural progression.'};
async function hold(p,k,ms){await p.keyboard.down(k);await sleep(p,ms);await p.keyboard.up(k);return state(p);}
async function open(viewport,seed=null,mobile=false){const s=await launch(url,viewport,mobile,seed);return s;}
async function close(s){qa.errors.push(...s.errors);await s.browser.close();}
async function buy(p,id){const before=await state(p),i=before.offers.indexOf(id);assert(i>=0,id+' offered');await click(p,[400,960,1520][i],455);const after=await state(p);assert.equal(after.credits,before.credits-cfg.prices[id]);return after;}
async function readSave(p){return p.evaluate(()=>JSON.parse(localStorage.getItem('orbitalSalvageSave')));}
async function main(){
 let s=await open({width:1920,height:1080},{Credits:1000,TechParts:2,OnboardingSeen:1});let p=s.p;
 await click(p,960,710);qa.engineBefore=(await hold(p,'d',2200)).speed;
 await steer(p,...cfg.scrap[0]);await steer(p,260,700);assert.equal((await state(p)).state,'result');await click(p,700,580);
 // Check actual hover/pressed renderer states, not just clicks.
 await p.mouse.move(50,1050);await sleep(p,100);const normal=await p.screenshot();await p.mouse.move(960,455);await sleep(p,100);const hover=await p.screenshot();assert(!normal.equals(hover),'Hover changes rendered pixels');await p.mouse.down();await sleep(p,100);const pressed=await p.screenshot();assert(!pressed.equals(hover),'Pressed changes rendered pixels');const creditBeforePress=(await state(p)).credits;await p.mouse.up();await sleep(p,250);assert.equal((await state(p)).credits,creditBeforePress-cfg.prices.engine);qa.hover=true;qa.pressed=true;
 await buy(p,'hull');await buy(p,'cargo');await buy(p,'magnet');qa.modulesBeforeReset=await readSave(p);await click(p,890,638);assert.equal((await readSave(p)).TechParts,qa.modulesBeforeReset.TechParts);qa.noWasteReroll=true;
 await click(p,960,930);assert.equal((await state(p)).cargoMax,10);assert.equal((await state(p)).hullMax,4);qa.nextRunHud=await nativeHud(p);assert.match(qa.nextRunHud.HullText,/4\s*\/\s*4/);assert.match(qa.nextRunHud.CargoText,/0\s*\/\s*10/);qa.engineAfter=(await hold(p,'d',2200)).speed;qa.engineChange=qa.engineAfter/qa.engineBefore-1;assert(Math.abs(qa.engineChange-.1)<.02);
 await steer(p,...cfg.scrap[0]);await steer(p,260,700);await click(p,700,580);
 const beforeReset=await readSave(p);await click(p,1350,638);assert.equal((await state(p)).state,'resetConfirm');await click(p,725,690);assert.equal((await state(p)).state,'upgrades');assert.equal((await readSave(p)).Credits,beforeReset.Credits);
 await click(p,1350,638);await click(p,1200,690);const reset=await readSave(p);assert.equal(reset.CargoMax,8);assert.equal(reset.HullMax,3);assert.equal(reset.EngineLevel,0);assert.equal(reset.MagnetLevel,0);assert.equal(reset.Credits,beforeReset.Credits+Math.floor(beforeReset.SpentCredits*.75));assert.equal(reset.TechParts,beforeReset.TechParts-1);qa.reset={before:beforeReset,after:reset};
 await close(s);
 // Camera and both keyboard layouts from a fresh run.
 s=await open({width:1920,height:1080});p=s.p;await click(p,960,710);
 const resting=await state(p);await p.mouse.move(1800,800);await sleep(p,700);assert(Math.hypot((await state(p)).shipX-resting.shipX,(await state(p)).shipY-resting.shipY)<1);qa.hoverDoesNotSteer=true;
 await hold(p,'d',4000);await hold(p,'a',4000);await hold(p,'w',2800);await hold(p,'s',2800);await hold(p,'w',700);await hold(p,'s',700);await hold(p,'a',700);await hold(p,'d',700);
 await p.keyboard.down('w');await hold(p,'d',1200);await p.keyboard.up('w');
 const preArrow=await state(p);await hold(p,'ArrowRight',1300);const postArrow=await state(p);assert(postArrow.shipX>preArrow.shipX+50);qa.arrows=true;
 const rows=await p.evaluate(()=>window.__osCameraTrace);assert(rows.length>300);const min=k=>Math.min(...rows.map(x=>x[k])),max=k=>Math.max(...rows.map(x=>x[k]));qa.camera={rows:rows.length,x:[min('cameraX'),max('cameraX')],y:[min('cameraY'),max('cameraY')],maxDX:Math.max(...rows.map(x=>Math.abs(x.deltaCameraX))),maxDY:Math.max(...rows.map(x=>Math.abs(x.deltaCameraY)))};assert(qa.camera.x[1]-qa.camera.x[0]>100);assert(qa.camera.y[1]-qa.camera.y[0]>100);assert(qa.camera.maxDX<9&&qa.camera.maxDY<9);
 fs.writeFileSync(path.join(root,'docs/camera-trace-smart08.csv'),'time,shipX,shipY,cameraX,cameraY,deltaCameraX,deltaCameraY\n'+rows.map(x=>[x.time,x.shipX,x.shipY,x.cameraX,x.cameraY,x.deltaCameraX,x.deltaCameraY].join(',')).join('\n'));await close(s);
 // Mobile uses actual CDP touch events, never a mouse substitute.
 s=await open({width:1280,height:720},null,true);p=s.p;await p.touchscreen.tap(640,475);await sleep(p,300);assert.equal((await state(p)).state,'play');const touchBefore=await state(p);const cdp=await p.context().newCDPSession(p);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:900,y:420}]});await sleep(p,1600);await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:1020,y:450}]});await sleep(p,800);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});const touchAfter=await state(p);assert(touchAfter.shipX>touchBefore.shipX+100);qa.touch={before:touchBefore.shipX,after:touchAfter.shipX};
 await p.screenshot({path:path.join(out,'12-mobile-landscape.png')});await p.setViewportSize({width:720,height:1280});await sleep(p,400);assert.equal((await state(p)).state,'rotate');const paused=await state(p);await sleep(p,650);assert.equal((await state(p)).runTime,paused.runTime);await p.screenshot({path:path.join(out,'13-mobile-portrait.png')});await p.setViewportSize({width:1280,height:720});await sleep(p,400);assert.equal((await state(p)).state,'play');qa.rotatePauseResume=true;await close(s);
 // Responsive desktop and true backing resolution.
 s=await open({width:1366,height:768});p=s.p;await p.mouse.click(683,504);await sleep(p,400);assert.equal((await state(p)).state,'play');qa.responsive=await p.evaluate(()=>({width:innerWidth,height:innerHeight,dpr:devicePixelRatio,canvas:[...document.querySelectorAll('canvas')].map(c=>({width:c.width,height:c.height,cssWidth:c.clientWidth,cssHeight:c.clientHeight}))}));await p.screenshot({path:path.join(root,'_tmp-export','smart08-1366.png')});await close(s);
 // A damaged fixture exercises insurance on radiation and the second-chance button.
 s=await open({width:1920,height:1080},{CurrentSector:2,SectorUnlocked:1,HullMax:1,Hull:1,InsuranceLevel:1,Credits:0,OnboardingSeen:1});p=s.p;await click(p,960,710);await steer(p,...cfg.scrap2[0]);await steer(p,900,130);await steer(p,cfg.danger.x,130);await steer(p,cfg.danger.x,600);for(let i=0;i<90&&(await state(p)).state==='play';i++)await sleep(p,200);assert.equal((await state(p)).state,'fail');const failSave=await readSave(p);assert(failSave.Credits>0);qa.insurance={paid:failSave.Credits};
 await click(p,960,486);const second=await state(p);assert.equal(second.state,'play');assert.equal(second.hull,1);assert(second.shipX<550);assert.equal((await readSave(p)).SecondChanceUsed,1);qa.secondChance=true;await close(s);
 assert.equal(qa.errors.length,0,JSON.stringify(qa.errors));
 fs.writeFileSync(path.join(root,'docs/smart-polish08-checks.json'),JSON.stringify(qa,null,2));console.log(JSON.stringify(qa));
}
main().catch(e=>{qa.failure=e.stack;fs.writeFileSync(path.join(root,'docs/smart-polish08-checks.json'),JSON.stringify(qa,null,2));console.error(e);process.exit(1);});
