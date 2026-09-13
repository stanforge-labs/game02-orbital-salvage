module.exports=function ui19(scene){
 // Release17 replaces the native menu with the DOM shell. The legacy title is
 // named Title (not MenuTitle); otherwise its top glyph can peek above the shell.
 if(scene.getVariables().get('GameState').getAsString()==='menu')for(const n of ['Title','PlayText','PlayButton'])scene.getObjects(n).forEach(o=>o.hide());
 if(scene.getVariables().get('GameState').getAsString()!=='play')return;
 const cam=scene.__osCam,s=scene.__os,W=scene.getGame().getGameResolutionWidth(),H=scene.getGame().getGameResolutionHeight();
 const sx=W/2+(s.x-cam.x)*2,sy=H/2+(s.y-cam.y)*2;
 const intersects=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
 const blocked=[{x:0,y:0,w:W,h:294},{x:sx-55,y:sy-55,w:110,h:110}];
 // Stable information bands (native HUD is centered at logical x=960).
 for(const name of ['NavMarker','RegionReveal','MeteorTelegraph','StatusText'])for(const o of scene.getObjects(name))if(!o.isHidden()&&o.getString())blocked.push({x:o.getX()-960+W/2-12,y:o.getY()-8,w:o.getWidth()+24,h:o.getHeight()+16});
 for(const name of ['PickupText','RiskLabel','StationLabel'])for(const o of scene.getObjects(name)){
  if(o.isHidden()||!o.getString())continue;
  // An off-screen station already has the compass. Do not turn its world label
  // into a second, misleading floating station marker near the player.
  if(name==='StationLabel'&&scene.getObjects('NavMarker').some(n=>!n.isHidden())){o.hide();continue;}
  const w=o.getWidth()*2,h=o.getHeight()*2;
  let x=(o.getX()-cam.x)*2+W/2,y=(o.getY()-cam.y)*2+H/2;
  const safe=(x,y)=>x>=24&&x+w<=W-24&&y>=294&&y+h<=H-220&&!blocked.some(b=>intersects({x,y,w,h},b));
  if(!safe(x,y)){
   if(name==='StationLabel'){o.hide();continue;}
   // Choose a side once per notification; do not flip sides each frame.
   if(o.__message19!==o.getString()){o.__message19=o.getString();o.__side19=sx<W/2?1:-1;}
   const side=o.__side19,sideX=side>0?sx+78:sx-w-78;
   const candidates=[[sideX,sy-h-30],[sideX,sy+35],[24,450],[W-w-24,450],[24,H-h-240],[W-w-24,H-h-240]];
   const found=candidates.find(([a,b])=>safe(a,b));
   if(found)[x,y]=found;else{if(name!=='PickupText'){o.hide();continue;}x=Math.max(24,Math.min(W-w-24,sideX));y=H-h-240;}
  }
  o.setPosition(cam.x+(x-W/2)/2,cam.y+(y-H/2)/2);blocked.push({x:x-10,y:y-10,w:w+20,h:h+20});
 }
};
