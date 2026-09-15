const{open,read,click,save}=require('./closeout-lib'),assert=require('assert');
(async()=>{const q=await open(),p=q.p,rows=[];
try{await click(p,'ButtonBg');for(const action of ['double','revive','reroll'])for(const scenario of ['success','close','error','duplicateReward','duplicateClose','doubleClick','busy','late']){
 const row={action,scenario};rows.push(row);
 await p.evaluate(action=>{const v=scene15.getVariables();v.get('GameState').setString(action==='double'?'result':action==='revive'?'fail':'upgrades');v.get('Credits').setNumber(1000);v.get('DeliveredValue').setNumber(100);v.get('DoubleRewardUsed').setNumber(0);v.get('SecondChanceUsed').setNumber(0);v.get('RerollCount').setNumber(0);v.get('TechParts').setNumber(10);window.oldCallbacks=window.__adCallbacks;},action);await p.waitForTimeout(220);
 const before=await p.evaluate(()=>Object.fromEntries(['Credits','SecondChanceUsed','OfferSeed'].map(k=>[k,scene15.getVariables().get(k).getAsNumber()])));
 await click(p,action==='reroll'?'SystemButtonBg':'RewardButtonBg');assert(await p.evaluate(()=>__osYandex.isPaused()));const phase=await p.evaluate(()=>scene15.__os.phase);await p.waitForTimeout(100);assert.equal(await p.evaluate(()=>scene15.__os.phase),phase);assert.equal(await p.evaluate(()=>scene15.__audio16.ctx?.state),'suspended');
 if(scenario==='doubleClick')await click(p,action==='reroll'?'SystemButtonBg':'RewardButtonBg');
 if(scenario==='busy')assert.equal(await p.evaluate(()=>__osYandex.showRewarded()),false);
 if(scenario==='late')await p.evaluate(()=>{oldCallbacks?.onRewarded();oldCallbacks?.onClose();});
 await p.evaluate(scenario=>{const c=__adCallbacks;if(scenario==='error')c.onError(new Error('LOCAL QA controlled error'));else if(scenario==='close')c.onClose();else{c.onRewarded();if(scenario==='duplicateReward')c.onRewarded();c.onClose();if(scenario==='duplicateClose')c.onClose();}},scenario);await p.waitForTimeout(200);
 const after=await p.evaluate(()=>Object.fromEntries(['Credits','SecondChanceUsed','OfferSeed'].map(k=>[k,scene15.getVariables().get(k).getAsNumber()]))),ok=!['error','close'].includes(scenario);
 const key=action==='double'?'Credits':action==='revive'?'SecondChanceUsed':'OfferSeed',expected=ok?(action==='double'?100:1):0;
 row.before=before;row.after=after;row.delta=after[key]-before[key];assert.equal(row.delta,expected);assert(!await p.evaluate(()=>__osYandex.isPaused()));row.pass=true;
 }
}catch(e){rows.at(-1).failure=e.stack;}finally{save('ads',{rows,errors:q.errors,pass:rows.length===24&&rows.every(r=>r.pass),transport:'LOCAL QA SDK route only; production resources unchanged'});await q.browser.close();console.log(rows.filter(r=>!r.pass));}})();
