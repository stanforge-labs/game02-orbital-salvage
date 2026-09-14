const{open,read,fs}=require('./yandex-qa-lib'),assert=require('assert');
(async()=>{const r={views:[],errors:[]},out='screenshots/FinalYandexRelease';fs.mkdirSync(out,{recursive:true});
for(const[w,h,m]of[[1920,1080,0],[1600,900,0],[1536,864,0],[1440,900,0],[1366,768,0],[1280,720,0],[1917,920,0],[640,360,1],[844,390,1],[844,294,1],[390,844,1]]){
 const q=await open({width:w,height:h},!!m),p=q.p,v={w,h,mobile:!!m};try{
 const shot=async n=>p.screenshot({path:out+'/'+n+'.png'});
 if(h>w){assert.equal((await read(p)).state,'rotate');await shot('21-portrait-rotate');continue;}
 const bounds=await p.evaluate(()=>{const r=document.getElementById('game-canvas21').getBoundingClientRect();return{width:r.width,height:r.height,left:r.left};});v.canvas=bounds;assert(Math.abs(bounds.height-h)<2);assert(m||bounds.width/bounds.height<=2.001);
 if(w===1920)await shot('01-menu');await p.getByRole('button',{name:'НАЧАТЬ ВЫЛЕТ',exact:true}).click();await p.waitForTimeout(180);
 await shot('viewport-'+w+'x'+h);if(m)await shot('19-mobile-landscape');
 await p.getByRole('button',{name:'Ⅱ ПАУЗА',exact:true}).click();await p.waitForTimeout(150);const t=(await read(p)).runTime;await p.waitForTimeout(220);assert.equal((await read(p)).runTime,t);await shot(m?'20-mobile-pause':'06-pause');
 for(const state of ['upgrades','result','fail','resetConfirm','sectorSelect','journal17']){await p.evaluate(s=>scene15.getVariables().get('GameState').setString(s),state);await p.waitForTimeout(100);const clips=await p.evaluate(()=>[...document.querySelectorAll('#shell17 .card')].filter(x=>x.getBoundingClientRect().height).some(x=>{const r=x.getBoundingClientRect();return r.top<0||r.bottom>innerHeight+1}));assert(!clips,state+' clips');}
 v.pass=true;
 }catch(e){v.failure=e.message;}finally{v.errors=q.errors;r.errors.push(...q.errors);r.views.push(v);await q.browser.close();}
}r.pass=r.views.every(v=>!v.failure)&&!r.errors.length;fs.writeFileSync('docs/yandex-responsive.json',JSON.stringify(r,null,2));console.log(r);})();
