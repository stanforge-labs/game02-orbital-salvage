const {launch,sleep,fs,path,root}=require('./smart08-play');
(async()=>{const {browser,p,errors}=await launch('http://127.0.0.1:4232/index.html');
try{await p.evaluate(()=>{const f=gdjs.RuntimeScene.prototype.renderAndStep;gdjs.RuntimeScene.prototype.renderAndStep=function(...a){window.scene15=this;return f.apply(this,a);};});await sleep(p,200);
const out=path.join(root,'_tmp-export','release15-smoke');fs.mkdirSync(out,{recursive:true});
await p.screenshot({path:path.join(out,'menu.png')});const b=await p.evaluate(()=>{const o=scene15.getObjects('ButtonBg')[0];return {x:o.getX()+o.getWidth()/2,y:o.getY()+o.getHeight()/2};});await p.mouse.click(b.x,b.y);await sleep(p,1200);
await p.screenshot({path:path.join(out,'start.png')});console.log(JSON.stringify(await p.evaluate(()=>({state:window.__osQAState,regions:window.scene15.__g13.regions,structures:window.scene15.__g13.structures})),null,2));
await p.keyboard.down('d');await sleep(p,2500);await p.keyboard.up('d');await p.screenshot({path:path.join(out,'flight.png')});console.log(JSON.stringify({errors}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
