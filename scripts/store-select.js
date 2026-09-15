const fs=require('fs'),path=require('path'),sharp=require('../tools/media/node_modules/sharp');
const selection=require('../release/store_media/source/selection.json');
(async()=>{
 for(const item of selection.screenshots){const src=path.join('_tmp-export',item.source),dst=path.join('release/store_media/screenshots',item.platform,item.output);if(!fs.existsSync(src)){console.log('Pending',src);continue;}await sharp(src).removeAlpha().png({compressionLevel:9}).toFile(dst);console.log(dst);}
})().catch(e=>{console.error(e);process.exitCode=1;});
