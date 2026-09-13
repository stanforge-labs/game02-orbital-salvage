process.env.OS_QA_PORT='4236';
const {open,click,read,fs,assert}=require('./release17-qa-lib');
(async()=>{const q=await open({width:1366,height:768}),p=q.p,r={mode:'explicit visual fixtures, then real keyboard side/diagonal flights; not natural progression',views:[],errors:[]};
const shot=async n=>{await p.waitForTimeout(70);await p.screenshot({path:'screenshots/Polish19/'+n+'.png'});const a=await read(p);r.views.push({file:n,seed:a.seed,sector:a.sector,region:a.region});};
const place=async({sector=1,seed=130013,region=0,x,y,stage=0,progress=0,template=0}={})=>{await p.evaluate(a=>{const s=scene15.__os,v=scene15.getVariables();v.get('GameState').setString('play');v.get('CurrentSector').setNumber(a.sector);scene15.__g13Generate(a.seed);const g=scene15.__g13,t=g.regions[a.region];Object.assign(s,{x:a.x??t.x,y:a.y??t.y,vx:0,vy:0,inv:0,floatLife:0,toast:0,onboarding:false});v.get('Hull').setNumber(3);v.get('Cargo').setNumber(0);v.get('RunTime').setNumber(25);v.get('Status').setString('');Object.assign(g.secret,{stage:a.stage,progress:a.progress,template:a.template,map15:scene15.__secretModel15(a.template)});scene15.__radio16.life=0;scene15.__osCam={x:s.x,y:s.y};scene15.getObjects('Ship')[0].setCenterPositionInScene(s.x,s.y);}, {sector,seed,region,x,y,stage,progress,template});await p.waitForTimeout(500);};
try{await click(p,'ButtonBg');
for(const[region,n]of[[0,'05-working-orbit'],[1,'06-debris-field'],[2,'07-satellite-graveyard'],[3,'10-meteor-zone'],[4,'08-mixed-decoration-viewport']]){await place({region});await shot(n);}
for(let i=0;i<8;i++){await place({seed:130013+i*100019,sector:i%2+1,region:i%6});await shot('seed-'+(130013+i*100019));}
await place({x:2300,y:1550});await p.keyboard.down('s');await p.waitForTimeout(3300);await p.keyboard.up('s');await shot('03-sector1-side-route');
await place({x:2600,y:1200});await p.keyboard.down('a');await p.keyboard.down('s');await p.waitForTimeout(3300);await p.keyboard.up('a');await p.keyboard.up('s');await shot('04-sector1-diagonal-route');
await shot('15-objective-marker');
await place({region:1});const loot=(await read(p)).loot.find(o=>o.kind==='energy');await place({x:loot.x-90,y:loot.y+70});await shot('09-loot-readability');
await p.evaluate(()=>{scene15.__os.floatText='СЕРИЯ x3\nБОНУС +5';scene15.__os.floatLife=1;});await shot('feedback-streak');
await p.getByRole('button',{name:'DEV',exact:true}).click();await p.getByRole('button',{name:'ПОГОНЯ',exact:true}).click();await p.getByRole('button',{name:'DEV',exact:true}).click();await p.waitForTimeout(2900);assert.equal((await p.evaluate(()=>scene15.__g13.chase16.phase)),'chasing');await shot('11-meteor-chase');
await place({sector:2,region:3,seed:230032});await shot('22-sector2-hazard');await place({sector:2,region:5,seed:230032});await shot('21-sector2-environment');
const a=await read(p);await place({sector:2,seed:230032,x:a.signal.x-110,y:a.signal.y+80,stage:1});await shot('signal-locked');await place({sector:2,seed:230032,x:a.key.x-100,y:a.key.y+70,stage:1});await shot('access-key');
const model=require('./release16-secret-model')(0);await place({sector:2,stage:4,x:model.points[2][0],y:model.points[2][1]});await shot('25-secret-room');
const gate=model.gates[0];await place({sector:2,stage:4,x:gate.x-75,y:gate.y+75});await p.evaluate(()=>scene15.__os.phase=1.2);await shot('26-laser-challenge');
await place({sector:2,stage:4,progress:6,x:model.cache[0]-100,y:model.cache[1]});await p.evaluate(()=>{scene15.__ui17.secretNavKey=scene15.__g13.seed+':'+scene15.getVariables().get('RunCount').getAsNumber()+':0';scene15.__ui17.secretWaypoint=scene15.__g13.secret.map15.points.length-1;});await shot('cache-before-pickup');
await place({sector:2,region:2,seed:730127});await shot('30-performance-heavy-viewport');
}catch(e){r.failure=e.stack;console.error(e);}finally{r.errors=q.errors;fs.writeFileSync('docs/polish19-visual.json',JSON.stringify(r,null,2));await q.browser.close();}})();
