process.env.OS_QA_PORT='4236';const {open,click,read,fs,assert}=require('./release17-qa-lib');
(async()=>{const report={mode:'fresh keyboard top approach; isolated side/bottom starting fixtures followed by real input',views:[],errors:[]};
for(const[w,h,mobile]of[[1920,1080,false],[1600,900,false],[1536,864,false],[1366,768,false],[1280,720,false],[1917,920,false],[1280,720,true],[720,1280,true]]){
 const q=await open({width:w,height:h},mobile),p=q.p,r={w,h,mobile};
 const shot=n=>p.screenshot({path:'screenshots/Polish19/'+n+'.png'});
 try{const c=await p.evaluate(()=>{const r=document.querySelector('canvas').getBoundingClientRect();return {w:r.width,h:r.height};});assert.ok(Math.abs(c.w-w)<2&&Math.abs(c.h-h)<2);r.fullViewport=true;
 if(h>w){assert.equal((await read(p)).state,'rotate');await shot('portrait-720x1280');continue;}
 await click(p,'ButtonBg');const start=await read(p);await p.mouse.move(w*.8,h*.7);await p.waitForTimeout(400);assert.ok(Math.hypot((await read(p)).shipX-start.shipX,(await read(p)).shipY-start.shipY)<1);r.hoverSafe=true;
 if(mobile){const cdp=await q.context.newCDPSession(p);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:w*.7,y:h*.6}]});await p.waitForTimeout(700);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});r.touchDistance=Math.hypot((await read(p)).shipX-start.shipX,(await read(p)).shipY-start.shipY);assert.ok(r.touchDistance>20);await cdp.detach();}
 await p.evaluate(()=>{window.__safeSamples19=[];const f=gdjs.RuntimeScene.prototype.renderAndStep;gdjs.RuntimeScene.prototype.renderAndStep=function(...a){const r=f.apply(this,a),s=this.__os,c=this.__osCam;if(s&&c){const W=this.getGame().getGameResolutionWidth();window.__safeSamples19.push({x:W/2+(s.x-c.x)*2,y:540+(s.y-c.y)*2,cx:c.x,cy:c.y,sx:s.x,sy:s.y});}return r;};});
 await p.keyboard.down('w');await p.waitForTimeout(5000);await p.keyboard.up('w');await p.waitForTimeout(400);
 const a=await p.evaluate(()=>window.__safeSamples19),last=a.at(-1);assert.ok(last.y-36>=270+24*1080/h,'top ship clearance');assert.ok(a.every(t=>t.y-36>270),'ship overlapped top HUD during approach');r.topMin=Math.min(...a.map(t=>t.y-36));r.maxCameraStep=Math.max(...a.slice(1).map((t,i)=>Math.hypot(t.cx-a[i].cx,t.cy-a[i].cy)));assert.ok(r.maxCameraStep<40,'camera discontinuity');
 await shot('safe-'+w+'x'+h+(mobile?'-touch':''));if(w===1920)await shot('12-top-HUD-safe-zone');
 for(const[side,x,y,key]of[['left',320,900,'a'],['right',5900,900,'d'],['bottom',3200,2670,'s']]){
 await p.evaluate(({x,y})=>{const s=scene15.__os;Object.assign(s,{x,y,vx:0,vy:0,inv:0});scene15.__osCam={x,y};scene15.getObjects('Ship')[0].setCenterPositionInScene(x,y);},{x,y});await p.keyboard.down(key);await p.waitForTimeout(2200);await p.keyboard.up(key);await p.waitForTimeout(400);
 const t=await p.evaluate(()=>window.__safeSamples19.at(-1)),W=w*1080/h;assert.ok(t.x>=38&&t.x<=W-38&&t.y+38<=880,side+' clearance');r[side]=t;if(w===1920&&side!=='bottom')await shot(side==='left'?'13-left-HUD-safe-zone':'14-right-HUD-safe-zone');}
 await p.keyboard.press('Escape');const time=(await read(p)).runTime;await p.waitForTimeout(400);assert.equal((await read(p)).runTime,time);r.pause=true;
 }catch(e){r.failure=e.stack;console.error(w,h,e.message);}finally{r.errors=q.errors;report.errors.push(...q.errors);report.views.push(r);await q.browser.close();}
}fs.writeFileSync('docs/polish19-safe-responsive.json',JSON.stringify(report,null,2));console.log(report.views.map(x=>[x.w,x.h,x.failure||'PASS']));})();
