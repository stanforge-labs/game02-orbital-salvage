const{open,save}=require('./closeout-lib'),assert=require('assert');
(async()=>{const q=await open({width:844,height:390},true),p=q.p,r={lives:[],press:[]};try{
 const original=await p.evaluate(()=>localStorage.getItem('orbitalSalvageSave'));
 await p.getByRole('button',{name:'ОРБИТАЛЬНЫЙ ПАТРУЛЬ',exact:true}).tap();await p.waitForTimeout(250);
 const cv=p.locator('canvas[width="960"]'),cdp=await q.context.newCDPSession(p);
 async function move(x){await cv.waitFor({state:'visible'});const b=await cv.boundingBox(),pt={x:b.x+x/960*b.width,y:b.y+b.height*.8};await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...pt,id:1}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{...pt,x:pt.x+1,id:1}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
 await move(100);const left=await p.evaluate(()=>scene15.__arcade16.x);await move(800);const right=await p.evaluate(()=>scene15.__arcade16.x);assert(right-left>500);r.movement={left,right};
 for(let i=0;i<70;i++){const rock=await p.evaluate(()=>scene15.__arcade16.rocks.filter(o=>o.active).sort((a,b)=>b.y-a.y)[0]);if(rock)await move(rock.x);await p.waitForTimeout(100);}
 r.score=await p.evaluate(()=>scene15.__arcade16.score);assert(r.score>0);
 await p.getByRole('button',{name:'Ⅱ ПАУЗА',exact:true}).filter({visible:true}).last().tap();await p.waitForTimeout(150);const clock=await p.evaluate(()=>scene15.__arcade16.clock);await p.waitForTimeout(300);assert.equal(await p.evaluate(()=>scene15.__arcade16.clock),clock);await p.getByRole('button',{name:'ПРОДОЛЖИТЬ',exact:true}).tap();
 await p.evaluate(()=>__sdkEvents.game_api_pause());const platformClock=await p.evaluate(()=>scene15.__arcade16.clock);await p.waitForTimeout(300);assert.equal(await p.evaluate(()=>scene15.__arcade16.clock),platformClock);await p.evaluate(()=>__sdkEvents.game_api_resume());
 await move(25);for(let i=0;i<500;i++){const lives=await p.evaluate(()=>scene15.__arcade16.lives);if(r.lives.at(-1)!==lives)r.lives.push(lives);if(lives===0)break;await p.waitForTimeout(100);}assert.deepEqual(r.lives,[3,2,1,0]);await cv.tap();await p.waitForTimeout(150);assert.equal(await p.evaluate(()=>scene15.__arcade16.lives),3);await p.getByRole('button',{name:'ВЫЙТИ ИЗ ПАТРУЛЯ',exact:true}).tap();assert.equal(await p.evaluate(()=>localStorage.getItem('orbitalSalvageSave')),original);
 r.arcadePass=true;await p.waitForTimeout(300);
 for(const viewport of [{width:844,height:390},{width:780,height:360}]){await p.setViewportSize(viewport);await p.waitForTimeout(250);const b=await p.locator('#shell17 h1:visible').first().boundingBox();await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:b.x+10,y:b.y+10,id:1}]});await p.waitForTimeout(900);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.equal(await p.evaluate(()=>getSelection().toString()),'');r.press.push({viewport,selection:false});}
 r.pass=true;
}catch(e){r.failure=e.stack;r.pass=false;}finally{r.errors=q.errors;r.scope='CDP touch input, DOM layer only; no native OS callout claim';save('touch',r);await q.browser.close();console.log(r);}})();
