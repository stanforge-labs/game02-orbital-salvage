// Reuse proven regression scenarios against the new export, but never overwrite
// Release17 evidence. Only output destinations change; assertions stay intact.
const fs=require('fs'),path=require('path'),Module=require('module');
process.env.OS_QA_PORT='4235';
const name=process.argv[2];if(!/^[a-z0-9-]+$/.test(name||''))throw Error('Scenario required');
const file=path.join(__dirname,'release17-'+name+'.js');
let source=fs.readFileSync(file,'utf8').replaceAll('screenshots/FinalPreRelease17','screenshots/Polish18').replaceAll('docs/release17-','docs/polish18-').replaceAll("'release17-natural-'","'polish18-natural-'").replaceAll("'release17-newcomer'","'polish18-newcomer'");
source=source.replaceAll('http://127.0.0.1:4234','http://127.0.0.1:4235');
if(name==='proof')source=source.replace('g.chain17=null;','g.chain17=null;scene15.__ui17.tracked=null;');
// Existing CLI scenarios consume argv[2] as an id/template, not this runner name.
process.argv.splice(2,1);fs.mkdirSync('screenshots/Polish18',{recursive:true});
const mod=new Module(file,module);mod.filename=file;mod.paths=Module._nodeModulePaths(__dirname);mod._compile(source,file);
