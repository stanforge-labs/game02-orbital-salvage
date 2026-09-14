module.exports=function mobileUI21(scene){
 const m=scene.__mobile21,ui=scene.__ui17;if(!m||!ui)return;
 const v=scene.getVariables(),N=n=>v.get(n).getAsNumber(),S=n=>v.get(n).getAsString(),st=S('GameState'),active=m.active&&m.width>m.height;
 const objects=n=>scene.getObjects(n),text=(n,i=0)=>objects(n)[i]?.getString()||'',set=(e,s)=>{if(e.textContent!==s)e.textContent=s;};
 if(!m.hud){
  const hud=m.hud=document.createElement('div');hud.id='mobile-hud21';hud.innerHTML='<section><strong class="cargo21"></strong><strong class="hull21"></strong></section><section class="contract21"><small>КОНТРАКТ</small><strong class="mission21"></strong><span class="progress21"></span></section><section><strong class="credits21"></strong><span class="sector21"></span></section><span class="station21"></span>';ui.root.appendChild(hud);
  hud.addEventListener('pointerdown',e=>{e.stopPropagation();if(scene.__osPointer){scene.__osPointer.active=false;scene.__osPointer.down=false;}});hud.addEventListener('pointerup',e=>e.stopPropagation());
  const native=m.native=document.createElement('div');native.className='native21';native.hidden=true;ui.root.appendChild(native);
  native.addEventListener('pointerdown',e=>{e.stopPropagation();if(scene.__osPointer)scene.__osPointer.active=false;});native.addEventListener('pointerup',e=>e.stopPropagation());
  const arcade=[...document.querySelectorAll('canvas')].find(c=>c.width===960&&c.height===600);if(arcade)arcade.parentElement.id='arcade21';
 }
 m.hud.style.display=active&&st==='play'?'grid':'none';m.native.style.display='none';
 if(!active)return;
 // Reflow existing DOM dialogs without replacing their action callbacks.
 const card=ui.overlay.querySelector('.card');
 if(card&&!card.dataset.mobile21){
  card.dataset.mobile21='1';const h=card.querySelector('h1'),desc=card.querySelector('p'),actions=card.querySelector('.actions'),head=document.createElement('header'),body=document.createElement('div'),foot=document.createElement('footer');head.className='head21';body.className='body21';foot.className='foot21';
  const all=[...actions.querySelectorAll('button')],primary=all.find(b=>b.textContent===({menu:N('RunCount')?'ПРОДОЛЖИТЬ — НОВЫЙ ВЫЛЕТ':'НАЧАТЬ ВЫЛЕТ',pause17:'ПРОДОЛЖИТЬ',journal17:'ПРОДОЛЖИТЬ',settings17:'НАЗАД',confirm17:'ОТМЕНА'})[st])||all[0];
  head.appendChild(h);if(st!=='menu'&&primary){const close=document.createElement('button');close.textContent='✕';close.setAttribute('aria-label','Закрыть');close.onclick=()=>primary.click();head.appendChild(close);}
  if(st==='journal17')desc.textContent+=' · '+(scene.__g13.regions[scene.__g13.region]?.title||'')+' · Награда '+N('MissionReward')+(N('MissionTechReward')?' + '+N('MissionTechReward')+' технодеталь':'');
  body.append(desc,actions);if(primary)foot.appendChild(primary);card.replaceChildren(head,body,foot);
  if(st==='menu'){const hint=document.createElement('p');hint.textContent='Больше обзора: полный экран или «На главный экран» в меню браузера.';hint.style.fontSize='11px';body.appendChild(hint);
   if(document.documentElement.requestFullscreen){const b=document.createElement('button');b.textContent='ПОЛНЫЙ ЭКРАН';b.onclick=()=>document.documentElement.requestFullscreen().catch(()=>{hint.textContent='Полный экран недоступен. Можно играть в обычном браузере.';});actions.appendChild(b);}
  }
 }
 const nativeStates=['upgrades','result','fail','sectorSelect','resetConfirm'];
 if(nativeStates.includes(st)){
  m.native.style.display='flex';
  // Read the final native labels; don't duplicate reward, prices or completion logic.
  const labels=['UpgradeTitle','UpgradeNotice','UpgradeCardText','UpgradeButtonText','TechText','RerollButtonText','ResetButtonText','SystemButtonText','UpgradeBackText','ResultTitle','ResultStats','ResultText','RewardButtonText','SectorSelectTitle','SectorSelectText','SectorSelectButtonText','SectorSelectHint','SectorSelectBackText','ResetConfirmTitle','ResetConfirmText','ResetConfirmCancelText','ResetConfirmOkText'];
  const key=st+labels.map(n=>objects(n).map(o=>o.getString()+'|'+o.isHidden()).join('|')).join(';');
  if(m.nativeKey!==key){m.nativeKey=key;const scroll=m.native.querySelector('.body21')?.scrollTop||0;
   const panel=document.createElement('section');panel.className='card';const head=document.createElement('header'),body=document.createElement('div'),foot=document.createElement('footer');head.className='head21';body.className='body21';foot.className='foot21';panel.append(head,body,foot);
   const h=document.createElement('h1');h.textContent=text(st==='upgrades'?'UpgradeTitle':st==='sectorSelect'?'SectorSelectTitle':st==='resetConfirm'?'ResetConfirmTitle':'ResultTitle');head.appendChild(h);
   const paragraph=(s,where=body,cls='readout21')=>{const p=document.createElement('div');p.className=cls;p.textContent=s;where.appendChild(p);return p;};
   const action=(where,label,name,index=0,fixed)=>{if(!label.trim())return;const b=document.createElement('button');b.textContent=label.replace(/\n/g,' ');b.dataset.native=name;b.dataset.index=index;b.onclick=()=>{if(S('GameState')!==st)return;scene.__audio16.unlock();scene.__audio16.tone('click');const o=objects(name)[index];if(!o||o.isHidden())return;scene.__osPendingClick=fixed||{x:o.getX()+o.getWidth()/2,y:o.getY()+o.getHeight()/2};};where.appendChild(b);return b;};
   if(st==='upgrades'){
    paragraph('КРЕДИТЫ '+N('Credits')+' · ТЕХНОДЕТАЛИ '+N('TechParts'));paragraph(text('UpgradeNotice'),body,'notice21');
    const grid=document.createElement('div');grid.className='module-grid21';body.appendChild(grid);
    for(let i=0;i<3;i++){const article=document.createElement('article');article.className='module21';const p=document.createElement('p');p.textContent=text('UpgradeCardText',i).replace(/\n{3,}/g,'\n\n');article.appendChild(p);action(article,text('UpgradeButtonText',i),'UpgradeButtonBg',i);grid.appendChild(article);}
    const extra=document.createElement('div');extra.className='maintenance21';body.appendChild(extra);for(const[a,b]of[['RerollButtonBg','RerollButtonText'],['ResetButtonBg','ResetButtonText'],['SystemButtonBg','SystemButtonText']])if(!objects(a)[0]?.isHidden())action(extra,text(b),a);
    action(foot,text('UpgradeBackText'),'UpgradeBackButtonBg');
   }else if(st==='sectorSelect'){
    const grid=document.createElement('div');grid.className='sector-grid21';body.appendChild(grid);for(let i=0;i<2;i++){const article=document.createElement('article');article.className='module21';paragraph(text('SectorSelectText',i),article);action(article,text('SectorSelectButtonText',i),'SectorSelectButtonBg',i,{x:i?1300:600,y:670});grid.appendChild(article);}paragraph(text('SectorSelectHint'));action(foot,text('SectorSelectBackText'),'SectorSelectBackBg',0,{x:960,y:840});
   }else if(st==='resetConfirm'){
    paragraph(text('ResetConfirmText'));action(foot,text('ResetConfirmCancelText'),'ResetConfirmCancelBg',0,{x:700,y:680});action(body,text('ResetConfirmOkText'),'ResetConfirmOkBg',0,{x:1200,y:680});
   }else{
    paragraph(text('ResultStats'));if(!objects('RewardButtonBg')[0]?.isHidden())action(body,text('RewardButtonText'),'RewardButtonBg');for(let i=0;i<2;i++)if(!objects('ResultButtonBg')[i]?.isHidden())action(foot,text('ResultText',i),'ResultButtonBg',i);
   }
   m.native.replaceChildren(panel);body.scrollTop=scroll;
  }
  return;
 }
 if(st!=='play')return;
 const dockKey=[m.width,m.height,ui.devAllowed].join(':');if(m.dockKey!==dockKey){m.dockKey=dockKey;ui.root.style.setProperty('--mobile-dock',(ui.toolbar.getBoundingClientRect().width+24)+'px');}
 for(const n of ['HudPanel','MissionPanel','CargoText','HullText','CreditsText','SectorText','SectorName16','MissionHeader16','MissionText','MissionProgress16','MissionReward16','NavMarker','Radio16','OnboardingText','RegionReveal'])objects(n).forEach(o=>o.hide());
 const q=s=>m.hud.querySelector(s);set(q('.cargo21'),'ГРУЗ '+N('Cargo')+'/'+N('CargoMax'));set(q('.hull21'),'КОРПУС '+N('Hull')+'/'+N('HullMax'));q('.hull21').style.color=N('Hull')<=1?'#ffad86':'';
 set(q('.mission21'),S('Mission'));q('.mission21').title=S('Mission');
 let progress=text('MissionProgress16').replace(/\s+/g,' ');if(S('MissionType')==='nodamage')progress='ГРУЗ '+N('Cargo')+'/'+N('MissionTarget')+(N('RunDamage')?' · УРОН':' · БЕЗ УРОНА');set(q('.progress21'),progress+' · +'+N('MissionReward'));
 set(q('.credits21'),'КРЕДИТЫ '+N('Credits'));set(q('.sector21'),'СЕКТОР '+N('CurrentSector'));
 const dist=Math.round(Math.hypot(scene.__os.x-260,scene.__os.y-700));set(q('.station21'),dist>250?'СТАНЦИЯ · '+dist+' м':'');
 const secret=scene.__g13?.secret.stage>=4&&scene.__g13.secret.stage<6;ui.nav.classList.toggle('secret21',secret);
 if(secret){const detail=ui.nav.querySelector('small');const scan=detail.textContent.includes('сканирование');set(detail,scan?detail.textContent:'Перед лучом дождитесь тёмной фазы');}
 // Compact critical feedback into a protected band, away from the ship.
 const H=scene.getGame().getGameResolutionHeight(),W=scene.getGame().getGameResolutionWidth(),k=H/m.height;
 for(const n of ['MeteorTelegraph','StatusText'])for(const o of objects(n)){if(o.isHidden())continue;o.setPosition(960-W/2+(m.safe.left+10)*k,(m.safe.top+82)*k);o.setCharacterSize(11*k);o.setWrappingWidth((m.width-m.safe.left-m.safe.right-20)*k);}
 for(const n of ['PickupText','RiskLabel'])for(const o of objects(n)){if(o.isHidden())continue;const c=scene.__osCam,s=scene.__os;const x=s.x<c.x?s.x+55:s.x-170;const y=Math.max(c.y+((m.safe.top+94)*k-H/2)/2,s.y-50);o.setPosition(x,y);}
};
