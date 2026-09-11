module.exports=l=>{
 let [init,play,ui]=l.events.map(e=>e.inlineCode.join('\n'));
 init+='\nif(!runtimeScene.__release18){runtimeScene.__release18=true;runtimeScene.__world18='+require('./polish18-world').toString()+';{const gen=runtimeScene.__g13Generate;runtimeScene.__g13Generate=seed=>{gen(seed);runtimeScene.__world18(runtimeScene.__g13);};}';
 // Several legacy effects report the same event in one frame. Debounce audio,
 // not the gameplay event; never add oscillators or timers to the game loop.
 init+='\n{const a=runtimeScene.__audio16,tone=a.tone,last={};a.tone=kind=>{const now=performance.now(),gap=kind==="warning"?1200:kind==="hover"?120:kind==="gate"?300:60;if(now-(last[kind]??-10000)<gap)return;last[kind]=now;tone(kind);};runtimeScene.__audioGate18=last;}}';
 ui+='\n('+require('./polish18-ui').toString()+')(runtimeScene);';
 l.events[0].inlineCode=[init];l.events[1].inlineCode=[play];l.events[2].inlineCode=[ui];
};
