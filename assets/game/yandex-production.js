(function () {
  'use strict';
  // Reject malformed/primitive local JSON before legacy readers access fields.
  for(const key of ['orbitalSalvageSave','orbitalSettings17']){
    try{const raw=localStorage.getItem(key);if(raw){let value;try{value=JSON.parse(raw);}catch{}if(!value||typeof value!=='object'||Array.isArray(value))localStorage.setItem(key,'{}');}}
    catch(e){console.warn('Local storage unavailable');}
  }
  // No hostname/query switch, mock rewards, player mutation or QA surface.
  let sdk, pending, readyWanted=false, readySent=false, wanted=false, playing=false;
  let busy=false, platformPaused=false;
  const pauseListeners=new Set();
  const paused=()=>busy||platformPaused||document.hidden||!document.hasFocus();
  function notify(){for(const f of pauseListeners)f(paused());sync();}
  function sync(){
    if(!sdk)return;
    if(readyWanted&&!readySent){readySent=true;try{sdk.features.LoadingAPI.ready();}catch(e){console.warn('Game Ready unavailable',e);}}
    const next=wanted&&!paused();if(next===playing)return;playing=next;
    try{sdk.features.GameplayAPI?.[next?'start':'stop']();}catch(e){console.warn('Gameplay API unavailable',e);}
  }
  function init(){
    if(pending)return pending;
    pending=new Promise(resolve=>{
      let finished=false;
      const finish=value=>{if(finished)return;finished=true;resolve(value);};
      const limit=setTimeout(()=>finish(null),10000);
      const connect=()=>{
        if(typeof YaGames==='undefined'){finish(null);clearTimeout(limit);return;}
        Promise.resolve().then(()=>YaGames.init()).then(value=>{
          sdk=value;
          const lang=sdk.environment?.i18n?.lang||'ru';
          // This release declares Russian only; unsupported languages use RU.
          document.documentElement.lang=({ru:'ru'})[lang]||'ru';
          sdk.on?.('game_api_pause',()=>{platformPaused=true;notify();});
          sdk.on?.('game_api_resume',()=>{platformPaused=false;notify();});
          sync();clearTimeout(limit);finish(sdk);
        }).catch(e=>{console.warn('SDK temporarily unavailable',e);clearTimeout(limit);finish(null);});
      };
      if(typeof YaGames!=='undefined')connect();
      else{const script=document.createElement('script');script.src='/sdk.js';script.onload=connect;script.onerror=()=>{clearTimeout(limit);finish(null);};document.head.appendChild(script);}
    });return pending;
  }
  async function showRewarded(){
    if(busy)return false;
    busy=true;notify();
    await init();
    // Startup timeout must not permanently disable ads after a late SDK success.
    const api=sdk;
    if(!api?.adv?.showRewardedVideo){busy=false;notify();return false;}
    return new Promise(resolve=>{
      let rewarded=false,settled=false,opened=false;
      const finish=ok=>{if(settled)return;settled=true;clearTimeout(timer);busy=false;notify();resolve(ok);};
      // A stalled request must not trap the player. Once open, only SDK closes it.
      const timer=setTimeout(()=>{if(!opened)finish(false);},15000);
      try{api.adv.showRewardedVideo({callbacks:{
        onOpen(){if(!settled)opened=true;},
        onRewarded(){if(!settled)rewarded=true;},
        onClose(){finish(rewarded);},
        onError(){finish(false);}
      }});}catch(e){finish(false);}
    });
  }
  window.addEventListener('blur',notify);window.addEventListener('focus',notify);
  document.addEventListener('visibilitychange',notify);
  // Registered before engine/UI listeners: paused controls must not resume audio
  // or change screens underneath platform overlays.
  for(const type of ['pointerdown','pointerup','click','keydown'])window.addEventListener(type,e=>{
    if(paused()){e.stopImmediatePropagation();if(e.cancelable)e.preventDefault();}
  },true);
  Object.defineProperty(window,'__osYandex',{value:Object.freeze({
    init,ready(){readyWanted=true;sync();},
    gameplayStart(){wanted=true;sync();},gameplayStop(){wanted=false;sync();},
    isPaused:paused,subscribePause(f){pauseListeners.add(f);f(paused());return()=>pauseListeners.delete(f);},showRewarded
  }),writable:false,configurable:false});
  init();
}());
