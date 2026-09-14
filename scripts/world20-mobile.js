module.exports=function mobile20(scene){
 if(scene.__mobile20Ready)return;scene.__mobile20Ready=true;
 const shell=scene.__ui17;if(!shell)return;
 if(window.__mobile20Child){
  const canvas=document.createElement('canvas');canvas.id='mobile20-guides';canvas.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:99999';document.body.appendChild(canvas);
  window.__mobile20State={touch:true,safe:false,bounds:false,gameplay:false,hitboxes:false};window.__mobile20Touch=true;
  let last=performance.now(),frames=0,fps=0,lastGuide=0;
  window.__mobile20Telemetry=()=>{const now=performance.now();if(now-last>500){fps=frames*1000/(now-last);last=now;frames=0;}const v=scene.getVariables(),W=innerWidth,H=innerHeight;return {width:W,height:H,logical:[scene.getGame().getGameResolutionWidth(),scene.getGame().getGameResolutionHeight()],hudCamera:[scene.getLayer('HUD').getCameraX(),scene.getLayer('HUD').getCameraY()],orientation:H>W?'portrait':'landscape',dpr:devicePixelRatio,uiScale:H/1080,fps:Math.round(fps),instances:scene.getAdhocListOfAllInstances().length,input:window.__mobile20Touch?'touch simulation':'mouse / keyboard',state:v.get('GameState').getAsString(),safeInsets:[24,16,24,16],save:'isolated in-memory copy'};};
  const step=()=>{frames++;requestAnimationFrame(step);const now=performance.now();if(now-lastGuide<100)return;lastGuide=now;const c=canvas.getContext('2d'),W=innerWidth,H=innerHeight,opt=window.__mobile20State;if(canvas.width!==W||canvas.height!==H){canvas.width=W;canvas.height=H;}c.clearRect(0,0,W,H);c.lineWidth=1;
   if(opt.safe){c.strokeStyle='#50d0b0';c.strokeRect(16,24,W-32,H-48);}
   if(opt.gameplay&&W>H){const b=scene.__safe19;if(b){const k=H/1080;c.strokeStyle='#b48fec';c.strokeRect(b.left*k,b.top*k,(b.right-b.left)*k,(b.bottom-b.top)*k);}}
   if(opt.bounds){c.strokeStyle='#e6bf73';for(const e of document.querySelectorAll('#shell17 .card,#shell17 button,#shell17 .nav')){const r=e.getBoundingClientRect();if(r.width)c.strokeRect(r.x,r.y,r.width,r.height);}const k=H/1080,layer=scene.getLayer('HUD');for(const n of ['HudPanel','MissionPanel'])for(const o of scene.getObjects(n))if(!o.isHidden())c.strokeRect(W/2+(o.getX()-layer.getCameraX())*k,H/2+(o.getY()-layer.getCameraY())*k,o.getWidth()*k,o.getHeight()*k);}
   if(opt.hitboxes&&scene.__g13){c.strokeStyle='#de7c77';const cam=scene.__osCam,k=H/1080;for(const h of scene.__g13.hazards){c.beginPath();c.arc(W/2+(h.x-cam.x)*2*k,H/2+(h.y-cam.y)*2*k,(h.size||40)*k,0,Math.PI*2);c.stroke();}}
  };requestAnimationFrame(step);return;
 }
 if(!shell.devAllowed)return;
 const launch=document.createElement('button');launch.textContent='MOBILE TEST MODE';shell.debug.querySelector('.actions').appendChild(launch);
 launch.onclick=async()=>{
  if(document.getElementById('mobile20-panel'))return;
  const state=scene.getVariables().get('GameState'),old=state.getAsString();if(old==='play'){shell.returnState='play';state.setString('pause17');}
  const host=document.createElement('section');host.id='mobile20-panel';host.style.cssText='position:fixed;inset:0;z-index:100000;background:#08121e;display:flex;color:#d7e5eb;font:14px system-ui';
  const tools=document.createElement('aside');tools.style.cssText='box-sizing:border-box;width:270px;min-width:270px;padding:18px;overflow:auto;background:#112334;display:flex;flex-direction:column;gap:12px';
  const stage=document.createElement('div');stage.style.cssText='flex:1;min-width:0;position:relative;overflow:hidden';host.append(tools,stage);document.body.appendChild(host);
  const title=document.createElement('h2');title.textContent='MOBILE TEST MODE';title.style.margin='0';tools.appendChild(title);
  const note=document.createElement('p');note.textContent='Эмуляция viewport и ввода, не физический Android. Тестовая копия сохранения: изменения не попадут в основной прогресс.';note.style.cssText='font-size:12px;line-height:1.5;color:#a2bac8';tools.appendChild(note);
  const select=document.createElement('select');select.setAttribute('aria-label','Device preset');for(const size of ['360x640','375x667','390x844','393x873','412x915','430x932','720x1280','1280x720']){const o=document.createElement('option');o.value=size;o.textContent=size.replace('x',' × ');select.appendChild(o);}select.value='390x844';tools.appendChild(select);
  let width=390,height=844,disposed=false,timer;
  const iframe=document.createElement('iframe');iframe.title='Isolated mobile game';iframe.style.cssText='position:absolute;border:1px solid #496277;transform-origin:top left;background:#081422';stage.appendChild(iframe);
  const layout=()=>{const r=stage.getBoundingClientRect(),scale=Math.min((r.width-24)/width,(r.height-24)/height,1);iframe.style.width=width+'px';iframe.style.height=height+'px';iframe.style.transform=`scale(${scale})`;iframe.style.left=(r.width-width*scale)/2+'px';iframe.style.top=(r.height-height*scale)/2+'px';};
  const add=(text,fn)=>{const b=document.createElement('button');b.textContent=text;b.style.cssText='padding:9px;background:#214358;border:1px solid #567586;color:#e6eef1;border-radius:5px;cursor:pointer';b.onclick=fn;tools.appendChild(b);return b;};
  select.onchange=()=>{[width,height]=select.value.split('x').map(Number);layout();};
  add('Portrait',()=>{[width,height]=[Math.min(width,height),Math.max(width,height)];layout();});add('Landscape',()=>{[width,height]=[Math.max(width,height),Math.min(width,height)];layout();});add('Rotate',()=>{[width,height]=[height,width];layout();});add('Reset viewport',()=>{select.value='390x844';width=390;height=844;layout();});
  for(const[label,key,checked]of [['Touch simulation','touch',true],['Safe area','safe',false],['UI bounds','bounds',false],['Gameplay bounds','gameplay',false],['Hazard hitboxes','hitboxes',false]]){const row=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.checked=checked;input.onchange=()=>{const w=iframe.contentWindow;if(w.__mobile20State)w.__mobile20State[key]=input.checked;if(key==='touch')w.__mobile20Touch=input.checked;};row.append(input,document.createTextNode(' '+label));tools.appendChild(row);}
  const telemetry=document.createElement('pre');telemetry.style.cssText='font:12px/1.6 monospace;white-space:pre-wrap';tools.appendChild(telemetry);
  const close=()=>{disposed=true;clearInterval(timer);window.removeEventListener('resize',layout);iframe.src='about:blank';host.remove();if(old==='play')state.setString('play');scene.__osPointer={active:false,down:false};};add('ЗАКРЫТЬ ТЕСТ',close);window.addEventListener('resize',layout);layout();
  try{
   const url=new URL('index.html',location.href),html=await(await fetch(url)).text(),copy={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);copy[k]=localStorage.getItem(k);}
   const bootstrap=`<base href="${url.href}"><script>window.__mobile20Child=true;window.__mobile20Touch=true;{const m=new Map(Object.entries(${JSON.stringify(copy).replace(/</g,'\\u003c')}));const s={getItem:k=>m.has(String(k))?m.get(String(k)):null,setItem:(k,v)=>m.set(String(k),String(v)),removeItem:k=>m.delete(String(k)),clear:()=>m.clear(),key:i=>Array.from(m.keys())[i]??null,get length(){return m.size}};Object.defineProperty(window,'localStorage',{value:s});Object.defineProperty(window,'sessionStorage',{value:s});}<\/script>`;
   // srcdoc has an empty hostname. Keep the export's localhost SDK fallback;
   // do not accidentally request the production SDK inside the emulator.
   const adapter=await(await fetch(new URL('yandex-adapter.js',url))).text();
   const childAdapter=adapter.replace('var localHost =', 'var localHost = window.__mobile20Child === true ||');
   const localHtml=html.replace('if (location.hostname !== "localhost"', 'if (!window.__mobile20Child && location.hostname !== "localhost"')
    .replace(/<script src="yandex-adapter.js"[^>]*><\/script>/,'<script>'+childAdapter.replace(/<\/script/gi,'<\\/script')+'<\/script>');
   if(!disposed)iframe.srcdoc=localHtml.replace(/<head([^>]*)>/i,'<head$1>'+bootstrap);
   timer=setInterval(()=>{if(disposed)return;try{const t=iframe.contentWindow.__mobile20Telemetry?.();telemetry.textContent=t?`${t.width} × ${t.height} · ${(t.width/t.height).toFixed(3)}\n${t.orientation} · DPR ${t.dpr}\nUI scale ${t.uiScale.toFixed(3)}\nInput: ${t.input}\nFPS ${t.fps} · Instances ${t.instances}\nSafe inset: ${t.safeInsets.join('/')}\nState: ${t.state}\nIn-memory save only`:'Загрузка тестовой сборки…';}catch(e){telemetry.textContent='Тест недоступен: '+e.message;}},500);
  }catch(e){telemetry.textContent='Не удалось загрузить сборку: '+e.message;}
 };
};
