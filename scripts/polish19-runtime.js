module.exports=l=>{
 let [init,play,ui]=l.events.map(e=>e.inlineCode.join('\n'));
 init+='\nif(!runtimeScene.__release19){runtimeScene.__release19=true;runtimeScene.__world19='+require('./polish19-world').toString()+';const previous19=runtimeScene.__g13Generate;runtimeScene.__g13Generate=seed=>{previous19(seed);runtimeScene.__world19(runtimeScene.__g13);};}';
 init+=`\nif(!runtimeScene.__hudOwner19){runtimeScene.__hudOwner19=true;
 for(const name of ['CargoText','HullText','CreditsText','SectorText','SectorName16','MissionHeader16','MissionText','MissionProgress16','MissionReward16'])for(const o of runtimeScene.getObjects(name)){
  for(const method of ['setString','setCharacterSize','setWrappingWidth','setColor','setBold','setTextAlignment','setVerticalTextAlignment']){
   const original=o[method];if(!original)continue;let last;
   o[method]=function(value){if(runtimeScene.getVariables().get('GameState').getAsString()==='play'&&!runtimeScene.__hudWrite19)return;if(last===value)return;last=value;return original.call(this,value);};
  }
 }} `;
 // Legacy passes still update menus/gameplay; only the final HUD owns its text.
 // GDevelop synchronously rasterizes text during style/position measurement.
 ui='runtimeScene.__hudWrite19=false;\n'+ui;
 const finalHUD='(function ui18(scene)';
 if(!ui.includes(finalHUD))throw Error('Final HUD writer missing');
 ui=ui.replace(finalHUD,'runtimeScene.__hudWrite19=true;\n'+finalHUD);
 // Construct the silent audio graph during scene loading, not on the first
 // flight click. Existing gesture unlock, settings and ad muting remain owners.
 init+=`\nif(!runtimeScene.__audioWarm19){runtimeScene.__audioWarm19=true;const a=runtimeScene.__audio16,AC=window.AudioContext||window.webkitAudioContext;
 if(a.enabled&&!a.ctx&&AC)try{a.ctx=new AC();a.master=a.ctx.createGain();a.master.gain.value=.18;a.master.connect(a.ctx.destination);a.ctx.suspend().catch(()=>{});}catch(e){a.ctx=null;console.warn('Audio prewarm unavailable',e.message);}}`;
 ui+='\n('+require('./polish19-ui').toString()+')(runtimeScene);';
 const anchor='ty=Math.max(270,Math.min(2730,ty));const smooth=';
 if(!play.includes(anchor))throw Error('Polish19 camera anchor changed');
 // Feed composition into the existing exponential follow, not ship coordinates.
 // A short velocity lead starts correction before the silhouette reaches UI.
 play=play.replace(anchor,`ty=Math.max(270,Math.min(2730,ty));
 const safeW19=runtimeScene.getGame().getGameResolutionWidth(),safeH19=runtimeScene.getGame().getGameResolutionHeight();
 const safeTop19=Math.max(460,270+32*safeH19/innerHeight+40),safeBottom19=safeH19-250;
 const leadX19=s.x+s.vx*.12,leadY19=s.y+s.vy*.12;
 tx=Math.max(leadX19-(safeW19/2-70)/2,Math.min(leadX19+(safeW19/2-70)/2,tx));
 ty=Math.max(leadY19-(safeBottom19-safeH19/2)/2,Math.min(leadY19+(safeH19/2-safeTop19)/2,ty));
 runtimeScene.__safe19={top:safeTop19,bottom:safeBottom19,left:70,right:safeW19-70};
 const smooth=`);
 l.events[0].inlineCode=[init];l.events[1].inlineCode=[play];l.events[2].inlineCode=[ui];
};
