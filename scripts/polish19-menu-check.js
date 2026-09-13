process.env.OS_QA_PORT='4236';
const {open,click,fs,assert}=require('./release17-qa-lib');
(async()=>{const q=await open(),p=q.p,r={errors:[]};try{
 assert.ok(await p.evaluate(()=>scene15.getObjects('Title').every(o=>o.isHidden())));
 await p.screenshot({path:'screenshots/Polish19/01-menu.png'});
 r.silentBeforeGesture=await p.evaluate(()=>scene15.__audio16.ctx?.state);assert.equal(r.silentBeforeGesture,'suspended');
 await click(p,'ButtonBg');await p.keyboard.press('Escape');await p.getByRole('button',{name:'В ГЛАВНОЕ МЕНЮ',exact:true}).click();
 assert.ok(await p.evaluate(()=>scene15.getObjects('Title').every(o=>o.isHidden())));r.menuReturn=true;
 // Explicit visual fixture, after the complete cheat-free route. Capture the
 // unlocked gate before entering, rather than its one-frame scene transition.
 await click(p,'ButtonBg');await p.waitForTimeout(900);await p.evaluate(()=>{const v=scene15.getVariables();v.get('CurrentSector').setNumber(2);v.get('RunTime').setNumber(25);scene15.__g13Generate(230032);const g=scene15.__g13,s=scene15.__os;g.secret.stage=3;g.secret.gate=0;Object.assign(s,{x:g.gate.x-220,y:g.gate.y+30,vx:0,vy:0,inv:0,toast:0,floatLife:0,onboarding:false});scene15.__osCam={x:s.x,y:s.y};scene15.getObjects('Ship')[0].setCenterPositionInScene(s.x,s.y);});
 await p.waitForTimeout(600);r.gateStage=await p.evaluate(()=>scene15.__g13.secret.stage);assert.equal(r.gateStage,3);await p.screenshot({path:'screenshots/Polish19/24-secret-gate.png'});r.gateScreenshot='DEV fixture: unlocked, before entry';
}catch(e){r.failure=e.stack;}finally{r.errors=q.errors;fs.writeFileSync('docs/polish19-menu-check.json',JSON.stringify(r,null,2));await q.browser.close();console.log(r);}})();
