const fs=require('fs'),path=require('path'),terser=require('../tools/release/node_modules/terser');
(async()=>{
 const root=path.resolve('exports/yandex-production');
 let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 html=html.replace(/<script>if \(location.hostname[\s\S]*?<\/script>/,'');
 fs.writeFileSync(path.join(root,'index.html'),html);
 fs.copyFileSync('assets/game/yandex-production.js',path.join(root,'yandex-adapter.js'));
 // Engine renderer constructor remains compatible; diagnostic drawing is absent.
 fs.writeFileSync(path.join(root,'pixi-renderers/DebuggerPixiRenderer.js'),'gdjs.DebuggerRenderer=gdjs.DebuggerPixiRenderer=class{getRendererObject(){return null}renderDebugDraw(){}clearDebugDraw(){}};');
 for(const name of ['OFL-Exo2.txt','OFL-RussoOne.txt'])fs.copyFileSync('assets/game/'+name,path.join(root,name));
 const walk=dir=>{for(const item of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,item.name);if(item.isDirectory())walk(f);else if(f.endsWith('.js'))fs.writeFileSync(f,fs.readFileSync(f,'utf8').replace(/\/\/# sourceMappingURL=[^\r\n]+/g,''));}};walk(root);
 // No source maps. Compress dead branches left by build-time removal.
 for(const file of ['code0.js','yandex-adapter.js']){
  const result=await terser.minify(fs.readFileSync(path.join(root,file),'utf8'),{compress:{passes:2},mangle:false,format:{comments:false}});
  fs.writeFileSync(path.join(root,file),result.code);
 }
 console.log('Production adapter and code prepared');
})();
