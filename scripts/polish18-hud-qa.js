process.env.OS_QA_PORT='4235';const {open,click,read,assert,fs}=require('./release17-qa-lib');
(async()=>{const q=await open({width:1366,height:768}),p=q.p,r={titles:[],errors:[]};fs.mkdirSync('screenshots/Polish18',{recursive:true});try{
 await click(p,'ButtonBg');assert.ok(await p.evaluate(()=>!!scene15.__world18));
 for(const title of ['СЛЕД ПРОПАВШЕГО СУДНА','СПАСАТЕЛЬНЫЙ ПРОТОКОЛ','ВОССТАНОВИТЬ ПОВРЕЖДЁННЫЙ РЕТРАНСЛЯТОР','ДОСТАВИТЬ КОНТЕЙНЕР БЕЗ ПОВРЕЖДЕНИЙ']){
  await p.evaluate(title=>{const v=scene15.getVariables();v.get('Mission').setString(title);v.get('MissionTimeLimit').setNumber(120);},title);await p.waitForTimeout(180);
  const a=await p.evaluate(()=>{const o=scene15.getObjects('MissionText')[0],pr=scene15.getObjects('MissionProgress16')[0],rw=scene15.getObjects('MissionReward16')[0],panel=scene15.getObjects('MissionPanel')[0];return {text:o.getString(),x:o.getX(),right:o.getX()+o.getWidth(),y:o.getY(),height:o.getHeight(),progressY:pr.getY(),rewardY:rw.getY(),panelX:panel.getX(),panelRight:panel.getX()+panel.getWidth(),panelBottom:panel.getY()+panel.getHeight()};});assert.ok(a.y+a.height<a.progressY);assert.ok(a.right<=a.panelRight-24);assert.ok(a.rewardY<a.panelBottom-20);r.titles.push(a);
 }
 await p.screenshot({path:'screenshots/Polish18/hud-long-timed.png'});
 r.loot=await p.evaluate(()=>Object.fromEntries(['ProcScrap','ProcEnergy','ProcData','ProcHeavy','G13Key'].map(n=>[n,{w:scene15.getObjects(n)[0].getWidth(),h:scene15.getObjects(n)[0].getHeight()}])));
 const a=await read(p);await p.mouse.move(1150,550);await p.waitForTimeout(600);const b=await read(p);r.hoverDistance=Math.hypot(a.shipX-b.shipX,a.shipY-b.shipY);assert.ok(r.hoverDistance<1);
 await p.keyboard.press('Escape');await p.waitForTimeout(200);const t=(await read(p)).runTime;await p.waitForTimeout(600);assert.equal((await read(p)).runTime,t);r.escape=true;
 await p.getByRole('button',{name:'НАСТРОЙКИ',exact:true}).click();await p.screenshot({path:'screenshots/Polish18/audio-settings.png'});
 }catch(e){r.failure=e.stack;console.error(e);}finally{r.errors=q.errors;fs.writeFileSync('docs/polish18-hud.json',JSON.stringify(r,null,2));await q.browser.close();}})();
