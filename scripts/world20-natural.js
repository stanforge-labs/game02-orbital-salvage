// Reuse the verified read-only navigator. No coordinates/progress/HP are written.
const fs=require('fs'),Module=require('module'),path=require('path');
const file=path.join(__dirname,'polish19-natural.js');
const source=fs.readFileSync(file,'utf8').replaceAll("'4236'","'4237'").replaceAll('screenshots/Polish19/','screenshots/WorldArtGeneration20/natural-').replaceAll('polish19-natural-','world20-natural-').replaceAll('docs/polish19-traversal-performance.json','docs/world20-traversal-performance.json').replaceAll('docs/polish19-trace-events.json','docs/world20-trace-events.json');
const synchronized=source.replace("await p.getByRole('button',{name:'ПРОДОЛЖИТЬ',exact:true}).click();", "await p.getByRole('button',{name:'ПРОДОЛЖИТЬ',exact:true}).click();await p.waitForFunction(()=>window.__osQAState?.state==='play');");
const mod=new Module(file,module);mod.filename=file;mod.paths=Module._nodeModulePaths(__dirname);mod._compile(synchronized,file);
