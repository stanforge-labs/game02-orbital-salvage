const base=require('./release17-qa-lib'),fs=require('fs');
const engines=require('C:/Users/Станислав/Documents/ChatGPT/Yandex Games/node_modules/playwright-core');
const {chromium}=engines;
const executablePath=fs.readdirSync(process.env.LOCALAPPDATA+'/ms-playwright').filter(x=>/^chromium-\d+$/.test(x)).sort((a,b)=>Number(b.split('-')[1])-Number(a.split('-')[1])).map(x=>process.env.LOCALAPPDATA+'/ms-playwright/'+x+'/chrome-win64/chrome.exe').find(x=>fs.existsSync(x));
async function open(viewport={width:1920,height:1080},mobile=false,options={}){
 const engine=process.env.YANDEX_QA_BROWSER||'chromium';
 const browser=await engines[engine].launch({headless:!options.headed&&process.env.YANDEX_QA_HEADED!=='1',...(engine==='chromium'?{executablePath:process.env.YANDEX_QA_EXECUTABLE||executablePath}:{})}),context=await browser.newContext({viewport,...(engine==='firefox'?{}:{isMobile:mobile}),hasTouch:mobile,...(options.storageState?{storageState:options.storageState}:{}),...(options.deviceScaleFactor?{deviceScaleFactor:options.deviceScaleFactor}:{}),...(options.recordVideo?{recordVideo:options.recordVideo}:{})}),created=Date.now(),p=await context.newPage(),errors=[],external=[];
 // Test harness transport substitute only. Not in source export or ZIP.
 await context.route('**/sdk.js',r=>r.fulfill({contentType:'text/javascript',body:`window.__sdkCalls=[];window.YaGames={init:async()=>({environment:{i18n:{lang:'ru'}},on:(name,fn)=>{(window.__sdkEvents??={})[name]=fn},features:{LoadingAPI:{ready:()=>__sdkCalls.push('ready')},GameplayAPI:{start:()=>__sdkCalls.push('start'),stop:()=>__sdkCalls.push('stop')}},adv:{showRewardedVideo:({callbacks:c})=>{window.__adCallbacks=c;c.onOpen?.();}}})};`}));
 p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)external.push(r.status()+' '+r.url());});
 p.on('request',r=>{if(/^https?:/.test(r.url())&&!['127.0.0.1','localhost'].includes(new URL(r.url()).hostname))external.push('external request '+r.url());});
 // Read-only navigator outside production: no world/progression/HP writes.
 await p.addInitScript(()=>{
  const wait=setInterval(()=>{if(!window.gdjs?.RuntimeScene)return;clearInterval(wait);const f=gdjs.RuntimeScene.prototype.renderAndStep;gdjs.RuntimeScene.prototype.renderAndStep=function(...a){window.scene15=this;const result=f.apply(this,a);if(this.__os){const v=this.getVariables(),N=k=>v.get(k).getAsNumber(),S=k=>v.get(k).getAsString();window.__osQAState={state:S('GameState'),secretStage:this.__g13?.secret.stage,seed:this.__g13?.seed,cargo:N('Cargo'),cargoMax:N('CargoMax'),hull:N('Hull'),hullMax:N('HullMax'),credits:N('Credits'),techParts:N('TechParts'),sector:N('CurrentSector'),runCount:N('RunCount'),contractsCompleted:N('ContractsCompleted'),shipX:this.__os.x,shipY:this.__os.y,runTime:N('RunTime'),cargoValue:N('CargoValue'),missionType:S('MissionType'),missionProgress:N('MissionProgress'),missionTarget:N('MissionTarget'),sectorUnlocked:N('SectorUnlocked'),damage:N('RunDamage'),offers:[S('Offer1'),S('Offer2'),S('Offer3')]};}return result;};},5);
 });
 await p.goto('http://127.0.0.1:'+(options.port||process.env.YANDEX_QA_PORT||4240)+'/index.html'+(process.env.YANDEX_QUERY||''));
 await p.waitForFunction(()=>window.__osQAState?.state==='menu'||window.__osQAState?.state==='rotate',{},{timeout:20000}).catch(e=>{console.error(errors);throw e;});
 return{browser,context,p,errors,external,created};
}
module.exports={...base,open};
