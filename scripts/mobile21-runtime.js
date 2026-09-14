// Mobile presentation only. The original action handlers remain authoritative.
module.exports = layout => {
 let [init,play,ui]=layout.events.map(e=>e.inlineCode.join('\n'));
 init='('+require('./mobile21-setup').toString()+')(runtimeScene);\n'+init;
 init=init.replace('const pointer=(event)=>{const canvas=',"const pointer=(event)=>{if(runtimeScene.__mobile21?.active&&event.target.closest?.('#mobile-hud21,#shell17 button,#shell17 .overlay,#shell17 .native21,#shell17 .debug')){if(runtimeScene.__osPointer)runtimeScene.__osPointer.active=false;return;}const canvas=");
 const top='const safeTop19=Math.max(460,270+32*safeH19/innerHeight+40),safeBottom19=safeH19-250;';
 if(!play.includes(top))throw Error('Mobile21 safe composition anchor missing');
 play=play.replace(top,`const mobile21=runtimeScene.__mobile21;
 const safeTop19=mobile21?.active?(mobile21.safe.top+94)*safeH19/mobile21.height:Math.max(460,270+32*safeH19/innerHeight+40),safeBottom19=mobile21?.active?safeH19-(mobile21.safe.bottom+70)*safeH19/mobile21.height:safeH19-250;`);
 play=play.replace('tx=Math.max(leadX19-(safeW19/2-70)/2,Math.min(leadX19+(safeW19/2-70)/2,tx));',`const left21=mobile21?.active?(mobile21.safe.left+28)*safeH19/mobile21.height:70,right21=mobile21?.active?safeW19-(mobile21.safe.right+28)*safeH19/mobile21.height:safeW19-70;
 tx=Math.max(leadX19-(right21-safeW19/2)/2,Math.min(leadX19+(safeW19/2-left21)/2,tx));`);
 play=play.replace('left:70,right:safeW19-70','left:left21,right:right21');
 // The existing renderer resize now receives the usable visual viewport.
 ui=ui.replace('const resolution=Math.max(devicePixelRatio||1,innerHeight/H);','const resolution=scene.__mobile21?.active?Math.max(.25,Math.min(2,(devicePixelRatio||1)*scene.__mobile21.height/H)):Math.max(devicePixelRatio||1,innerHeight/H);');
 ui+='\n('+require('./mobile21-ui').toString()+')(runtimeScene);';
 layout.events[0].inlineCode=[init];layout.events[1].inlineCode=[play];layout.events[2].inlineCode=[ui];
};
