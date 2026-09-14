module.exports=function releaseLifecycle(scene){
 if(scene.__releaseLifecycle)return;scene.__releaseLifecycle=true;
 const api=window.__osYandex,a=scene.__audio16;
 api?.subscribePause(on=>{
  if(scene.__osPointer){scene.__osPointer.active=false;scene.__osPointer.down=false;}
  if(scene.__arcade16)scene.__arcade16.keys={};
  if(a?.ctx){if(on)a.ctx.suspend().catch(()=>{});else a.ctx.resume().catch(()=>{});}
 });
 if(a){const unlock=a.unlock;a.unlock=()=>{if(!api?.isPaused())unlock();};}
 document.addEventListener('contextmenu',e=>e.preventDefault());
 const shell=scene.__ui17,v=scene.getVariables(),state=s=>v.get('GameState').setString(s);
 const pause=document.createElement('button');pause.textContent='Ⅱ ПАУЗА';pause.onclick=()=>state('arcadePause');shell.toolbar.appendChild(pause);
 const modal=document.createElement('div');modal.className='overlay';modal.style.display='none';modal.innerHTML='<section class="card"><h1>ПАТРУЛЬ НА ПАУЗЕ</h1><div class="actions"><button class="primary">ПРОДОЛЖИТЬ</button><button>ВЫЙТИ ИЗ ПАТРУЛЯ</button></div></section>';shell.root.appendChild(modal);
 modal.querySelector('.primary').onclick=()=>state('arcade');modal.querySelectorAll('button')[1].onclick=()=>shell.exitArcade();
 scene.__releaseUITick=()=>{const s=v.get('GameState').getAsString();pause.hidden=s!=='arcade';modal.style.display=s==='arcadePause'?'flex':'none';};
 const css=document.createElement('style');css.textContent='html,body,canvas,#shell17{user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;overscroll-behavior:none}@media(min-aspect-ratio:2/1){html:not(.phone21) #game-canvas21{position:fixed!important;left:50%!important;transform:translateX(-50%);width:200vh!important;height:100vh!important;margin:0!important}html:not(.phone21) #shell17{left:calc(50vw - 100vh);right:calc(50vw - 100vh)}}';document.head.appendChild(css);
};
