const vm=require('vm'),fs=require('fs'),assert=require('assert');
async function fixture(delayed=false){
 let callbacks,initCount=0,ready=0,starts=0,stops=0;const events={},listeners={};
 const sdk={environment:{i18n:{lang:'ru'}},on:(k,f)=>events[k]=f,features:{LoadingAPI:{ready(){ready++;}},GameplayAPI:{start(){starts++;},stop(){stops++;}}},adv:{showRewardedVideo:({callbacks:c})=>callbacks=c}};
 const context={console,setTimeout:(f,ms)=>setTimeout(f,delayed&&ms===10000?1:ms),clearTimeout,Promise,Set,location:{hostname:'localhost'},localStorage:{getItem:()=>null},document:{hidden:false,hasFocus:()=>true,documentElement:{},addEventListener:(k,f)=>listeners[k]=f},YaGames:{init:async()=>{initCount++;if(delayed)await new Promise(r=>setTimeout(r,30));return sdk;}},addEventListener:(k,f)=>listeners[k]=f};context.window=context;
 vm.runInNewContext(fs.readFileSync('assets/game/yandex-production.js','utf8'),context);const api=context.__osYandex;await api.init();return{api,events,context,sdk,get callbacks(){return callbacks},counts:()=>({initCount,ready,starts,stops})};
}
(async()=>{const f=await fixture();assert.equal(f.counts().ready,0);f.api.ready();f.api.ready();assert.equal(f.counts().ready,1);f.api.gameplayStart();f.api.gameplayStart();assert.equal(f.counts().starts,1);
 let p=f.api.showRewarded();await Promise.resolve();assert.equal(await f.api.showRewarded(),false);f.callbacks.onOpen();f.callbacks.onClose();assert.equal(await p,false);
 p=f.api.showRewarded();await new Promise(setImmediate);f.callbacks.onOpen();f.callbacks.onRewarded();f.callbacks.onRewarded();f.callbacks.onClose();f.callbacks.onClose();assert.equal(await p,true);
 p=f.api.showRewarded();await new Promise(setImmediate);f.callbacks.onError();f.callbacks.onRewarded();f.callbacks.onClose();assert.equal(await p,false);
 f.events.game_api_pause();assert(f.api.isPaused());f.api.gameplayStop();f.events.game_api_resume();assert(!f.api.isPaused());const c=f.counts();assert.equal(c.initCount,1);
 f.sdk.adv.showRewardedVideo=()=>{throw Error('offline')};assert.equal(await f.api.showRewarded(),false);
 const late=await fixture(true);assert.equal(await late.api.showRewarded(),false);late.api.ready();await new Promise(r=>setTimeout(r,50));let lp=late.api.showRewarded();await new Promise(setImmediate);late.callbacks.onRewarded();late.callbacks.onClose();assert.equal(await lp,true);assert.equal(late.counts().ready,1);
 fs.writeFileSync('docs/yandex-ads-unit.json',JSON.stringify({pass:true,checks:['ready deferred and once','init once','duplicate click rejected','close without reward false','duplicate reward callback one settlement','error then late reward false','SDK pause/menu resume','synchronous SDK exception false','late SDK after startup timeout restores ads (accelerated timer fixture)'],counts:c},null,2));console.log('PASS SDK adapter unit contract');
})();
