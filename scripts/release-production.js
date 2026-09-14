// Build-time removal, not a runtime DEV flag. Source/local QA remains intact.
const fs=require('fs'),acorn=require('../tools/release/node_modules/acorn'),walk=require('../tools/release/node_modules/acorn-walk');
const project=JSON.parse(fs.readFileSync('game.json','utf8'));
// This release uses Yandex only; do not send optional GDevelop session metrics.
project.properties.projectUuid='';
const layout=project.layouts[0];
function removeNodes(src){
 const ast=acorn.parse(src,{ecmaVersion:'latest',allowReturnOutsideFunction:true});const ranges=[];
 walk.simple(ast,{
  IfStatement(n){const test=src.slice(n.test.start,n.test.end);if(/devAllowed|dev13|s\.dev|ui\.devOpen|showDev13|visible10|__osQAState|devPanel|devText/.test(test))ranges.push([n.start,n.end,'']);},
  ExpressionStatement(n){const text=src.slice(n.start,n.end);if(/^window\.__osQAState|^window\.__mobile21Scene/.test(text))ranges.push([n.start,n.end,'']);}
 });
 ranges.sort((a,b)=>a[0]-b[0]||b[1]-a[1]);const outer=[];for(const r of ranges)if(!outer.length||r[0]>=outer.at(-1)[1])outer.push(r);
 for(const[a,b,s]of outer.reverse())src=src.slice(0,a)+';'+src.slice(b);return src;
}
for(const [i,e]of layout.events.entries()){
 let s=e.inlineCode.join('\n');
 if(i===0){
  const mobile='('+require('./world20-mobile').toString()+')(runtimeScene);';
  if(!s.includes(mobile))throw Error('Mobile QA module boundary missing');s=s.replace(mobile,'');
  const start=s.indexOf(" debug.innerHTML='<b>DEV"),end=s.indexOf('\n})(runtimeScene);',start);
  if(start<0||end<0)throw Error('DEV controls boundary missing');s=s.slice(0,start)+s.slice(end);
  s=s.replace(/const dev=button\(toolbar,'DEV',[^\n]+?;skip\.style/,'const dev={};skip.style');
  s=s.replace(/const devAllowed=[^;]+;/,'const devAllowed=false;');
  s=s.replace('audio.unlock=()=>{if(!audio.ctx)', 'audio.unlock=()=>{if(window.__osYandex?.isPaused())return;if(!audio.ctx)');
  s=s.replace("'confirm17','arcade']","'confirm17','arcade','arcadePause']").replace("if(st==='arcade')shell.exitArcade();","if(st==='arcade')state('arcadePause');else if(st==='arcadePause')state('arcade');");
  s=s.replace("scene.__prefs17=()=>localStorage.setItem('orbitalSettings17',JSON.stringify({master:audio.enabled,sfx:audio.sfx,ambience:audio.music}));","scene.__prefs17=()=>{try{localStorage.setItem('orbitalSettings17',JSON.stringify({master:audio.enabled,sfx:audio.sfx,ambience:audio.music}));}catch(e){console.warn('Settings storage unavailable');}};");
  s=s.replace(/else if\(typeof location!=='undefined'&&\(location.hostname==='localhost'\|\|location.hostname==='127.0.0.1'\)\)done\(true\);/,'');
 }
 s=removeNodes(s);
 s=s.replaceAll('ESC — назад','ESC — пауза');
 s=s.replace(/^.*const devAllowed(?:10|Ui10)=[^\n]+\n/gm,'').replace(/^.*const devInput(?:10|Ui10)=[^\n]+\n/gm,'').replace(/^.*const devKeyUi10=[^\n]+\n/gm,'');
 s=s.replace(/window\.__mobile20Child===true/g,'false').replace(/window\.__mobile20Touch===true/g,'false');
 s=s.replace('m.active?measure().width:oldW.call(R)','m.active?measure().width:Math.min(oldW.call(R),oldH.call(R)*2)');
 s=s.replace(/,dev13=typeof location[^;]+;/,';');
 s=s.replace(/const key11=devKeyUi10;/g,"const key11='';");
 // Pause all events (including Arcade and DOM action dispatch) before mutation.
 if(i===0)s='if(window.__osYandex?.isPaused())return;\n'+s;
 else s='if(window.__osYandex?.isPaused())return;\n'+s;
 if(i===0)s+='\n('+require('./release-lifecycle').toString()+')(runtimeScene);';
 if(i===2)s+="\nruntimeScene.__releaseUITick?.();window.__osYandex?.[(['play','arcade'].includes(runtimeScene.getVariables().get('GameState').getAsString()))?'gameplayStart':'gameplayStop']();if(!runtimeScene.__readyRelease){runtimeScene.__readyRelease=true;document.fonts.ready.then(()=>requestAnimationFrame(()=>window.__osYandex?.ready()));}";
 acorn.parse(s,{ecmaVersion:'latest',allowReturnOutsideFunction:true});
 e.inlineCode=[s];
}
layout.objects=layout.objects.filter(o=>!/^Dev/.test(o.name));layout.instances=layout.instances.filter(o=>!/^Dev/.test(o.name));
fs.writeFileSync('release-game.json',JSON.stringify(project));
console.log('Production project generated: developer control code removed; local QA source preserved');
