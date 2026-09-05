const {fs,path,assert,root,sleep,state,click,steer,launch}=require('./smart08-play');
const cfg=require('./smart08-config');
const out=path.join(root,'screenshots/SmartPolish08');fs.mkdirSync(out,{recursive:true});
const report={mode:'fresh browser context; keyboard/mouse only; no storage injection',events:[],runs:[],screenshots:[],errors:[],qa:{}};
const url='http://127.0.0.1:4222/index.html?traceCamera';let startTime;
const now=()=>Math.round((Date.now()-startTime)/100)/10;
const shot=async(p,name)=>{await p.screenshot({path:path.join(out,name)});if(!report.screenshots.includes(name))report.screenshots.push(name);};
const log=async(p,event)=>{const s=await state(p);const item={time:now(),event,...s};report.events.push(item);console.log(JSON.stringify(item));return s;};
async function targets(p,points){for(const [x,y]of points){const s=await steer(p,x,y,45);assert.equal(s.state,'play','Корабль должен пережить маршрут');}}
async function dock(p){await steer(p,260,700);await sleep(p,300);const s=await state(p);assert.equal(s.state,'result','Ожидается успешная разгрузка');return s;}
async function purchase(p,id){const b=await state(p);const i=b.offers.indexOf(id);assert(i>=0,'Модуль в предложениях: '+id);await click(p,[400,960,1520][i],455);const a=await state(p);assert.equal(a.credits,b.credits-cfg.prices[id]);await log(p,'покупка '+id);return a;}
async function natural(){const session=await launch(url);const {p,browser}=session;startTime=Date.now();report.startedAt=new Date(startTime).toISOString();report.sourceSha256=require('crypto').createHash('sha256').update(fs.readFileSync(path.join(root,'game.json'))).digest('hex');
 try{
 await shot(p,'01-menu.png');await click(p,960,710);await log(p,'первый вылет');await shot(p,'02-sector1-start.png');
 await targets(p,[cfg.scrap[0]]);report.firstLoot=now();await log(p,'первый лом');
 await targets(p,[cfg.scrap[1]]);await shot(p,'03-sector1-mid-run.png');await targets(p,[cfg.scrap[2]]);await shot(p,'11-new-feature.png');assert((await state(p)).streak>=3);
 await targets(p,[cfg.scrap[3]]);await shot(p,'04-contract-progress.png');
 await targets(p,[cfg.scrap[4],cfg.scrap[5]]);await targets(p,[[800,1500],[470,840]]);await shot(p,'05-return-to-station.png');
 let s=await dock(p);report.firstReturn=now();report.runs.push(await log(p,'контракт 1 и первый возврат'));assert.equal(s.contractsCompleted,1);await shot(p,'06-result.png');
 await click(p,700,580);await shot(p,'07-upgrades.png');await click(p,400,455);assert((await state(p)).status.includes('НЕДОСТАТОЧНО'));report.qa.notEnough=true;
 await click(p,960,930);await targets(p,[cfg.rare[0]]);await dock(p);report.runs.push(await log(p,'контракт 2'));assert.equal((await state(p)).contractsCompleted,2);
 await click(p,700,580);await purchase(p,'hull');report.firstUpgrade=now();await shot(p,'07-upgrades.png');await click(p,960,930);
 await targets(p,[cfg.rare[0],cfg.rare[1]]);await dock(p);s=await log(p,'контракт 3 и технодеталь');report.runs.push(s);assert.equal(s.contractsCompleted,3);assert(s.techParts>0);report.firstTechPart=now();
 await click(p,700,580);report.rerollBefore=(await state(p)).offers;await click(p,890,638);report.rerollAfter=(await state(p)).offers;assert.notDeepEqual(report.rerollBefore,report.rerollAfter);report.qa.reroll=true;
 await purchase(p,'magnet');report.secondUpgrade=now();await shot(p,'07-upgrades.png');await click(p,960,930);
 await targets(p,cfg.scrap.slice(0,4));await targets(p,[[3450,2200],[800,2200],[470,840]]);await dock(p);s=await log(p,'контракт 4');report.runs.push(s);assert.equal(s.contractsCompleted,4);assert.equal(s.sectorUnlocked,1);report.sector2Unlock=now();
 await click(p,1220,580);assert.equal((await state(p)).state,'sectorSelect');await shot(p,'08-sector2-unlock.png');await click(p,1300,670);s=await log(p,'вход в сектор 2');assert.equal(s.sector,2);report.sector2Enter=now();await shot(p,'09-sector2-start.png');
 await targets(p,[cfg.scrap2[0],cfg.scrap2[2],cfg.rare2[0]]);await shot(p,'10-sector2-danger.png');await targets(p,[[cfg.rare2[0][0],1500],[800,1500],[470,840]]);await dock(p);s=await log(p,'успешный возврат из сектора 2');assert(s.hull>0);assert.equal(s.sector,2);report.runs.push(s);report.naturalPlaythroughSeconds=now();report.naturalEnd=s;
 const prior=s.credits;await click(p,960,486);const reward=await state(p);assert.equal(reward.credits,prior+s.cargoValue);await click(p,960,486);assert.equal((await state(p)).credits,reward.credits);report.qa.rewardDouble={before:prior,after:reward.credits,once:true};
 await click(p,700,580);const beforeAd=await state(p);await click(p,890,755);const afterAd=await state(p);assert.notDeepEqual(beforeAd.offers,afterAd.offers);assert.equal(beforeAd.techParts,afterAd.techParts);report.qa.rewardReroll=true;
 const saved=await p.evaluate(()=>JSON.parse(localStorage.getItem('orbitalSalvageSave')));await p.reload({waitUntil:'load'});await p.waitForFunction(()=>window.__osQAState?.state==='menu');const loaded=await state(p);assert.equal(loaded.credits,saved.Credits);assert.equal(loaded.hullMax,4);report.qa.saveReload=true;
 report.cameraEvidence='docs/camera-trace-smart08.csv';
 report.errors.push(...session.errors);report.externalNetwork=session.external;
 }catch(e){report.failure=e.stack;console.error(e.stack);report.failedState=await state(p);await p.screenshot({path:path.join(root,'_tmp-export','smart08-failure.png')});}
 finally{fs.writeFileSync(path.join(root,'docs/smart-polish08-report.json'),JSON.stringify(report,null,2));await browser.close();}
 if(report.failure)process.exitCode=1;
}
natural();
