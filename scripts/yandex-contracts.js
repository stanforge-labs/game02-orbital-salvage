// Explicit isolated fixtures; not used as natural progression evidence.
const fs=require('fs'),Module=require('module'),path=require('path');
const file=path.join(__dirname,'release17-contracts.js');
let source=fs.readFileSync(file,'utf8').replace("require('./release17-qa-lib')","require('./yandex-qa-lib')").replace('docs/release17-contracts.json','docs/yandex-contracts.json');
source=source.replace('entry.positive=s.state',"entry.saved=await p.evaluate(()=>JSON.parse(localStorage.getItem('orbitalSalvageSave')).ContractsCompleted);entry.positive=s.state");
const mod=new Module(file,module);mod.filename=file;mod.paths=Module._nodeModulePaths(__dirname);mod._compile(source,file);
