// Internal QA only. Does not edit the game or captured gameplay pixels.
const fs=require('fs'),path=require('path'),sharp=require('../tools/media/node_modules/sharp');
async function sheet(files,out,columns=3){
 const w=480,h=300,rows=Math.ceil(files.length/columns),layers=[];
 for(let i=0;i<files.length;i++){
  const item=typeof files[i]==='string'?{file:files[i],label:path.basename(files[i])}:files[i];
  const thumb=await sharp(item.file).resize(464,262,{fit:'contain',background:'#071522'}).png().toBuffer();
  const text=item.label.replace(/[<&]/g,'');
  const label=Buffer.from(`<svg width="480" height="30"><rect width="480" height="30" fill="#071522"/><text x="8" y="21" fill="#cde8ef" font-size="15" font-family="sans-serif">${text}</text></svg>`);
  layers.push({input:thumb,left:(i%columns)*w+8,top:Math.floor(i/columns)*h},{input:label,left:(i%columns)*w,top:Math.floor(i/columns)*h+264});
 }
 await sharp({create:{width:w*columns,height:rows*h,channels:3,background:'#071522'}}).composite(layers).removeAlpha().png().toFile(out);
}
if(require.main===module){const dir=process.argv[2],out=process.argv[3];sheet(fs.readdirSync(dir).filter(x=>x.endsWith('.png')).map(x=>path.join(dir,x)),out).catch(e=>{console.error(e);process.exitCode=1;});}
module.exports=sheet;
