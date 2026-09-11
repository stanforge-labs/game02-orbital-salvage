module.exports=function ui18(scene){
 const v=scene.getVariables(),N=k=>v.get(k).getAsNumber(),S=k=>v.get(k).getAsString(),s=scene.__os,g=scene.__g13,ui=scene.__ui17,st=S('GameState');if(!ui||!g)return;
 const W=scene.getGame().getGameResolutionWidth(),H=scene.getGame().getGameResolutionHeight(),secret=g.secret.stage>=4&&g.secret.stage<6;
 const objects=n=>scene.getObjects(n);
 if(!ui.style18){ui.style18=true;const css=document.createElement('style');css.textContent='#shell17 h1,#shell17 h2{letter-spacing:.04em;font-weight:750}#shell17 .eyebrow{letter-spacing:.22em}#shell17 .nav{line-height:1.3}#shell17 .nav small{line-height:1.4}';document.head.appendChild(css);}
 for(const name of ['Scenic18','SecretScene18'])objects(name).forEach(o=>o.hide());
 if(st!=='play')return;
 const L=960-W/2+50*1080/innerHeight,R=960+W/2-50*1080/innerHeight,top=42,height=228,cw=Math.min(632,W*.34),cx=960-cw/2;
 const rect=(o,x,y,w,h)=>{if(!o)return;o.setPosition(x,y);o.setWidth(w);o.setHeight(h);};
 rect(objects('HudPanel')[0],L,top,370,height);rect(objects('HudPanel')[1],R-392,top,392,height);rect(objects('MissionPanel')[0],cx,top,cw,height);
 const fit=(name,text,x,y,w,size,h,color='223;236;240',align='left',bold=false)=>{
  const o=objects(name)[0];if(!o)return;o.setString(text);o.setWrappingWidth(w);o.setCharacterSize(size);o.setBold(bold);o.setTextAlignment(align);o.setVerticalTextAlignment('top');o.setColor(color);o.hide(false);
  for(let k=0;k<8&&o.getHeight()>h&&size>17;k++){size--;o.setCharacterSize(size);}o.setPosition(x,y+Math.max(0,(h-o.getHeight())/2));return o;
 };
 fit('CargoText','ГРУЗ    '+N('Cargo')+' / '+N('CargoMax'),L+30,top+42,310,30,54,undefined,'left',true);
 fit('HullText','КОРПУС  '+N('Hull')+' / '+N('HullMax'),L+30,top+121,310,30,54,N('Hull')<=1?'255;157;107':undefined,'left',true);
 fit('CreditsText','КРЕДИТЫ  '+N('Credits'),R-360,top+38,330,29,50,'111;216;233','left',true);
 fit('SectorText','СЕКТОР '+N('CurrentSector'),R-360,top+104,330,24,34,undefined,'left',true);
 fit('SectorName16',g.regions[g.region]?.title||'',R-360,top+151,330,22,49,'161;187;201');
 fit('MissionHeader16','КОНТРАКТ',cx+30,top+25,cw-60,18,25,'129;177;195','center',true);
 const title=fit('MissionText',S('Mission'),cx+32,top+59,cw-64,28,64,'233;239;230','center',true);
 let progress=N('MissionProgress')+' / '+N('MissionTarget');const mt=S('MissionType'),timed=N('MissionTimeLimit')>0;
 if(mt==='nodamage')progress='ГРУЗ '+N('Cargo')+'/'+N('MissionTarget')+'  ·  '+(N('RunDamage')?'ЕСТЬ УРОН':'КОРПУС ЦЕЛ');
 if(mt==='speed')progress='ГРУЗ '+N('Cargo')+'/'+N('MissionTarget');
 if(timed)progress+='  ·  '+Math.max(0,Math.ceil(N('MissionTimeLimit')-N('RunTime')))+' С';
 fit('MissionProgress16',progress,cx+30,top+131,cw-60,25,35,'223;237;241','center',true);
 fit('MissionReward16','НАГРАДА  '+N('MissionReward')+(N('MissionTechReward')?'  +  1 ДЕТАЛЬ':''),cx+30,top+181,cw-60,20,28,'228;195;129','center');
 ui.hud18={titleHeight:title?.getHeight(),titleSize:title?.getCharacterSize(),panelWidth:cw,panelHeight:height};
 const status=objects('StatusText')[0];if(status&&!status.isHidden())fit('StatusText',status.getString(),L,top+height+30,395,18,62,'219;185;205','left');
 for(const[n,y]of [['NavMarker',top+height+35],['RegionReveal',top+height+95],['MeteorTelegraph',top+height+106]])for(const o of objects(n))o.setY(y);
 // Native text is projected in world pixels. Push only text, never colliders.
 const cam=scene.__osCam;for(const n of ['StationLabel','PickupText','RiskLabel'])for(const o of objects(n)){if(o.isHidden())continue;const y=(o.getY()-cam.y)*2+H/2;if(y<top+height+30)o.setY(cam.y+(top+height+30-H/2)/2);}
 const draw=(o,d,alpha)=>{o.pauseAnimation();o.setAnimationFrame(d.frame);o.setWidth(d.size);o.setHeight(d.size*.75);o.setAngle(d.angle);o.setCenterPositionInScene(d.x,d.y);o.setColor('255;255;255');o.setOpacity(alpha);o.hide(Math.hypot(s.x-d.x,s.y-d.y)>1250);};
 // Opaque HUD occludes the world naturally. No whole-sprite hide at panel edges:
 // this removes apparent popping while travelling underneath the HUD.
 objects('ProcPOI').forEach((o,i)=>{const d=g.pois[i];if(!d||secret){o.hide();return;}draw(o,d,d.primary?226:183);});
 objects('Scenic18').forEach((o,i)=>{const d=g.scenic18[i];if(!d||secret)return;draw(o,d,154);});
 // Fixed sizes, not multiplied current size: stable through pause/resize/frames.
 const sizes={scrap:[38,35],energy:[45,45],data:[45,45],heavy:[53,48]},names={scrap:'ProcScrap',energy:'ProcEnergy',data:'ProcData',heavy:'ProcHeavy'};
 for(const kind of Object.keys(names))objects(names[kind]).forEach((o,i)=>{const d=g.loot18[kind][i];if(!d||d.taken||secret){o.hide();return;}const[a,b]=sizes[kind];o.setWidth(a);o.setHeight(b);o.setCenterPositionInScene(d.x,d.y);o.setOpacity(255);o.hide(Math.hypot(s.x-d.x,s.y-d.y)>1220);});
 if(N('CurrentSector')===2){const k=objects('G13Key')[0];if(k){k.setWidth(70);k.setHeight(70);k.setCenterPositionInScene(g.key.x,g.key.y);k.hide(g.secret.stage!==1);}const c=objects('G13Cache')[0];if(c&&secret){c.setWidth(112);c.setHeight(112);const p=g.secret.map15?.cache;if(p)c.setCenterPositionInScene(...p);}}
 if(secret){const m=g.secret.map15;if(m)objects('SecretScene18').forEach((o,i)=>{const p=m.route[i];if(!p)return;o.pauseAnimation();o.setAnimationFrame((m.template+i)%6);o.setWidth(162);o.setHeight(162);o.setAngle(0);o.setCenterPositionInScene(...p);o.setOpacity(170);o.hide(Math.hypot(s.x-p[0],s.y-p[1])>950);});}
};
