const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const {chromium} = require('C:/Users/Станислав/Documents/ChatGPT/Yandex Games/node_modules/playwright-core');
const root = path.resolve(__dirname,'..');
const browserPath = 'C:/Users/Станислав/AppData/Local/ms-playwright/chromium-1169/chrome-win/chrome.exe';
const sleep = (p,ms)=>p.waitForTimeout(ms);
const state = p=>p.evaluate(()=>window.__osQAState);
// One-frame, read-only observation of native GDevelop Text objects.
const nativeHud=p=>p.evaluate(()=>new Promise((resolve,reject)=>{const proto=gdjs.RuntimeScene.prototype,original=proto.renderAndStep;const timer=setTimeout(()=>{proto.renderAndStep=original;reject(new Error('Native HUD observation timed out'));},3000);proto.renderAndStep=function(...args){try{const result=original.apply(this,args);resolve(Object.fromEntries(['HullText','CargoText','NavMarker','ObjectiveText'].map(n=>[n,this.getObjects(n)[0]?.getString()])));return result;}finally{clearTimeout(timer);proto.renderAndStep=original;}};}));
async function click(p,x,y){await p.mouse.click(x,y);await sleep(p,250);return state(p);}
async function steer(p,x,y,tolerance=65){
 const start=Date.now();const held=new Set();
 try{while(Date.now()-start<80000){const s=await state(p);if(!s||s.state!=='play')return s;
  const dx=x-s.shipX,dy=y-s.shipY;if(Math.hypot(dx,dy)<tolerance)break;
  const want=new Set();if(Math.abs(dx)>22)want.add(dx>0?'d':'a');if(Math.abs(dy)>22)want.add(dy>0?'s':'w');
  for(const k of held)if(!want.has(k)){await p.keyboard.up(k);held.delete(k);}
  for(const k of want)if(!held.has(k)){await p.keyboard.down(k);held.add(k);}
  await sleep(p,100);
 }}finally{for(const k of held)await p.keyboard.up(k);}
 await sleep(p,250);return state(p);
}
async function launch(url='http://127.0.0.1:4221/index.html', viewport={width:1920,height:1080}, mobile=false, seed=null){
 const browser=await chromium.launch({headless:true,executablePath:browserPath});
 const context=await browser.newContext({viewport,isMobile:mobile,hasTouch:mobile});
 // Fresh context has no storage. Fixture seeding is explicit and never used by natural mode.
 if(seed)await context.addInitScript(s=>localStorage.setItem('orbitalSalvageSave',JSON.stringify(s)),seed);
 const p=await context.newPage();const errors=[];const external=[];
 p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)(new URL(r.url()).hostname==='127.0.0.1'?errors:external).push(r.status()+' '+r.url());});
 await p.goto(url,{waitUntil:'load'});await p.waitForFunction(()=>window.__osQAState?.state==='menu'||window.__osQAState?.state==='rotate');
 return {browser,context,p,errors,external};
}
async function baseline(){const {browser,p,errors}=await launch();const report={};const dir=path.join(root,'_tmp-export','smart08-assessment');fs.mkdirSync(dir,{recursive:true});
 await p.screenshot({path:path.join(dir,'menu.png')});await click(p,960,710);
 for(const [x,y] of [[500,600],[650,820],[850,510],[1100,740],[1320,920]])await steer(p,x,y);
 await p.screenshot({path:path.join(dir,'gameplay.png')});await steer(p,260,700);report.first=await state(p);await p.screenshot({path:path.join(dir,'result.png')});
 await click(p,1220,580);await steer(p,1600,390);await steer(p,260,700);report.second=await state(p);await click(p,700,580);await p.screenshot({path:path.join(dir,'upgrades.png')});
 const before=await state(p);await click(p,1470,455);report.purchase={before,after:await state(p)};
 report.errors=errors;fs.writeFileSync(path.join(dir,'assessment.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));await browser.close();}
module.exports={fs,path,assert,root,sleep,state,click,steer,launch,nativeHud};
if(require.main===module)baseline().catch(e=>{console.error(e);process.exit(1)});
