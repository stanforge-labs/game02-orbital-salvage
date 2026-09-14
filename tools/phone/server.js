'use strict';
const http=require('http'),fs=require('fs'),path=require('path'),readline=require('readline'),{spawn}=require('child_process');
const QR=require('qrcode');
const args=process.argv.slice(2),arg=(n,d)=>{const i=args.indexOf(n);return i<0?d:args[i+1];};
const root=fs.realpathSync(arg('--root')),ip=arg('--ip'),preferred=Number(arg('--port','4237'));
if(!/^\d+\.\d+\.\d+\.\d+$/.test(ip)||ip.startsWith('127.')||!Number.isInteger(preferred)||preferred<1024||preferred>65515)throw Error('Invalid LAN address or port');
const project=path.resolve(__dirname,'../..'),statusPath='/__phone_test/status';
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon','.ttf':'font/ttf','.woff2':'font/woff2','.ogg':'audio/ogg','.mp3':'audio/mpeg','.wav':'audio/wav'};
function request(url){return new Promise(resolve=>{let connected=false;const q=http.get(url,r=>{let s='';r.on('data',b=>{if(s.length<16384)s+=b;});r.on('end',()=>resolve({code:r.statusCode,text:s}));});q.on('socket',s=>s.once('connect',()=>connected=true));q.setTimeout(800,()=>q.destroy());q.on('error',()=>resolve(connected?{code:0,text:''}:null));});}
function handler(req,res){
 res.setHeader('Cache-Control','no-store, no-cache, must-revalidate, max-age=0');res.setHeader('Pragma','no-cache');res.setHeader('Expires','0');res.setHeader('X-Content-Type-Options','nosniff');
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end();}
 let url;try{url=decodeURIComponent(req.url.split('?')[0]);}catch{res.writeHead(400);return res.end();}
 if(url===statusPath){if(req.socket.remoteAddress!=='127.0.0.1'){res.writeHead(403);return res.end();}res.setHeader('Content-Type','application/json');return res.end(JSON.stringify({tool:'orbital-phone-v1',root,pid:process.pid,bind:'0.0.0.0'}));}
 const candidate=path.resolve(root,'.'+(url==='/'?'/index.html':url));
 if(!candidate.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
 fs.realpath(candidate,(e,real)=>{if(e){res.writeHead(404);return res.end('Not found');}if(!real.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
 fs.stat(real,(e,s)=>{if(e||!s.isFile()){res.writeHead(404);return res.end('Not found');}res.setHeader('Content-Type',mime[path.extname(real).toLowerCase()]||'application/octet-stream');res.setHeader('Content-Length',s.size);if(req.method==='HEAD')return res.end();const stream=fs.createReadStream(real);stream.on('error',()=>res.destroy());stream.pipe(res);});});
}
async function start(){
 let server,port,owned=false;
 for(port=preferred;port<preferred+20;port++){
   const existing=await request(`http://127.0.0.1:${port}${statusPath}`);
   if(existing?.code===200){try{const s=JSON.parse(existing.text);if(s.tool==='orbital-phone-v1'&&s.root===root&&s.bind==='0.0.0.0'){console.log('Reusing existing PHONE TEST server.');break;}}catch{}}
   // Windows can allow separate wildcard/loopback listeners on one port.
   // Any foreign HTTP response means occupied, even if wildcard bind succeeds.
   if(existing){console.log(`Port ${port} busy; leaving its process untouched.`);continue;}
   const candidate=http.createServer(handler);
   const ok=await new Promise((resolve,reject)=>{candidate.once('error',e=>e.code==='EADDRINUSE'?resolve(false):reject(e));candidate.listen({port,host:'0.0.0.0',exclusive:true},()=>resolve(true));});
   if(ok){server=candidate;owned=true;break;}console.log(`Port ${port} busy; leaving its process untouched.`);
 }
 if(port>=preferred+20)throw Error('No free phone-test port found.');
 const phone=`http://${ip}:${port}/`,pc=`http://127.0.0.1:${port}/`;
 try{
 await QR.toFile(path.join(project,'PHONE_QR.png'),phone,{width:480,margin:4,errorCorrectionLevel:'M'});
 console.log('\n========================================\n ORBITAL SALVAGE - PHONE TEST\n========================================\nPC:\n'+pc+'\n\nPHONE:\n'+phone+'\n\nТелефон и ПК должны быть в одной Wi-Fi сети.\n\nQR CODE:');
 console.log(await QR.toString(phone,{type:'terminal',small:true,errorCorrectionLevel:'M'}));
 const check=await request(phone);
 console.log(`Server: RUNNING (${owned?'owned by this window':'shared; owner window must stay open'})\nBuild: ${root}\nIP: ${ip}\nPort: ${port}\nLAN request from PC: ${check?.code===200?'OK':'FAILED'}\nNetwork profile: ${arg('--profile','unknown')}`);
 const quote=s=>"'"+s.replace(/'/g,"''")+"'";
 console.log('\nWindows Firewall может блокировать подключение телефона. Проверка с ПК не доказывает доступ с телефона.\nЕсли телефон не подключается, выполните от администратора только это узкое правило:\n'+
 `New-NetFirewallRule -DisplayName 'Orbital Salvage PHONE ${port}' -Direction Inbound -Action Allow -Protocol TCP -LocalPort ${port} -LocalAddress ${ip} -RemoteAddress LocalSubnet -Program ${quote(process.execPath)} -InterfaceAlias ${quote(arg('--interface',''))} -Profile Any`+
 `\nУдалить правило после теста: Remove-NetFirewallRule -DisplayName 'Orbital Salvage PHONE ${port}'`);
 console.log('\nДля проверки:\n1. ПК и телефон — один Wi-Fi.\n2. Сканировать QR.\n3. Повернуть телефон горизонтально.\n4. Проверить touch.\n5. Проверить звук.\n6. Проверить HUD и safe areas.\n7. Проверить FPS/подлагивания.\n');
 if(!args.includes('--no-browser')){const child=spawn('powershell.exe',['-NoProfile','-Command',`Start-Process '${pc}'`],{windowsHide:true,stdio:'ignore'});child.on('error',e=>console.error('Open browser manually:',pc,e.message));}
 console.log(owned?'Press ENTER to stop server.':'Press ENTER to close this launcher (shared server stays running).');
 const input=readline.createInterface({input:process.stdin,output:process.stdout});
 const stop=()=>{input.close();if(server){server.close();server.closeAllConnections();}process.exit(0);};
 input.once('line',stop);input.once('close',()=>{if(server){server.close();server.closeAllConnections();}});process.once('SIGINT',stop);process.once('SIGTERM',stop);
 }catch(e){if(server){server.close();server.closeAllConnections();}throw e;}
}
start().catch(e=>{console.error(e);process.exitCode=1;});
