// Continue the unmodified, genuinely earned browser save. Never manufacture progression.
const {open,read,click,go}=require('./closeout-lib'),fs=require('fs');
(async()=>{
 const saved='_tmp-export/store-mobile-detail/earned-storage.json';
 const q=await open({width:1920,height:1080},false,{storageState:saved}),p=q.p,dir='_tmp-export/store-desktop-detail',events=[];fs.mkdirSync(dir,{recursive:true});
 try{
  await click(p,'ButtonBg');let s=await read(p);
  if(s.state==='sectorSelect')await click(p,'SectorSelectButtonBg',1);
  s=await read(p);if(s.sector!==2)throw Error('Earned Sector 2 not selected');
  for(const label of ['signal','key']){s=await read(p);const target=s[label];await go(p,target.x,target.y,45);s=await read(p);if(s.state!=='play')throw Error('Flight ended during capture');await p.screenshot({path:dir+'/'+label+'.png'});events.push({label,sector:s.sector,seed:s.seed,ship:[s.shipX,s.shipY],hull:s.hull,credits:s.credits,contracts:s.contractsCompleted,sourceSave:saved});}
 }finally{fs.writeFileSync(dir+'/evidence.json',JSON.stringify({mode:'Normal continue from captured earned storage; real keys/clicks only',events,errors:q.errors},null,2));await q.browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
