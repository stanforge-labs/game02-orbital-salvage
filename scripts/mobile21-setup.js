module.exports=function setupMobile21(scene){
 if(scene.__mobile21)return;
 const m=scene.__mobile21={active:false,width:innerWidth,height:innerHeight,safe:{top:0,right:0,bottom:0,left:0}};
 scene.getGame().getRenderer().getPIXIRenderer().view.id='game-canvas21';
 if(window.__mobile20Child)window.__mobile21Scene=scene;
 const css=document.createElement('style');css.textContent=`
 html.phone21{--safe-top:env(safe-area-inset-top,0px);--safe-right:env(safe-area-inset-right,0px);--safe-bottom:env(safe-area-inset-bottom,0px);--safe-left:env(safe-area-inset-left,0px);overscroll-behavior:none}
 .phone21 body{overflow:hidden;overscroll-behavior:none;height:var(--mobile-h,100dvh)}
 .phone21 #game-canvas21{position:fixed!important;left:var(--mobile-x)!important;top:var(--mobile-y)!important;width:var(--mobile-w)!important;height:var(--mobile-h)!important;margin:0!important;padding:0!important;display:block;touch-action:none}
 .phone21 #shell17,.phone21 #arcade21{inset:auto!important;left:var(--mobile-x)!important;top:var(--mobile-y)!important;width:var(--mobile-w)!important;height:var(--mobile-h)!important}
 .phone21 #shell17 button{font:600 12px/1.2 Exo17,Arial,sans-serif;min-height:44px;padding:6px 10px;border-radius:6px;touch-action:manipulation}
 .phone21 #shell17 .toolbar{right:calc(var(--safe-right) + 8px);bottom:calc(var(--safe-bottom) + 6px);gap:5px}
 .phone21 #shell17 .toolbar button{max-width:104px}
 .phone21 #shell17 .toolbar .subtle{display:none}
 .phone21 #shell17 .nav{left:calc(var(--safe-left) + 8px);bottom:calc(var(--safe-bottom) + 6px);transform:none;width:calc(var(--mobile-w) - var(--safe-left) - var(--safe-right) - var(--mobile-dock,178px));max-width:460px;min-height:44px;max-height:48px;padding:4px 8px;gap:7px;font-size:12px;line-height:1.2;border-color:#365464;background:#091c2dda;overflow:hidden}
 .phone21 #shell17 .nav>div{min-width:0}.phone21 #shell17 .destination{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
 .phone21 #shell17 .nav small{display:none;font-size:10px;line-height:1.15;margin-top:3px}
 .phone21 #shell17 .nav.secret21 small{display:block}
 .phone21 #shell17 .compass{font-size:18px;width:18px;height:20px;line-height:20px}
 .phone21 #shell17 .overlay,.phone21 #shell17 .native21{padding:calc(var(--safe-top) + 8px) calc(var(--safe-right) + 8px) calc(var(--safe-bottom) + 8px) calc(var(--safe-left) + 8px);background:#030c18e8}
 .phone21 #shell17 .card{display:flex;flex-direction:column;width:min(720px,100%);max-height:100%;padding:0;overflow:hidden;border-radius:10px;box-shadow:none}
 .phone21 #shell17 .eyebrow{display:none}
 .phone21 #shell17 .head21{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 12px;border-bottom:1px solid #315367;flex-shrink:0;min-height:44px}
 .phone21 #shell17 h1,.phone21 #shell17 h2{font-size:19px;line-height:1.15;letter-spacing:.015em;margin:0;text-align:left}
 .phone21 #shell17 .head21 button{flex-shrink:0;min-width:44px}
 .phone21 #shell17 .body21{overflow:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;min-height:0;padding:10px 12px;touch-action:pan-y;text-align:left}
 .phone21 #shell17 p{font-size:13px;line-height:1.4;margin:0 0 10px}
 .phone21 #shell17 .actions{grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin:0}
 .phone21 #shell17 .journal{font-size:12px;line-height:1.4;padding:10px;grid-column:1/-1}
 .phone21 #shell17 .settings-row{margin:4px 0;font-size:13px;grid-column:1/-1}
 .phone21 #shell17 .foot21{display:flex;gap:8px;justify-content:center;flex-shrink:0;padding:6px 12px;border-top:1px solid #315367;background:#102b3d}
 .phone21 #shell17 .foot21 button{flex:1;max-width:420px}
 .phone21 #shell17 .native21{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:auto}
 .phone21 #shell17 .module-grid21,.phone21 #shell17 .sector-grid21{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
 .phone21 #shell17 .sector-grid21{grid-template-columns:repeat(2,minmax(0,1fr))}
 .phone21 #shell17 .module21{padding:10px;border:1px solid #36596c;background:#102738;border-radius:7px;display:flex;flex-direction:column;gap:8px}
 .phone21 #shell17 .module21 p{white-space:pre-line;font-size:12px;flex:1;margin:0}
 .phone21 #shell17 .readout21{white-space:pre-line;font-size:13px;line-height:1.45;margin-bottom:10px}
 .phone21 #shell17 .maintenance21{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}
 .phone21 #shell17 .notice21{color:#efd393;font-size:12px;line-height:1.3;min-height:16px;margin-bottom:8px}
 .phone21 #shell17 .debug{left:8px;top:8px;width:min(340px,90%);max-height:calc(var(--mobile-h) - 16px);z-index:6}
 #mobile-hud21{display:none}.phone21 #mobile-hud21{position:absolute;left:calc(var(--safe-left) + 8px);right:calc(var(--safe-right) + 8px);top:calc(var(--safe-top) + 6px);display:grid;grid-template-columns:minmax(116px,1fr) minmax(170px,1.7fr) minmax(112px,1fr);gap:8px;height:var(--mobile-hud-height,54px);pointer-events:auto;touch-action:manipulation}
 #mobile-hud21 section{min-width:0;background:#0a2030f5;border:1px solid #46788c;border-top:2px solid #66b1c8;border-radius:6px;padding:6px 9px;display:flex;flex-direction:column;justify-content:center;gap:4px;font-size:12px;line-height:1.15;overflow:hidden}
 #mobile-hud21 .contract21{text-align:center;gap:2px;padding:3px 7px}#mobile-hud21 .contract21 small{display:none;font-size:9px;color:#93bac9;letter-spacing:.08em}
 #mobile-hud21 strong{font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#mobile-hud21 .mission21{font-size:11px;white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;line-height:12px;max-height:24px}
 #mobile-hud21 .progress21{font-size:10px;color:#e5d3a9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#mobile-hud21 .station21{position:absolute;top:calc(var(--mobile-hud-height,54px) + 6px);left:2px;font-size:10px;color:#d7c897;pointer-events:none}
 .phone21 #arcade21{padding:8px 8px 56px;box-sizing:border-box}
 .phone21 #arcade21 canvas{width:auto!important;height:100%!important;max-width:100%!important;max-height:100%!important;aspect-ratio:8/5;object-fit:contain}
 @media(max-height:300px){.phone21 #shell17 .head21{min-height:36px}.phone21 #shell17 h1{font-size:16px}.phone21 #shell17 .body21{padding:6px 10px}}
 `;document.head.appendChild(css);
 const probe=document.createElement('div');probe.style.cssText='position:fixed;visibility:hidden;pointer-events:none;padding:var(--safe-top) var(--safe-right) var(--safe-bottom) var(--safe-left)';document.body.appendChild(probe);
 const mobile=()=>window.__mobile20Child===true||matchMedia('(pointer:coarse)').matches||navigator.maxTouchPoints>0&&Math.min(screen.width,screen.height)<900;
 const measure=()=>{const vv=window.visualViewport;return{width:Math.round(vv?.width||innerWidth),height:Math.round(vv?.height||innerHeight),x:vv?.offsetLeft||0,y:vv?.offsetTop||0};};
 const R=gdjs.RuntimeGameRenderer,oldW=R.getWindowInnerWidth,oldH=R.getWindowInnerHeight;
 R.getWindowInnerWidth=()=>m.active?measure().width:oldW.call(R);R.getWindowInnerHeight=()=>m.active?measure().height:oldH.call(R);
 const update=()=>{const box=measure();m.active=mobile();Object.assign(m,box);document.documentElement.classList.toggle('phone21',m.active);
  const html=document.documentElement;for(const[k,val]of Object.entries({w:box.width,h:box.height,x:box.x,y:box.y}))html.style.setProperty('--mobile-'+k,val+'px');
  html.style.setProperty('--mobile-hud-height',box.height<=320?'48px':'54px');
  const c=getComputedStyle(probe);m.safe={top:parseFloat(c.paddingTop)||0,right:parseFloat(c.paddingRight)||0,bottom:parseFloat(c.paddingBottom)||0,left:parseFloat(c.paddingLeft)||0};
  const meta=document.querySelector('meta[name=viewport]');if(m.active&&meta&&!meta.content.includes('viewport-fit'))meta.content+=', viewport-fit=cover';
  scene.getGame().setGameResolutionSize(scene.getGame().getGameResolutionWidth(),1080);
 };
 let pending=false;const schedule=()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;update();});};
 window.addEventListener('resize',schedule);window.visualViewport?.addEventListener('resize',schedule);window.visualViewport?.addEventListener('scroll',schedule);
 m.refresh=update;update();
};
