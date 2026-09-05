const {fs,path,assert,root,sleep,state,click,steer,launch,nativeHud}=require('./smart08-play');
const cfg=require('./smart08-config'),url='http://127.0.0.1:4222/index.html';
const results={fixtures:true,errors:[]};
async function done(s){results.errors.push(...s.errors);await s.browser.close();}
async function main(){
 // Returning with one item must not complete either of these contracts.
 for(const [count,type]of [[3,'nodamage'],[4,'speed']]){const s=await launch(url,{width:1920,height:1080},false,{ContractsCompleted:count,OnboardingSeen:1});const p=s.p;await click(p,960,710);assert.equal((await state(p)).missionType,type);await steer(p,...cfg.scrap[0]);await steer(p,260,700);const after=await state(p);assert.equal(after.state,'result');assert.equal(after.contractsCompleted,count);results[type+'EarlyReturnRejected']=true;await done(s);}
 // Measure the actual distance at pickup with and without the magnet.
 results.magnetDistances=[];
 for(const level of [0,1]){const s=await launch(url,{width:1920,height:1080},false,{MagnetLevel:level,OnboardingSeen:1});const p=s.p;await click(p,960,710);await steer(p,350,800,20);await p.keyboard.down('d');let point;
 for(let i=0;i<200;i++){await sleep(p,20);point=await state(p);if(point.cargo>0)break;}await p.keyboard.up('d');assert(point.cargo>0);const distance=Math.hypot(point.shipX-cfg.scrap[0][0],point.shipY-cfg.scrap[0][1]);results.magnetDistances.push(distance);await done(s);}
 assert(results.magnetDistances[1]>results.magnetDistances[0]+15);
 // Radar has a real effect on the native HUD (remaining journey time and loot value).
 const radar=await launch(url,{width:1920,height:1080},false,{RadarLevel:1,OnboardingSeen:1});let p=radar.p;await click(p,960,710);await steer(p,1200,700);results.radarHud=await nativeHud(p);assert.match(results.radarHud.NavMarker,/СЕК ДО БАЗЫ/);assert.match(results.radarHud.ObjectiveText,/ЦЕННОСТЬ/);await done(radar);
 // Real danger-contract pickups are authored inside the marked pocket.
 for(const point of cfg.scrap2.slice(6))assert(Math.hypot(point[0]-cfg.danger.x,point[1]-cfg.danger.y)<cfg.danger.radius);
 const danger=await launch(url,{width:1920,height:1080},false,{ContractsCompleted:5,CurrentSector:2,SectorUnlocked:1,HullMax:4,Hull:4,OnboardingSeen:1});p=danger.p;await click(p,960,710);assert.equal((await state(p)).missionType,'danger');await steer(p,800,130);await steer(p,cfg.scrap2[6][0],130);await steer(p,...cfg.scrap2[6]);await steer(p,...cfg.scrap2[7]);let ds=await state(p);assert.equal(ds.missionProgress,2);assert(ds.hull>0);await steer(p,cfg.scrap2[7][0],130);await steer(p,700,130);await steer(p,260,700);ds=await state(p);assert.equal(ds.state,'result');assert.equal(ds.contractsCompleted,6);assert(ds.techParts>0);results.dangerCompleted=ds;await done(danger);
 assert.equal(results.errors.length,0);fs.writeFileSync(path.join(root,'docs/smart-polish08-contract-checks.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results));
}
main().catch(e=>{results.failure=e.stack;fs.writeFileSync(path.join(root,'docs/smart-polish08-contract-checks.json'),JSON.stringify(results,null,2));console.error(e);process.exit(1);});
