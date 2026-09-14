const fs=require('fs'),Module=require('module'),path=require('path');
const file=path.join(__dirname,'polish19-safe-qa.js');
const source=fs.readFileSync(file,'utf8').replaceAll("'4236'","'4237'").replaceAll('screenshots/Polish19/','screenshots/WorldArtGeneration20/responsive-').replaceAll('docs/polish19-safe-responsive.json','docs/world20-responsive.json');
const mod=new Module(file,module);mod.filename=file;mod.paths=Module._nodeModulePaths(__dirname);mod._compile(source,file);
