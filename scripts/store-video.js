// Real continuous clips from Playwright's production capture; no synthetic scenes.
const fs=require('fs'),path=require('path'),cp=require('child_process');
const sharp=require('../tools/media/node_modules/sharp'),ffmpeg=require('../tools/media/node_modules/ffmpeg-static'),ffprobe=require('../tools/media/node_modules/ffprobe-static').path;
const root='release/store_media',capture=require('../_tmp-export/store-desktop/capture.json');
const run=args=>{const r=cp.spawnSync(ffmpeg,['-hide_banner','-loglevel','error','-y',...args],{maxBuffer:100*1024*1024});if(r.status!==0)throw Error(r.stderr.toString());return r.stdout;};
async function align(name){const t=capture.timeline.find(x=>x.file===name),start=t.seconds-3,w=192,h=108,bytes=w*h*3;
 const target=await sharp(path.join('_tmp-export/store-desktop',name)).resize(w,h,{fit:'fill'}).removeAlpha().raw().toBuffer();
 const frames=run(['-ss',String(start),'-i',capture.video,'-t','4','-vf',`scale=${w}:${h}`,'-f','rawvideo','-pix_fmt','rgb24','pipe:1']);let best={error:Infinity};
 for(let i=0;i<Math.floor(frames.length/bytes);i++){let error=0;for(let j=0;j<bytes;j++)error+=Math.abs(target[j]-frames[i*bytes+j]);error/=bytes;if(error<best.error)best={error,videoSeconds:start+i/25,captureSeconds:t.seconds,offset:t.seconds-(start+i/25)};}
 return best;
}
async function main(){
 if(process.argv[2]==='align'){console.log(JSON.stringify(await align(process.argv[3]||'loot-5.png'),null,2));return;}
 const edit=JSON.parse(fs.readFileSync(root+'/source/video-edit.json','utf8'));
 const inputs=edit.clips.flatMap(c=>['-ss',String(c.sourceStart),'-t',String(c.duration),'-i',capture.video]);
 const filters=edit.clips.map((c,i)=>`[${i}:v]setpts=PTS-STARTPTS,setsar=1,fps=25[v${i}]`).join(';')+';'+edit.clips.map((_,i)=>`[v${i}]`).join('')+`concat=n=${edit.clips.length}:v=1:a=0[out]`;
 run([...inputs,'-filter_complex',filters,'-map','[out]','-an','-c:v','libx264','-preset','medium','-crf','19','-threads','4','-pix_fmt','yuv420p','-movflags','+faststart',root+'/video/gameplay_16x9.mp4']);
 const probe=JSON.parse(cp.execFileSync(ffprobe,['-v','error','-show_streams','-show_format','-of','json',root+'/video/gameplay_16x9.mp4'],{encoding:'utf8'}));
 fs.writeFileSync(root+'/source/video-probe.json',JSON.stringify(probe,null,2));
 // Decode the complete deliverable, then retain 2 fps QA thumbnails outside the package.
 run(['-i',root+'/video/gameplay_16x9.mp4','-f','null','-']);
 fs.mkdirSync('_tmp-export/store-video-review',{recursive:true});
 run(['-i',root+'/video/gameplay_16x9.mp4','-vf','fps=2,scale=480:270','_tmp-export/store-video-review/frame-%03d.png']);
 console.log(JSON.stringify(probe.format));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
