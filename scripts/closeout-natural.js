const fs=require('fs'),Module=require('module'),path=require('path');
require('./closeout-lib'); // Assert final archive hash before opening a fresh context.
if(process.env.YANDEX_QA_PORT!=='4250')throw Error('Use exact extracted closeout ZIP on 4250');
const file=path.join(__dirname,'yandex-natural.js');let source=fs.readFileSync(file,'utf8')
 .replaceAll('yandex-natural-','closeout-natural-')
 .replaceAll('FinalYandexRelease','YandexCloseout')
 .replaceAll('yandex-performance.json','closeout-performance.json');
const mod=new Module(file,module);mod.filename=file;mod.paths=Module._nodeModulePaths(__dirname);mod._compile(source,file);
