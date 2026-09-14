// Visual-only fixtures. Natural progression evidence is in yandex-natural-*.
const{open,click,read,fs}=require('./yandex-qa-lib');
(async()=>{const q=await open(),p=q.p,r={mode:'explicit visual fixtures, no developer UI',shots:[]};try{await click(p,'ButtonBg');
await p.evaluate(()=>{const g=scene15.__g13,s=scene15.__os,z=g.regions.find(x=>x.id==='meteor');s.x=z.x;s.y=z.y;s.vx=s.vy=0;s.inv=3;scene15.getObjects('Ship')[0].setCenterPositionInScene(s.x,s.y);scene15.__osCam={x:s.x,y:s.y};g.meteor.clock=4.2;});await p.waitForTimeout(800);await p.screenshot({path:'screenshots/FinalYandexRelease/04-meteor.png'});r.shots.push('04-meteor');
await p.evaluate(()=>{const g=scene15.__g13;g.chase16.phase='warning';g.chase16.time=.2;g.chase16.region=g.region;});await p.waitForTimeout(600);await p.screenshot({path:'screenshots/FinalYandexRelease/05-chase.png'});r.shots.push('05-chase');
}catch(e){r.failure=e.message;}finally{r.errors=q.errors;fs.writeFileSync('docs/yandex-visual-fixtures.json',JSON.stringify(r,null,2));await q.browser.close();}})();
