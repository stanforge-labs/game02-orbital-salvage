// Fresh real play: no progression, position, HP, credits or seed writes.
const fs=require('fs'),Module=require('module'),path=require('path'),platform=process.env.STORE_CAPTURE_ID||process.env.STORE_PLATFORM||'desktop';
const file=path.join(__dirname,'release17-natural.js');let source=fs.readFileSync(file,'utf8').replace("require('./release17-qa-lib')","require('./store-media-lib')");
source=source.replace("console.log(name,","await require('./store-media-lib').event(p,name,s);console.log(name,");
source=source.replace("await steer(p,...pt,16);","await steer(p,...pt,16);await require('./store-media-lib').capture(p,'secret-point-'+i,await read(p));");
source=source.replace("path.join(root,'docs','release17-natural-'+id+'.json')","path.join(root,'_tmp-export','store-"+platform+"-natural.json')").replace("'release17-natural-'+id","'store-"+platform+"-results'");
const mod=new Module(file,module);mod.filename=file;mod.paths=Module._nodeModulePaths(__dirname);mod._compile(source,file);
