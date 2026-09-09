// UI-only navigator. Reads rendered text and the on-screen compass, never world
// coordinates, generator POIs, hazard lists, save data or player velocity.
const {open,click,fs}=require('./release17-qa-lib');
(async()=>{const q=await open({width:1366,height:768}),p=q.p,start=Date.now(),events=[],held=new Set(),out='screenshots/FinalPreRelease17';fs.mkdirSync(out,{recursive:true});
const readUI=()=>p.evaluate(()=>{const text=n=>{const o=scene15.getObjects(n)[0];return o&&!o.isHidden()?o.getString():'';},nav=document.querySelector('#shell17 .nav'),a=document.querySelector('#shell17 .compass'),matrix=new DOMMatrix(getComputedStyle(a).transform);return {nav:nav?.textContent,angle:Math.atan2(matrix.b,matrix.a),distance:Number(nav.querySelector('.destination').textContent.match(/(\d+) м/)?.[1]||0),detail:nav.querySelector('small').textContent,cargo:text('CargoText'),hull:text('HullText'),progress:text('MissionProgress16'),mission:text('MissionText'),sector:text('SectorText'),result:text('ResultTitle'),offers:scene15.getObjects('UpgradeButtonText').filter(o=>!o.isHidden()).map(o=>o.getString()),sectorButtons:scene15.getObjects('SectorSelectButtonBg').some(o=>!o.isHidden()),buttons:Array.from(document.querySelectorAll('#shell17 button')).filter(b=>b.offsetWidth&&b.offsetHeight).map(b=>b.textContent)};});
const log=async name=>{const u=await readUI();events.push({name,seconds:(Date.now()-start)/1000,ui:u});console.log(name,((Date.now()-start)/1000).toFixed(1),u.nav);};
const keys=async want=>{for(const k of held)if(!want.has(k)){await p.keyboard.up(k);held.delete(k);}for(const k of want)if(!held.has(k)){await p.keyboard.down(k);held.add(k);}};
try{await p.getByRole('button',{name:'ОРБИТАЛЬНЫЙ ПАТРУЛЬ',exact:true}).click();await p.waitForTimeout(1500);await log('arcade-found');await p.getByRole('button',{name:'ВЫЙТИ ИЗ ПАТРУЛЯ',exact:true}).click();await click(p,'ButtonBg');await p.getByRole('button',{name:'Ⅱ ПАУЗА',exact:true}).click();await log('pause-found');await p.getByRole('button',{name:'ПРОДОЛЖИТЬ',exact:true}).click();let prior=null,lastTime=Date.now(),lastLabel='',sector2=false,secret=false,cache=false,returns=0,lastSnapshot=0;
while(Date.now()-start<1200000){const u=await readUI();
 if(u.result){await keys(new Set());returns++;await log('return-'+returns);await click(p,'ResultButtonBg');if(/ПОВРЕЖД|ПОТЕРЯН|РАЗРУШ/.test(u.result)){prior=null;continue;}const a=await readUI();const idx=a.offers.findIndex(x=>/УЛУЧШИТЬ|УСТАНОВИТЬ/.test(x)&&!/НУЖНО/.test(x));if(idx>=0){await click(p,'UpgradeButtonBg',idx);await log('purchase');}await click(p,'UpgradeBackButtonBg');prior=null;continue;}
 if(u.sectorButtons){await keys(new Set());await log('sector-select-found');await click(p,'SectorSelectButtonBg',1);await p.waitForTimeout(350);sector2=(await readUI()).sector.includes('2');if(!sector2)await click(p,'SectorSelectButtonBg',0);else await log('sector2-enter');prior=null;continue;}
 if(u.buttons.some(t=>/НАЧАТЬ ВЫЛЕТ|ПРОДОЛЖИТЬ —/.test(t))){await click(p,'ButtonBg');continue;}
 if(!u.cargo){await keys(new Set());await p.waitForTimeout(120);continue;}
 if(u.nav.includes('НЕИЗВЕСТНЫЙ СИГНАЛ')&&!secret){secret=true;await log('signal-found-through-hint');}
 if(sector2&&secret&&u.nav.includes('КЛЮЧ ДОСТУПА')){await keys(new Set());await log('locked-signal-reached-through-ui');break;}
 if(u.nav.includes('ТЕХ-КЭШ'))cache=true;
 if(cache&&u.nav.includes('СТАНЦИЯ')&&returns>0){await log('secret-exit');}
 if(sector2&&cache&&u.result)break;
 const label=u.nav.replace(/\d+/g,'');if(label!==lastLabel){await log('objective-change');lastLabel=label;}
 const dx=Math.cos(u.angle)*u.distance,dy=Math.sin(u.angle)*u.distance,now=Date.now(),dt=Math.max(.03,(now-lastTime)/1000);let vx=0,vy=0;
 if(prior&&prior.label===label&&Math.hypot(dx-prior.dx,dy-prior.dy)<90){vx=(prior.dx-dx)/dt;vy=(prior.dy-dy)/dt;}
 const want=new Set();for(const [d,speed,minus,plus]of[[dx,vx,'a','d'],[dy,vy,'w','s']]){const e=Math.max(-155,Math.min(155,d*2.3))-speed;if(Math.abs(e)>32)want.add(e>0?plus:minus);}
 // A first-time pilot brakes inside visible scan rings; no hidden velocity read.
 if(u.distance<24&&/сканирование|Ремонт|удерживайтесь|Удерживайтесь/.test(u.detail)){want.clear();}
 await keys(want);prior={dx,dy,label};lastTime=now;
 if(now-lastSnapshot>60000){lastSnapshot=now;await p.screenshot({path:out+'/newcomer-'+Math.floor((now-start)/1000)+'.png'});}
 await p.waitForTimeout(100);
 if(cache&&returns>12)break;
}
await log('end');}catch(e){events.push({failure:e.stack});console.error(e);}finally{await keys(new Set());fs.writeFileSync('docs/release17-newcomer.json',JSON.stringify({mode:'fresh context; rendered UI text and compass only; no world coordinates or DEV',seconds:(Date.now()-start)/1000,events,errors:q.errors},null,2));await q.browser.close();}})();
