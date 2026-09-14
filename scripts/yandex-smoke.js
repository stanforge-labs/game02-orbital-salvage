const qlib=require('./yandex-qa-lib');
(async()=>{const q=await qlib.open();try{console.log('menu',q.errors);await q.p.getByRole('button',{name:'НАЧАТЬ ВЫЛЕТ',exact:true}).click();await q.p.waitForTimeout(1000);console.log(await q.p.evaluate(()=>({state:__osQAState,calls:__sdkCalls})),q.errors);}finally{await q.browser.close();}})();
