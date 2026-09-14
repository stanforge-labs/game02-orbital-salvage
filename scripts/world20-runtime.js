module.exports=l=>{
 let [init,play,ui]=l.events.map(e=>e.inlineCode.join('\n'));
 // One owner for environment transforms: the old pool writer changed scale
 // every frame, forcing the final renderer to reconfigure the same sprites.
 const oldPOI=/^updatePool13\('ProcPOI'[^\n]+\n/m;
 if(!oldPOI.test(play))throw Error('World20 legacy POI writer missing');
 play=play.replace(oldPOI,'');
 ui=ui.replace(/^ scene\.getObjects\('ProcPOI'\)\.forEach\(o=>\{o\.setColor[^\n]+\n/m,'');
 init=init.replace("(event.pointerType==='touch'||event.pointerType==='pen')", "(event.pointerType==='touch'||event.pointerType==='pen'||window.__mobile20Touch===true)");
 init=init.replace("const devAllowed=", "const devAllowed=window.__mobile20Child===true||");
 ui=ui.replaceAll("matchMedia('(pointer:coarse)').matches", "(window.__mobile20Touch===true||matchMedia('(pointer:coarse)').matches)");
 // Existing manual DPR resize left the scene container at the previous backing
 // buffer scale after orientation changes. PIXI already applies resolution.
 // Normalize only this duplicate renderer scale; world camera/zoom is untouched.
 const resizeAnchor='renderer.resize(W,H);}';
 if(!ui.includes(resizeAnchor))throw Error('World20 renderer resize anchor missing');
 ui=ui.replace(resizeAnchor,resizeAnchor+"const root20=scene.getRenderer().getPIXIContainer();if(root20.scale.x!==1||root20.scale.y!==1)root20.scale.set(1,1);");
 init+='\nif(!runtimeScene.__world20Ready){runtimeScene.__world20Ready=true;const previous=runtimeScene.__g13Generate,world20='+require('./world20-world').toString()+';runtimeScene.__g13Generate=seed=>{previous(seed);world20(runtimeScene.__g13);};}';
 // Replace only previous environment writers; retain loot/HUD/secret owners.
 ui=ui.replace(/objects\('ProcPOI'\)\.forEach\([^\n]+\n/,'').replace(/objects\('Scenic18'\)\.forEach\([^\n]+\n/,'');
 ui+='\n('+require('./world20-ui').toString()+')(runtimeScene);';
 // Profiled text measurement/raster work also came from unchanged legacy
 // labels. Skip identical assignments only; moving text positions still update.
 // The nine HUD labels already have an ownership-aware cache in Polish19.
 init+=`\nif(!runtimeScene.__text20Cache){runtimeScene.__text20Cache=true;const owned=new Set(['CargoText','HullText','CreditsText','SectorText','SectorName16','MissionHeader16','MissionText','MissionProgress16','MissionReward16']);for(const o of runtimeScene.getAdhocListOfAllInstances()){if(typeof o.getString!=='function'||owned.has(o.getName()))continue;for(const method of ['setString','setCharacterSize','setWrappingWidth','setColor','setBold','setTextAlignment','setVerticalTextAlignment']){const f=o[method];if(typeof f!=='function')continue;let has=false,last;o[method]=function(value){if(has&&last===value)return;const result=f.call(this,value);has=true;last=value;return result;};}}}`;
 init+='\n('+require('./world20-mobile').toString()+')(runtimeScene);';
 l.events[0].inlineCode=[init];l.events[1].inlineCode=[play];l.events[2].inlineCode=[ui];
};
