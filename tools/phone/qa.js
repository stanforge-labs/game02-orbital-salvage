'use strict';
// Infrastructure only: no game state writes. Run with the phone launcher stopped.
const {spawn}=require('child_process'),http=require('http'),fs=require('fs'),path=require('path'),assert=require('assert');
const QRDecode=require('jsqr'),PNG=require('pngjs').PNG;
const project=path.resolve(__dirname,'../..'),ip=process.argv[2];
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const get=url=>new Promise((resolve,reject)=>http.get(url,r=>{const chunks=[];r.on('data',x=>chunks.push(x));r.on('end',()=>resolve({status:r.statusCode,headers:r.headers,body:Buffer.concat(chunks)}));}).on('error',reject));
function launch(batch=false){const p=spawn(batch?'cmd.exe':'powershell.exe',batch?['/d','/c','PLAY_ON_PHONE.bat','-Port','4247']:['-NoProfile','-ExecutionPolicy','Bypass','-File','tools/PLAY_ON_PHONE.ps1','-NoBrowser','-Port','4247'],{cwd:project,windowsHide:true,stdio:['pipe','pipe','pipe']});let out='';p.stdout.on('data',b=>out+=b);p.stderr.on('data',b=>out+=b);return{p,output:()=>out};}
async function ready(x){for(let i=0;i<100;i++){if(x.output().includes('Press ENTER'))return;if(x.p.exitCode!==null)throw Error(x.output());await pause(200);}throw Error('Launcher timeout '+x.output());}
async function stop(x){x.p.stdin.write('\n');for(let i=0;i<50;i++){if(x.p.exitCode!==null)return;await pause(100);}throw Error('Stop timeout');}
(async()=>{const report={checks:[],ip},owned=[];let blocker;
try{
 const a=launch(true);owned.push(a);await ready(a);assert(a.output().includes(`http://${ip}:4247/`));report.checks.push('BAT entrypoint, build resolution, LAN IP and default browser launch');
 const status=JSON.parse((await get('http://127.0.0.1:4247/__phone_test/status')).body);assert.equal(status.bind,'0.0.0.0');assert.equal(status.root,path.join(project,'exports/worldart20'));report.build=status.root;
 const lan=await get(`http://${ip}:4247/`);assert.equal(lan.status,200);assert(lan.headers['cache-control'].includes('no-store'));assert(lan.body.equals(fs.readFileSync(path.join(status.root,'index.html'))));
 for(const file of ['data.js','code0.js'])assert((await get(`http://${ip}:4247/${file}`)).headers['cache-control'].includes('no-store'));
 const png=PNG.sync.read(fs.readFileSync(path.join(project,'PHONE_QR.png'))),decoded=QRDecode(new Uint8ClampedArray(png.data),png.width,png.height);assert.equal(decoded.data,`http://${ip}:4247/`);report.qr=decoded.data;report.checks.push('LAN GET, exact PC build bytes, no-cache HTML/JS, PNG QR decoded');
 const b=launch();owned.push(b);await ready(b);assert(b.output().includes('Reusing'));const reused=JSON.parse((await get('http://127.0.0.1:4247/__phone_test/status')).body);assert.equal(reused.pid,status.pid);await stop(b);assert.equal((await get(`http://${ip}:4247/`)).status,200);await stop(a);report.checks.push('repeat launch shares one server; secondary exit preserves owner');
 blocker=http.createServer((q,r)=>r.end('foreign process'));await new Promise((r,j)=>blocker.once('error',j).listen(4247,'0.0.0.0',r));
 const c=launch();owned.push(c);await ready(c);assert(c.output().includes(`http://${ip}:4248/`));assert.equal((await get('http://127.0.0.1:4247/')).body.toString(),'foreign process');await stop(c);
 const probe=http.createServer();await new Promise((r,j)=>probe.once('error',j).listen(4248,'0.0.0.0',r));await new Promise(r=>probe.close(r));await new Promise(r=>blocker.close(r));blocker=null;
 report.checks.push('occupied 4247 preserved; fallback 4248; ports freed on ENTER');
 report.pass=true;
}finally{for(const a of owned)if(a.p.exitCode===null)await stop(a);if(blocker)await new Promise(r=>blocker.close(r));console.log(JSON.stringify(report,null,2));}
})().catch(e=>{console.error(e);process.exitCode=1;});
