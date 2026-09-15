const {open,read,click,save}=require('./closeout-lib'),assert=require('assert'),fs=require('fs');
(async()=>{const q=await open(),p=q.p,r={events:[],responsive:[],saveCases:[]};
try{
 for(const state of ['menu','play','pause17','journal17','result','upgrades','sectorSelect']){
  await p.evaluate(st=>{if(st==='play')scene15.__start17();else scene15.getVariables().get('GameState').setString(st)},state);await p.waitForTimeout(250);
  const row=await p.evaluate(()=>{const targets=[document.querySelector('canvas'),...document.querySelectorAll('#shell17 button')].filter(Boolean);return targets.map(t=>({tag:t.tagName,events:['contextmenu','selectstart','dragstart'].map(type=>{const e=new Event(type,{bubbles:true,cancelable:true});t.dispatchEvent(e);return e.defaultPrevented}),select:getComputedStyle(t).userSelect,callout:t.style.webkitTouchCallout||getComputedStyle(t).webkitTouchCallout||null}));});
  assert(row.length&&row.every(t=>t.events.every(Boolean)));r.events.push({state,targets:row,pass:true});
 }
 fs.mkdirSync('screenshots/YandexCloseout',{recursive:true});
 for(const [w,h] of [[1920,1080],[1600,900],[1536,864],[1440,900],[1366,768],[1280,720],[1917,920],[844,390],[780,360],[720,360],[640,360],[390,844],[412,915]]){
  await p.setViewportSize({width:w,height:h});await p.evaluate(()=>scene15.getVariables().get('GameState').setString('menu'));await p.waitForTimeout(300);
  const b=await p.evaluate(()=>({x:document.documentElement.scrollWidth-innerWidth,y:document.documentElement.scrollHeight-innerHeight,canvas:[...document.querySelectorAll('canvas')].map(o=>{const b=o.getBoundingClientRect();return{x:b.x,y:b.y,w:b.width,h:b.height}})}));
  await p.screenshot({path:`screenshots/YandexCloseout/responsive-${w}x${h}.png`});r.responsive.push({w,h,...b,pass:b.x<=0&&b.y<=0});assert(b.x<=0&&b.y<=0);
 }
 await p.setViewportSize({width:1280,height:720});
 for(const raw of ['', 'null','[]','{}','{broken','{"Credits":"oops"}','{"Credits":"NaN"}','{"Credits":-42}','{"Credits":1e100}','{"CargoMax":10}','{"Credits":55}']){
  await p.evaluate(raw=>{localStorage.setItem('orbitalSalvageSave',raw);localStorage.setItem('orbitalSettings17','{"sfx":false}')},raw);await p.reload();await p.waitForFunction(()=>window.__osQAState?.state==='menu');const s=await read(p);r.saveCases.push({raw,state:s.state,credits:s.credits,pass:true});
 }
 r.pass=true;
}catch(e){r.failure=e.stack;r.pass=false;}finally{r.errors=q.errors;if(r.errors.length)r.pass=false;save('dom',r);await q.browser.close();console.log(r);}})();
