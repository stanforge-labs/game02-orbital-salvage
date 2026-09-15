const fs=require('fs'),path=require('path');
const pw=require(require.resolve('playwright-core',{paths:[process.cwd(),path.join(process.env.USERPROFILE,'Documents/ChatGPT/Yandex Games')]}));
(async()=>{
 const cache=path.join(process.env.LOCALAPPDATA,'ms-playwright');
 const bin=fs.readdirSync(cache).filter(x=>/^chromium-\d+$/.test(x)).sort((a,b)=>Number(b.split('-')[1])-Number(a.split('-')[1])).map(x=>path.join(cache,x,'chrome-win64/chrome.exe')).find(x=>fs.existsSync(x));
 const browser=await pw.chromium.launch({headless:true,executablePath:bin}),p=await browser.newPage(),errors=[];
 try{
  p.on('pageerror',e=>errors.push(e.message));
  await p.route('http://media.test/gameplay.mp4',r=>r.fulfill({path:path.resolve('release/store_media/video/gameplay_16x9.mp4'),contentType:'video/mp4'}));
  await p.setContent('<video id="v" muted playsinline src="http://media.test/gameplay.mp4"></video>');
  const report=await p.evaluate(async()=>{const v=document.getElementById('v');let frames=0;const sample=()=>{frames++;if(!v.ended)v.requestVideoFrameCallback(sample);};v.requestVideoFrameCallback(sample);await v.play();await new Promise((resolve,reject)=>{v.onended=resolve;v.onerror=()=>reject(Error(v.error?.message));setTimeout(()=>reject(Error('Playback timeout')),35000);});return{ended:v.ended,currentTime:v.currentTime,width:v.videoWidth,height:v.videoHeight,frames,quality:v.getVideoPlaybackQuality().toJSON?.()||{totalVideoFrames:v.getVideoPlaybackQuality().totalVideoFrames,droppedVideoFrames:v.getVideoPlaybackQuality().droppedVideoFrames}};});
  fs.writeFileSync('release/store_media/source/video-playback.json',JSON.stringify({browser:'Chromium',...report,errors},null,2));console.log(report);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
