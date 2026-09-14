const fs=require('fs'),path=require('path'),Module=require('module');
process.env.OS_QA_PORT='4237';
const name=process.argv[2];if(!['ads-qa','save-qa'].includes(name))throw Error('Expected ads-qa or save-qa');
const file=path.join(__dirname,'release17-'+name+'.js');
const source=fs.readFileSync(file,'utf8').replaceAll('docs/release17-','docs/world20-');
const m=new Module(file,module);m.filename=file;m.paths=Module._nodeModulePaths(__dirname);m._compile(source,file);
