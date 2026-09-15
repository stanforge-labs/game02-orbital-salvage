const fs=require('fs'),crypto=require('crypto'),selection=require('../release/store_media/source/selection.json');
const runs=['desktop','mobile','mobile-detail'].map(id=>{
 const capture=JSON.parse(fs.readFileSync(`_tmp-export/store-${id}/capture.json`,'utf8')),natural=JSON.parse(fs.readFileSync(`_tmp-export/store-${id}-natural.json`,'utf8'));
 return{id,sha256:capture.sha,platform:capture.platform,seconds:natural.seconds,mode:natural.mode,errors:capture.errors,timeline:capture.timeline.map(({file,seconds,sector,seed})=>({file,seconds,sector,seed})),progression:natural.events.map(e=>({name:e.name,seconds:e.seconds,failure:e.failure,...(e.state?{state:e.state.state,sector:e.state.sector,seed:e.state.seed,credits:e.state.credits,contracts:e.state.contractsCompleted,cargo:e.state.cargo,hull:e.state.hull,secretStage:e.state.secret?.stage,secretProgress:e.state.secret?.progress}:{})}))};
});
const detail=JSON.parse(fs.readFileSync('_tmp-export/store-desktop-detail/evidence.json','utf8'));
fs.writeFileSync('release/store_media/source/capture-evidence.json',JSON.stringify({sha256:selection.productionSHA256,captureDate:'2026-09-15',runs,desktopDetail:detail,earnedStorageSHA256:crypto.createHash('sha256').update(fs.readFileSync('_tmp-export/store-mobile-detail/earned-storage.json')).digest('hex')},null,2));
