// Read-only browser instrumentation; deliberately absent from production runtime.
module.exports=function profile19(){
 const log=window.__perf19={frames:[],spikes:[],events:[],samples:[],textRasters:0,textMs:0,start:performance.now()};
 let last=0,lastSample=0,prev='',frameStart=0,frameCPU=0;
 const mark=(name,ms=0)=>log.events.push({t:performance.now(),name,ms});
 const wrap=(obj,key,label)=>{if(!obj||typeof obj[key]!=='function')return;const f=obj[key];obj[key]=function(...a){const t=performance.now(),r=f.apply(this,a);mark(label,performance.now()-t);return r;};};
 wrap(Storage.prototype,'setItem','save write');wrap(scene15,'__g13Generate','world generation');wrap(scene15,'createObject','object creation');
 wrap(scene15.__audio16,'unlock','audio unlock/context creation');
 const tone=scene15.__audio16.tone;scene15.__audio16.tone=function(k){const cold=!this.ctx,t=performance.now();const r=tone(k);mark((cold?'audio first-use ':'audio ')+k,performance.now()-t);return r;};
 const text=PIXI.Text.prototype.updateText;PIXI.Text.prototype.updateText=function(force){const dirty=this.dirty||force===false,t=performance.now(),r=text.apply(this,arguments);if(dirty){log.textRasters++;log.textMs+=performance.now()-t;}return r;};
 const step=gdjs.RuntimeScene.prototype.renderAndStep;gdjs.RuntimeScene.prototype.renderAndStep=function(...a){frameStart=performance.now();const r=step.apply(this,a);frameCPU=performance.now()-frameStart;return r;};
 try{new PerformanceObserver(list=>{for(const e of list.getEntries())mark('long task '+e.duration.toFixed(1),e.duration);}).observe({type:'longtask',buffered:true});}catch{}
 function frame(t){
  if(last){const dt=t-last;log.frames.push(dt);if(dt>20)log.spikes.push({t,dt,cpu:frameCPU,context:prev,events:log.events.filter(e=>e.t>=last-20&&e.t<=t+2)});}last=t;
  const s=window.scene15,g=s?.__g13,v=s?.getVariables();
  if(g){const key=[v.get('GameState').getAsString(),v.get('CurrentSector').getAsNumber(),g.region,g.secret.stage,g.chase16?.phase].join('/');if(key!==prev){mark('transition '+key);prev=key;}}
  if(s&&t-lastSample>1000){lastSample=t;log.samples.push({t,context:prev,instances:s.getAdhocListOfAllInstances().length,heap:performance.memory?.usedJSHeapSize,textRasters:log.textRasters,textMs:log.textMs,x:s.__os?.x,y:s.__os?.y});}
  requestAnimationFrame(frame);
 }requestAnimationFrame(frame);
 mark('resource timing baseline: '+performance.getEntriesByType('resource').length);
};
