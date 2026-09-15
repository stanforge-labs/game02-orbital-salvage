const fs=require('fs'),Module=require('module'),path=require('path');
require('./closeout-lib');
const file=path.join(__dirname,'yandex-adapter-test.js');
const source=fs.readFileSync(file,'utf8').replace('assets/game/yandex-production.js','_tmp-export/yandex-zip-d6113e68ff1849a991ba891de4da6d28/yandex-adapter.js').replace('docs/yandex-ads-unit.json','docs/closeout-adapter.json');
const mod=new Module(file,module);mod.filename=file;mod.paths=Module._nodeModulePaths(__dirname);mod._compile(source,file);
